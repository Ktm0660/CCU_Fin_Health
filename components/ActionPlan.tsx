import Link from "next/link";

import { buildActionPlan } from "@/data/actionPlan";
import { type Pillar } from "@/data/assessment";
import { type PillarMetric } from "@/lib/resultsShared";
import { type Lang } from "@/lib/lang";

interface ActionPlanProps {
  lang: Lang;
  metrics: Partial<Record<Pillar, PillarMetric>>;
  hasAnswers: boolean;
  retakeHref: string;
}

export function ActionPlan({ lang, metrics, hasAnswers, retakeHref }: ActionPlanProps) {
  const steps = buildActionPlan(metrics, lang);

  return (
    <div className="mt-8 rounded-3xl bg-white border p-6 shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
            {lang === "en" ? "Your Next 3 Steps (7 days)" : "Tus próximos 3 pasos (7 días)"}
          </h2>
          <p className="mt-2 text-slate-700">
            {lang === "en"
              ? "Small moves, zero judgment. Pick one and start this week—each action links to a quick guide."
              : "Pequeños pasos, sin juicios. Elige uno para empezar esta semana; cada acción tiene una guía rápida."}
          </p>
        </div>
        {!hasAnswers && (
          <Link href={retakeHref} className="text-sm underline whitespace-nowrap">
            {lang === "en" ? "Retake assessment" : "Repetir evaluación"}
          </Link>
        )}
      </div>

      {!hasAnswers && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-amber-900 font-medium">
            {lang === "en"
              ? "We couldn't find your latest answers."
              : "No pudimos encontrar tus respuestas más recientes."}
          </p>
          <p className="text-slate-800 mt-1">
            {lang === "en"
              ? "Retake the assessment so your steps match your situation."
              : "Vuelve a tomar la evaluación para que tus pasos coincidan con tu situación."}
          </p>
          <div className="mt-3">
            <Link href={retakeHref} className="underline">
              {lang === "en" ? "Retake now" : "Repetir ahora"}
            </Link>
          </div>
        </div>
      )}

      <div className="mt-5 grid md:grid-cols-3 gap-4">
        {steps.map(step => (
          <div key={step.id} className="rounded-2xl border p-4 shadow-sm bg-slate-50 flex flex-col h-full">
            <div className="text-xs uppercase tracking-wide text-slate-600">{step.pillar}</div>
            <h3 className="font-semibold text-ink-900 mt-1">{step.title}</h3>
            <p className="text-sm text-slate-700 mt-2 flex-1">{step.detail}</p>
            <div className="mt-3">
              <Link
                href={step.href}
                className="inline-block px-3 py-2 rounded-lg bg-brand-500 text-white text-sm no-underline"
              >
                {lang === "en" ? "Open guide" : "Abrir guía"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
