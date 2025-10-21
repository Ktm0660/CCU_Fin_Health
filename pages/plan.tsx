import { useRouter } from "next/router";
import { useMemo } from "react";
import { scoreAnswers, bucketize, bucketCopy } from "@/data/assessment";
import { recommend } from "@/data/recommendations";
import { t } from "@/lib/i18n";

export default function Plan() {
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

  const recs = recommend(buckets, locale);
  const label = (k:"start"|"building"|"strong") =>
    k==="start" ? t(locale, "bStart") : k==="building" ? t(locale, "bBuild") : t(locale, "bStrong");

  return (
    <section className="print:p-0">
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">{t(locale, "planTitle")}</h1>
      <p className="text-slate-700 mb-4">{t(locale, "planIntro")}</p>

      <div className="bg-white rounded-2xl shadow p-4 border">
        <h2 className="font-semibold text-ink-900">1) {t(locale, "habits")} — {label(buckets.habits)}</h2>
        <p className="text-sm mt-1">{copy.dim.habits[buckets.habits]}</p>
        <h2 className="font-semibold text-ink-900 mt-4">2) {t(locale, "confidence")} — {label(buckets.confidence)}</h2>
        <p className="text-sm mt-1">{copy.dim.confidence[buckets.confidence]}</p>
        <h2 className="font-semibold text-ink-900 mt-4">3) {t(locale, "stability")} — {label(buckets.stability)}</h2>
        <p className="text-sm mt-1">{copy.dim.stability[buckets.stability]}</p>

        <h3 className="font-semibold text-ink-900 mt-5">{t(locale, "helpfulNext")}</h3>
        <ul className="list-disc ml-6 space-y-2 mt-2">
          {recs.slice(0,6).map((r, i) => (
            <li key={i}>{r.title}</li>
          ))}
        </ul>

        <button
          onClick={() => window.print()}
          className="mt-4 px-4 py-2 rounded-xl bg-brand-500 text-white"
        >
          {t(locale, "planPrint")}
        </button>
      </div>
    </section>
  );
}
