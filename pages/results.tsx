import { useRouter } from "next/router";
import { useMemo } from "react";
import { scoreAnswers, bucketize5 } from "@/data/assessment";
import { bucketCopy5 } from "@/data/results_copy";
import { recommend } from "@/data/recommendations";
import { personaCopy, getPersona } from "@/data/personas";
import Link from "next/link";
import { t } from "@/lib/i18n";

function Bar({ pct }: { pct:number }) {
  return (
    <div className="h-2 rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${Math.max(0,Math.min(100,Math.round(pct)))}%` }} />
    </div>
  );
}

export default function Results() {
  const router = useRouter();
  const locale = (router.locale as "en"|"es") || "en";
  const copy = bucketCopy5(locale);
  const pcopy = personaCopy(locale);

  const ans = useMemo(() => {
    try { return JSON.parse((router.query.a as string) || "{}"); }
    catch { return {}; }
  }, [router.query.a]);

  const s = scoreAnswers(ans);
  const dims = [
    { key:"habits", label: t(locale,"habits") },
    { key:"confidence", label: t(locale,"confidence") },
    { key:"stability", label: t(locale,"stability") },
  ] as const;

  const buckets = {
    habits: bucketize5(s.habits, s.maxHabits),
    confidence: bucketize5(s.confidence, s.maxConfidence),
    stability: bucketize5(s.stability, s.maxStability)
  };

  // Persona
  const persona = getPersona(buckets);
  const personaTitle = `${pcopy.icon[persona]} ${pcopy.label[persona]}`;

  // Overall badge via average of bucket ranks
  const rank: Record<string, number> = { rebuilding:1, getting_started:2, progress:3, on_track:4, empowered:5 };
  const avg = (rank[buckets.habits] + rank[buckets.confidence] + rank[buckets.stability]) / 3;
  const overall =
    avg < 1.5 ? "rebuilding" :
    avg < 2.5 ? "getting_started" :
    avg < 3.5 ? "progress" :
    avg < 4.5 ? "on_track" : "empowered";

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">{t(locale,"resultsTitle")}</h1>

      {/* Persona panel */}
      <div className="bg-white rounded-2xl shadow p-4 border mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-ink-900">{personaTitle}</h2>
            <p className="text-sm mt-1">{pcopy.summary[persona]}</p>
          </div>
          <Link href={{ pathname:"/plan", query:{ a: JSON.stringify(ans) }}}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white no-underline w-full md:w-auto text-center">
            {t(locale,"makePlan")}
          </Link>
        </div>
      </div>

      {/* Dimension cards */}
      <div className="bg-white rounded-2xl shadow p-4 border">
        <h2 className="text-xl font-semibold text-ink-900">
          {copy.overall.title(overall)}
        </h2>
        <p className="text-sm mt-2">{copy.overall.body(overall)}</p>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {dims.map(d => {
            const value = s[d.key];
            const max = s[`max${d.key[0].toUpperCase()+d.key.slice(1)}` as "maxHabits"|"maxConfidence"|"maxStability"];
            const pct = (value/Math.max(1,max))*100;
            const label = copy.labels[
              (d.key === "habits" ? buckets.habits : d.key === "confidence" ? buckets.confidence : buckets.stability)
            ];
            const items = copy.dim[d.key as "habits"|"confidence"|"stability"].strengths(
              (d.key === "habits" ? buckets.habits : d.key === "confidence" ? buckets.confidence : buckets.stability)
            );
            return (
              <div key={d.key} className="bg-white rounded-xl border p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{d.label}</span>
                  <span className="text-slate-600">{label}</span>
                </div>
                <div className="mt-2"><Bar pct={pct} /></div>
                <ul className="mt-2 text-sm list-disc ml-5">
                  {items.map((x,i)=><li key={i}>{x}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tailored recommendations */}
      <h2 className="text-xl font-semibold mt-8 mb-3">{t(locale,"helpfulNext")}</h2>
      <ul className="list-disc ml-6 space-y-2">
        {recommend(buckets, locale).map((r, idx) => (
          <li key={idx}>
            {r.href.startsWith("http") ? (
              <a className="no-underline" href={r.href} target="_blank" rel="noreferrer">{r.title}</a>
            ) : (
              <Link className="no-underline" href={r.href}>{r.title}</Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
