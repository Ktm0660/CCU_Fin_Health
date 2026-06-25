import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { scoreAnswers, bucketize5, bucketCopy, type Score, type AnswerMap, questionsBase, type BucketKey5 } from "@/data/assessment";
import { recommend, type RecommendationCard } from "@/data/recommendations";
import { getLangWithSource, hrefWithLang, type Lang, type LangSource } from "@/lib/lang";
import { computePillarMetrics } from "@/lib/resultsShared";
import { readAnswersWithSource, shouldShowDebug } from "@/lib/resultsDebug";
import { ResultsDebugPanel } from "@/components/ResultsDebugPanel";

const resultCopy: Record<BucketKey5, {
  heading: string;
  meaning: string;
  nextSteps: string[];
}> = {
  building: {
    heading: "You have a starting point — and you do not have to figure it out alone.",
    meaning:
      "Your answers suggest day-to-day money pressure may be taking up a lot of space right now. This result is not a judgment or a credit decision. It simply points to a few small steps that can make the next week feel more manageable.",
    nextSteps: [
      "Pick one bill or due date to organize first, and write down the amount, date, and next action.",
      "Set one low-balance or deposit alert so fewer surprises land without warning.",
      "Choose a very small safety-buffer goal, even $5–$10, and keep it separate from spending money.",
    ],
  },
  getting_started: {
    heading: "You are getting organized and building momentum.",
    meaning:
      "Your answers suggest some helpful pieces are already in place, with room to make routines easier and less stressful. This result is a learning snapshot, not a judgment or a decision about credit.",
    nextSteps: [
      "Create a simple weekly money check-in: what came in, what is due, and what can wait.",
      "Turn on reminders or safe autopay for minimum payments where it helps you avoid missed dates.",
      "Start or restart a small buffer with an amount that feels realistic on payday.",
    ],
  },
  progress: {
    heading: "You are making progress with habits you can build on.",
    meaning:
      "Your answers suggest you have useful routines started. The next opportunity is to reduce friction, protect the progress you have made, and make your next steps easier to repeat.",
    nextSteps: [
      "Choose one routine to automate, such as a reminder, transfer, or minimum payment.",
      "Review one spending category for a practical adjustment you can keep for the next month.",
      "Check one credit or account detail you have been meaning to understand, then write down any questions.",
    ],
  },
  on_track: {
    heading: "You are on track and ready to strengthen your plan.",
    meaning:
      "Your answers suggest you have a steady foundation. This result highlights ways to keep that foundation resilient when expenses, goals, or income change.",
    nextSteps: [
      "Name one upcoming expense and set aside a small amount for it before it becomes urgent.",
      "Schedule a monthly review of accounts, due dates, fees, and savings progress.",
      "Compare your current tools with lower-stress options, such as alerts, savings pockets, or no-surprise accounts.",
    ],
  },
  empowered: {
    heading: "You have a strong foundation to keep growing from.",
    meaning:
      "Your answers suggest many day-to-day pieces are working well. The next step is to keep things simple, protect against surprises, and align your routines with the goals that matter most to you.",
    nextSteps: [
      "Choose one 6–12 month goal and break it into a monthly amount or next action.",
      "Look for hidden costs, unused services, or fees that could be reduced or removed.",
      "Review your safety buffer and decide whether it still fits your current life and goals.",
    ],
  },
};

