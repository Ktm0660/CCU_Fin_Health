import { useRouter } from "next/router";
import { useMemo } from "react";
import Link from "next/link";
import { scoreAnswers, bucketize5 } from "@/data/assessment";
import { personaCopy, getPersona } from "@/data/personas";
import { pickLessons, Area, Level } from "@/data/lessons";
import LessonCard from "@/components/LessonCard";

export default function Results() {
  const router = useRouter();
  const locale = (router.locale as "en"|"es") || "en";
  const L = (en: string, es: string) => (locale === "en" ? en : es);

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

  // Persona + weakest area + starting level
  const pcopy = personaCopy(locale);
  const persona = getPersona(buckets);
  const ranks: Record<string, number> = { rebuilding: 1, getting_started: 2, progress: 3, on_track: 4, empowered: 5 };
  const ordered = [
    { k: "stability", r: ranks[buckets.stability] },
    { k: "habits",    r: ranks[buckets.habits] },
    { k: "confidence",r: ranks[buckets.confidence] },
  ].sort((a,b) => a.r - b.r);
  const weakest = ordered[0].k as Area;

  const personaLevelMap: Record<string, Level> = {
    rebuilding: "discover",
    getting_started: "stabilize",
    progress: "grow",
    on_track: "grow",
    empowered: "thrive",
  };
  const startLevel = personaLevelMap[persona];

  const recs = pickLessons(weakest, startLevel, locale, 3);

  // Localized bucket labels
  const BUCKET_LABELS_EN: Record<string,string> = {
    rebuilding: "Rebuilding",
    getting_started: "Getting Started",
    progress: "Making Progress",
    on_track: "On Track",
    empowered: "Empowered",
  };
  const BUCKET_LABELS_ES: Record<string,string> = {
    rebuilding: "Reconstruyendo",
    getting_started: "Empezando",
    progress: "Tomando ritmo",
    on_track: "En buen camino",
    empowered: "Con control",
  };
  const BL = locale === "en" ? BUCKET_LABELS_EN : BUCKET_LABELS_ES;

  // UI helpers
  const chipColor = (b: string) =>
    b === "rebuilding" ? "bg-rose-50 text-rose-700 border-rose-200" :
    b === "getting_started" ? "bg-amber-50 text-amber-700 border-amber-200" :
    b === "progress" ? "bg-sky-50 text-sky-700 border-sky-200" :
    b === "on_track" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
    "bg-violet-50 text-violet-700 border-violet-200";

  return (
    <section>
      {/* HERO SUMMARY */}
      <div className="relative overflow-hidden rounded-3xl border shadow bg-gradient-to-b from-brand-50 via-white to-white p-6 md:p-10">
        <div className="max-w-3xl">
          <h1 className="text-[28px] leading-tight md:text-4xl font-extrabold text-ink-900">
            {pcopy.icon[persona]} {pcopy.label[persona]}
          </h1>
          <p className="mt-3 text-[16px] md:text-lg text-slate-800">
            {pcopy.summary[persona]}
          </p>
          <p className="mt-2 text-[15px] md:text-base text-slate-700">
            {L(
              "Here’s a clear snapshot of where you shine and where tiny changes can unlock big relief.",
              "Aquí tienes un panorama claro: en qué destacas y dónde pequeños cambios traen gran alivio."
            )}
          </p>

          {/* Dimension chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            <DimChip
              label={L("Habits","Hábitos")}
              bucket={buckets.habits}
              blabel={BL[buckets.habits]}
              chipColor={chipColor(buckets.habits)}
            />
            <DimChip
              label={L("Confidence","Confianza")}
              bucket={buckets.confidence}
              blabel={BL[buckets.confidence]}
              chipColor={chipColor(buckets.confidence)}
            />
            <DimChip
              label={L("Stability","Estabilidad")}
              bucket={buckets.stability}
              blabel={BL[buckets.stability]}
              chipColor={chipColor(buckets.stability)}
            />
          </div>

          {/* Primary CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={{ pathname: "/plan", query: { a: JSON.stringify(ans) } }}
              className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-white no-underline text-base"
            >
              {L("Make my action path","Crear mi ruta de acción")}
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center justify-center rounded-xl border px-5 py-3 no-underline text-ink-900 bg-white hover:bg-brand-50 text-base"
            >
              {L("Explore all lessons","Explorar todas las lecciones")}
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-600">
            {L("Private and judgment-free · You can do this, one small step at a time.",
               "Privado y sin juicios · Puedes lograrlo, paso a paso.")}
          </p>
        </div>
      </div>

      {/* RECOMMENDED LESSONS */}
      <h2 className="text-xl md:text-2xl font-semibold text-ink-900 mt-8 mb-3">
        {L("Recommended for you","Recomendado para ti")}
      </h2>
      <p className="text-sm text-slate-700 mb-3">
        {L(
          "Start with these short lessons matched to your current needs.",
          "Empieza con estas lecciones breves según tus necesidades."
        )}
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {recs.map(lsn => (
          <LessonCard key={lsn.id} lesson={lsn} locale={locale} />
        ))}
      </div>

      {/* Optional: back to assessment */}
      <div className="mt-8">
        <Link href="/assessment" className="px-4 py-2 rounded-xl border no-underline">
          {L("Retake the checkup","Repetir la evaluación")}
        </Link>
      </div>
    </section>
  );
}

function DimChip({
  label,
  bucket,
  blabel,
  chipColor,
}: {
  label: string;
  bucket: string;
  blabel: string;
  chipColor: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${chipColor}`}>
      <strong className="text-ink-900/80">{label}</strong>
      <span aria-hidden>•</span>
      <span>{blabel}</span>
    </span>
  );
}
