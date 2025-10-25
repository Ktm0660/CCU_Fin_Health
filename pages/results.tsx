import { useRouter } from "next/router";
import { useMemo } from "react";
import Link from "next/link";
import { scoreAnswers } from "@/data/assessment";
import { bucketize5 } from "@/data/assessment";
import { personaCopy, getPersona } from "@/data/personas";
import { pickLessons, Area, Level } from "@/data/lessons";
import LessonCard from "@/components/LessonCard";

export default function Results() {
  const router = useRouter();
  const locale = (router.locale as "en"|"es") || "en";
  const ans = useMemo(() => {
    try { return JSON.parse((router.query.a as string) || "{}"); }
    catch { return {}; }
  }, [router.query.a]);

  const s = scoreAnswers(ans);
  const buckets = {
    habits: bucketize5(s.habits, s.maxHabits),
    confidence: bucketize5(s.confidence, s.maxConfidence),
    stability: bucketize5(s.stability, s.maxStability),
  };

  // Persona + weakest area
  const pcopy = personaCopy(locale);
  const persona = getPersona(buckets);
  const ranks: Record<string, number> = { rebuilding: 1, getting_started: 2, progress: 3, on_track: 4, empowered: 5 };
  const ordered = [
    { k: "stability", r: ranks[buckets.stability] },
    { k: "habits",    r: ranks[buckets.habits] },
    { k: "confidence",r: ranks[buckets.confidence] },
  ].sort((a,b) => a.r - b.r);
  const weakest = ordered[0].k as Area;

  // Map persona to a starting level
  const personaLevelMap: Record<string, Level> = {
    rebuilding: "discover",
    getting_started: "stabilize",
    progress: "grow",
    on_track: "grow",
    empowered: "thrive",
  };
  const startLevel = personaLevelMap[persona];

  const L = (en: string, es: string) => (locale === "en" ? en : es);

  const recs = pickLessons(weakest, startLevel, locale, 3);

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {L("Your guided path", "Tu ruta guiada")}
      </h1>

      {/* Friendly summary */}
      <div className="bg-white rounded-2xl shadow p-4 border">
        <p className="text-sm text-slate-700">
          <b>{pcopy.icon[persona]} {pcopy.label[persona]}.</b> {pcopy.summary[persona]}
        </p>
        <p className="text-sm text-slate-700 mt-2">
          {L(
            "We picked a few tiny lessons to start—clear, judgment-free, and doable today.",
            "Elegimos algunas lecciones pequeñas para empezar—claras, sin juicios y posibles hoy."
          )}
        </p>
      </div>

      {/* Recommended lessons */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        {L("Start here", "Empieza aquí")}
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {recs.map(lsn => (
          <LessonCard key={lsn.id} lesson={lsn} locale={locale} />
        ))}
      </div>

      {/* Keep learning */}
      <div className="bg-brand-50/60 rounded-2xl p-4 border mt-6">
        <p className="text-sm">
          {L(
            "Want more? Browse all short lessons by topic.",
            "¿Quieres más? Explora todas las lecciones cortas por tema."
          )}
        </p>
        <Link href="/learn" className="inline-flex mt-3 rounded-xl border px-3 py-2 no-underline">
          {L("Explore lessons", "Explorar lecciones")}
        </Link>
      </div>

      {/* Optional: back to plan */}
      <div className="mt-6">
        <Link href={{ pathname: "/plan", query: { a: JSON.stringify(ans) } }} className="px-4 py-2 rounded-xl border no-underline">
          {L("See my action path", "Ver mi ruta de acción")}
        </Link>
      </div>
    </section>
  );
}
