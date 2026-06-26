import type { Lang } from "@/lib/lang";
import { pathways, pick, type PathwayId } from "@/data/guide";

export default function ActionCard({ pathwayId, lang }: { pathwayId: PathwayId; lang: Lang }) {
  const pathway = pathways[pathwayId];
  const T = (en: string, es: string) => lang === "es" ? es : en;
  return (
    <section className="rounded-3xl border bg-white p-5 shadow md:p-6 print:shadow-none" aria-labelledby="action-card-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Action card", "Tarjeta de acción")}</p>
          <h2 id="action-card-heading" className="mt-1 text-2xl font-semibold text-ink-900">{pick(pathway.name, lang)}</h2>
        </div>
        <button onClick={() => window.print()} className="rounded-xl border px-4 py-2 text-sm font-semibold print:hidden">{T("Print this card", "Imprimir tarjeta")}</button>
      </div>
      <div className="mt-5 rounded-2xl bg-brand-50 p-4">
        <h3 className="font-semibold text-ink-900">{T("Do this today", "Haz esto hoy")}</h3>
        <p className="mt-1 leading-relaxed text-slate-800">{pick(pathway.today, lang)}</p>
      </div>
      <div className="mt-5">
        <h3 className="font-semibold text-ink-900">{T("Your 7-day plan", "Tu plan de 7 días")}</h3>
        <ol className="mt-3 space-y-3">
          {pathway.sevenDay.map((step, index) => (
            <li key={index} className="flex gap-3 rounded-2xl border bg-slate-50 p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">{index + 1}</span>
              <span className="text-slate-800">{pick(step, lang)}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
