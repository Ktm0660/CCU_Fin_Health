import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { bucketCopy, questionsBase, scoreAnswers, type AnswerMap, type Pillar } from "@/data/assessment";
import { getLangWithSource, hrefWithLang, type Lang, type LangSource } from "@/lib/lang";
import { computePillarMetrics } from "@/lib/resultsShared";
import { readAnswersWithSource, shouldShowDebug } from "@/lib/resultsDebug";
import { ActionPlan } from "@/components/ActionPlan";
import { ResultsDebugPanel } from "@/components/ResultsDebugPanel";

type PillarCopy = {
  title: string;
  summary: string;
};

const LS_KEYS = ["assessmentV2Answers", "lastAnswers"];

export default function ResultsV2() {
  const router = useRouter();
  const langMeta: { lang: Lang; source: LangSource } =
    typeof window !== "undefined" ? getLangWithSource() : { lang: "en", source: "default" as const };
  const [answerState, setAnswerState] = useState<{ answers: AnswerMap; sourceKey: string }>({ answers: {}, sourceKey: "none" });

  useEffect(() => {
    setAnswerState(readAnswersWithSource(router.query.a, LS_KEYS));
  }, [router.query.a]);

  const { answers, sourceKey } = answerState;
  const hasAnswers = Object.keys(answers || {}).length > 0;
  const score = useMemo(() => scoreAnswers(questionsBase, answers), [answers]);
  const metrics = useMemo(() => computePillarMetrics(score), [score]);

  const copies = useMemo(() => {
    const result: Partial<Record<Pillar, PillarCopy>> = {};
    (Object.keys(metrics) as Pillar[]).forEach(p => {
      const bucket = metrics[p]?.bucket;
      if (bucket) {
        const c = bucketCopy[bucket]?.[langMeta.lang];
        if (c) result[p] = { title: c.title, summary: c.summary };
      }
    });
    return result;
  }, [langMeta.lang, metrics]);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const retakeHref = hrefWithLang("/assessment", langMeta.lang);
  const toolsHref = hrefWithLang("/tools", langMeta.lang);
  const homeHref = hrefWithLang("/", langMeta.lang);
  const debugVisible = shouldShowDebug(router.query.debug);

  return (
    <section className="p-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">
          {langMeta.lang === "en" ? "Your snapshot" : "Tu panorama"}
        </h1>
        <p className="text-slate-700 mt-2">
          {langMeta.lang === "en"
            ? "Here’s a quick read on your money picture. This isn’t a judgment—just a map for next steps."
            : "Un vistazo rápido a tu situación financiera. No es un juicio, sino una guía para los próximos pasos."}
        </p>

        {!hasAnswers && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-amber-900 font-medium">
              {langMeta.lang === "en"
                ? "We couldn't find your assessment answers."
                : "No pudimos encontrar tus respuestas de la evaluación."}
            </p>
            <p className="text-slate-800 mt-1">
              {langMeta.lang === "en"
                ? "Please retake the assessment to see your results."
                : "Vuelve a tomar la evaluación para ver tus resultados."}
            </p>
            <div className="mt-3">
              <Link href={retakeHref} className="underline">
                {langMeta.lang === "en" ? "Retake assessment" : "Repetir evaluación"}
              </Link>
            </div>
          </div>
        )}

        {hasAnswers && (
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            {(Object.keys(metrics) as Pillar[]).map((pillar) => {
              const metric = metrics[pillar];
              const copy = copies[pillar];
              const label = pillar.charAt(0).toUpperCase() + pillar.slice(1);
              return (
                <div key={pillar} className="rounded-xl border p-4 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <b className="capitalize">{label}</b>
                    <span className="text-sm text-slate-600">
                      {metric.raw} / {metric.max}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full mt-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${Math.min(100, metric.pct)}%`, background: "#006a4e" }}
                    />
                  </div>
                  <div className="mt-3 text-sm text-slate-800">
                    <div className="font-semibold text-slate-900">
                      {copy?.title || (langMeta.lang === "en" ? "Keep going" : "Sigue avanzando")}
                    </div>
                    <p className="mt-1 leading-relaxed">
                      {copy?.summary ||
                        (langMeta.lang === "en"
                          ? "Your answers help us tailor next steps for this area."
                          : "Tus respuestas nos ayudan a personalizar los próximos pasos en esta área.")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex gap-3 flex-wrap">
          <Link href={toolsHref} className="px-4 py-2 rounded-xl border">
            {langMeta.lang === "en" ? "Tools & resources" : "Herramientas y recursos"}
          </Link>
          <Link href={homeHref} className="px-4 py-2 rounded-xl text-white" style={{ background: "#006a4e" }}>
            {langMeta.lang === "en" ? "Home" : "Inicio"}
          </Link>
          <Link href={retakeHref} className="px-4 py-2 rounded-xl underline">
            {langMeta.lang === "en" ? "Retake assessment" : "Repetir evaluación"}
          </Link>
        </div>

        <ActionPlan lang={langMeta.lang} metrics={metrics} hasAnswers={hasAnswers} retakeHref={retakeHref} />

        <ResultsDebugPanel
          show={debugVisible}
          answers={answers}
          sourceKey={sourceKey}
          langMeta={langMeta}
          metrics={metrics as any}
        />
      </div>
    </section>
  );
}