export default function Results() {
  const router = useRouter();
  const langMeta: { lang: Lang; source: LangSource } =
    typeof window !== "undefined" ? getLangWithSource() : { lang: "en", source: "default" as const };
  const [answerState, setAnswerState] = useState<{ answers: AnswerMap; sourceKey: string }>({ answers: {}, sourceKey: "none" });

  useEffect(() => {
    setAnswerState(readAnswersWithSource(router.query.a));
  }, [router.query.a]);

  const { answers, sourceKey } = answerState;
  const hasAnswers = Object.keys(answers || {}).length > 0;

  const s = useMemo<Score>(() => scoreAnswers(questionsBase, answers), [answers]);
  const metrics = useMemo(() => computePillarMetrics(s), [s]);
  const bucketInfo = useMemo(() => bucketize5(s), [s]);
  const key = (typeof bucketInfo === "string" ? bucketInfo : bucketInfo.key) as BucketKey5;
  const copy = (bucketCopy as any)[key]?.[langMeta.lang] || { title: "Your result" };
  const memberCopy = resultCopy[key];
  const recs = useMemo(() => recommend(key), [key]) as RecommendationCard[];

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const retakeHref = hrefWithLang("/assessment", langMeta.lang);
  const resourcesHref = hrefWithLang("/resources", langMeta.lang);
  const glossaryHref = hrefWithLang("/glossary", langMeta.lang);
  const learnHref = hrefWithLang("/learn", langMeta.lang);
  const debugVisible = shouldShowDebug(router.query.debug);

  return (
    <section className="space-y-6 pb-8">
      <div className="rounded-3xl border bg-gradient-to-br from-brand-50 via-white to-white p-5 shadow md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Financial health snapshot</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-ink-900 md:text-4xl">{memberCopy.heading}</h1>
            <div className="mt-4 inline-flex rounded-full border bg-white px-3 py-1 text-sm font-medium text-slate-800">
              Result: {copy.title}
            </div>
          </div>
          <Link href={retakeHref} className="w-full rounded-xl border bg-white px-4 py-2 text-center text-sm font-medium no-underline shadow-sm md:w-auto">
            Retake assessment
          </Link>
        </div>

        {!hasAnswers && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
            We could not find saved assessment answers on this device. You can retake the assessment to refresh this snapshot.
          </div>
        )}

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-800 md:text-lg">{memberCopy.meaning}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border bg-white p-5 shadow md:p-6" aria-labelledby="next-steps-heading">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Start here</p>
          <h2 id="next-steps-heading" className="mt-1 text-2xl font-semibold text-ink-900">Your 3 next steps</h2>
          <p className="mt-2 text-slate-700">These are meant to be practical, small enough to start, and easy to adjust to your situation.</p>
          <ol className="mt-5 space-y-4">
            {memberCopy.nextSteps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border bg-slate-50 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">{index + 1}</span>
                <span className="text-slate-800">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <aside className="rounded-3xl border bg-brand-500 p-5 text-white shadow md:p-6" aria-labelledby="connections-cta-heading">
          <h2 id="connections-cta-heading" className="text-2xl font-semibold">Talk to someone at Connections</h2>
          <p className="mt-3 leading-relaxed text-brand-50">If you want help thinking through these steps, a Connections team member can help you understand options, ask questions, and choose a next step that feels comfortable.</p>
          <div className="mt-5 grid gap-3 text-sm">
            <Link href={hrefWithLang("/", langMeta.lang)} className="rounded-xl bg-white px-4 py-3 text-center font-semibold text-brand-700 no-underline">Contact Connections</Link>
            <Link href={resourcesHref} className="rounded-xl border border-white/70 px-4 py-3 text-center font-semibold text-white no-underline">Browse resources first</Link>
          </div>
        </aside>
      </div>

      <section className="rounded-3xl border bg-white p-5 shadow md:p-6" aria-labelledby="learning-heading">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Continue learning</p>
            <h2 id="learning-heading" className="text-2xl font-semibold text-ink-900">Helpful resources for this result</h2>
          </div>
          <Link href={learnHref} className="text-sm font-semibold text-brand-700 underline">See learning center</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {recs.map((r) => (
            <article key={r.slug} className="rounded-2xl border bg-slate-50 p-4">
              <h3 className="font-semibold text-ink-900">{langMeta.lang === "en" ? r.title_en : r.title_es}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{langMeta.lang === "en" ? r.summary_en : r.summary_es}</p>
              <Link href={hrefWithLang(r.href, langMeta.lang)} className="mt-3 inline-block text-sm font-semibold text-brand-700 underline">Open resource →</Link>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href={resourcesHref} className="rounded-xl border px-4 py-3 text-center font-medium no-underline">All resources</Link>
          <Link href={glossaryHref} className="rounded-xl bg-ink-900 px-4 py-3 text-center font-medium text-white no-underline">Plain-language glossary</Link>
        </div>
      </section>

      <section className="rounded-3xl border bg-slate-50 p-5 text-sm leading-relaxed text-slate-700 md:p-6" aria-label="Educational disclaimer">
        <strong className="text-ink-900">A quick note:</strong> This assessment is educational and anonymous. It is not a credit decision, loan approval, or offer of credit. It is not financial, legal, tax, or investment advice. Your result is meant to help you choose learning resources and conversation starters.
      </section>

      <ResultsDebugPanel
        show={debugVisible}
        answers={answers}
        sourceKey={sourceKey}
        langMeta={langMeta}
        metrics={metrics as any}
      />
    </section>
  );
}
