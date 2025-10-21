import { useRouter } from "next/router";
import { useMemo } from "react";
import { scoreAnswers, bucketize, bucketCopy } from "@/data/assessment";
import { recommend } from "@/data/recommendations";
import Link from "next/link";
import { t } from "@/lib/i18n";

function Chip({ text }: { text: string }) {
  return <span className="inline-block px-2 py-1 rounded-full bg-brand-100 text-ink-900 text-xs font-medium">{text}</span>;
}
function Card({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 border">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <p className="text-sm mt-2">{body}</p>
      {children}
    </div>
  );
}

export default function Results() {
  const router = useRouter();
  const locale = (router.locale as "en"|"es") || "en";
  const copy = bucketCopy[locale];

  const ans = useMemo(() => {
    try { return JSON.parse((router.query.a as string) || "{}"); }
    catch { return {}; }
  }, [router.query.a]);

  const s = scoreAnswers(ans);
  const buckets = {
    habits: bucketize(s.habits, s.maxHabits),
    confidence: bucketize(s.confidence, s.maxConfidence),
    stability: bucketize(s.stability, s.maxStability)
  };

  const tally = { start:0, building:0, strong:0 } as Record<"start"|"building"|"strong", number>;
  (Object.values(buckets) as ("start"|"building"|"strong")[]).forEach(b => (tally[b] += 1));
  const overall = (()=> {
    if (tally.strong >= 2) return "strong";
    if (tally.building >= 2) return "building";
    if (tally.start >= 2) return "start";
    if (tally.building) return "building";
    if (tally.start) return "start";
    return "strong";
  })();

  const recs = recommend(buckets, locale);

  const label = (k:"start"|"building"|"strong") =>
    k==="start" ? t(locale, "bStart") : k==="building" ? t(locale, "bBuild") : t(locale, "bStrong");

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {t(locale, "resultsTitle")}
      </h1>

      {/* Overall card */}
      <Card
        title={`${t(locale, "overall")} — ${label(overall)}`}
        body={copy.overall[overall]}
      >
        <div className="mt-2 space-x-2">
          <Chip text={`${t(locale, "habits")}: ${label(buckets.habits)}`} />
          <Chip text={`${t(locale, "confidence")}: ${label(buckets.confidence)}`} />
          <Chip text={`${t(locale, "stability")}: ${label(buckets.stability)}`} />
        </div>
        <div className="mt-4">
          <Link href={{ pathname:"/plan", query:{ a: JSON.stringify(ans) }}} className="px-4 py-2 rounded-xl bg-brand-500 text-white no-underline">
            {t(locale, "makePlan")}
          </Link>
        </div>
      </Card>

      {/* Dimension cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <Card title={t(locale, "habits")} body={copy.dim.habits[buckets.habits]} />
        <Card title={t(locale, "confidence")} body={copy.dim.confidence[buckets.confidence]} />
        <Card title={t(locale, "stability")} body={copy.dim.stability[buckets.stability]} />
      </div>

      {/* Tailored recommendations */}
      <h2 className="text-xl font-semibold mt-8 mb-3">{t(locale, "helpfulNext")}</h2>
      <ul className="list-disc ml-6 space-y-2">
        {recs.map((r, idx) => (
          <li key={idx}>
            {r.href.startsWith("http") ? (
              <a className="no-underline" href={r.href} target="_blank" rel="noreferrer">{r.title}</a>
            ) : (
              <Link className="no-underline" href={r.href}>{r.title}</Link>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-3">
        <Link href="/resources" className="px-4 py-2 rounded-xl border no-underline">
          {t(locale, "exploreTools")}
        </Link>
        <Link href="/products" className="px-4 py-2 rounded-xl bg-brand-500 text-white no-underline">
          {t(locale, "seeProducts")}
        </Link>
      </div>
    </section>
  );
}
