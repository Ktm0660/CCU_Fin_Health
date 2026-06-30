import Link from "next/link";
import { getResourceById, getTermById, type GuideResult, type ImpactLevel } from "@/lib/guideScoring";
import { pathways, pick, type PathwayId } from "@/data/guide";
import { hrefWithLang, type Lang } from "@/lib/lang";
import ActionCard from "@/components/ActionCard";

export default function PathwayResult({ result, lang, onClear }: { result: GuideResult; lang: Lang; onClear: () => void }) {
  const primary = pathways[result.primaryPathway];
  const T = (en: string, es: string) => lang === "es" ? es : en;
  const resources = result.recommendedResourceIds.map(getResourceById).filter(Boolean);
  const terms = result.recommendedTermIds.map(getTermById).filter(Boolean);
  const greeting = result.preferredName ? T(`${result.preferredName}, here is your starting plan`, `${result.preferredName}, aquí está tu plan inicial`) : T("Here is your starting plan", "Aquí está tu plan inicial");

  return <div className="space-y-6">
    <section className="rounded-3xl border bg-gradient-to-br from-brand-50 via-white to-white p-5 shadow md:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Your Money Action Plan", "Tu plan de acción de dinero")}</p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight text-ink-900 md:text-4xl">{greeting}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-800">{T("This is meant to help you choose practical next steps. Start with what matters most right now, then update your plan as life changes.", "Esto está pensado para ayudarte a elegir pasos prácticos. Empieza con lo que más importa ahora y actualiza tu plan cuando cambie la vida.")}</p>
    </section>

    <section className="rounded-3xl border bg-white p-5 shadow md:p-6">
      <h2 className="text-2xl font-semibold text-ink-900">{T("Impact areas", "Áreas de impacto")}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {(["highest", "also", "watch"] as ImpactLevel[]).map(level => <div key={level} className="rounded-2xl border bg-slate-50 p-4"><h3 className="font-semibold text-ink-900">{levelLabel(level, lang)}</h3><ul className="mt-3 space-y-2 text-sm text-slate-800">{result.impactAreas.filter(a => a.level === level).map(a => <li key={a.pathwayId}>{pick(pathways[a.pathwayId].name, lang)}</li>)}</ul></div>)}
      </div>
    </section>

    <section className="rounded-3xl border bg-white p-5 shadow md:p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Start here", "Empieza aquí")}</p>
      <h2 className="mt-1 text-2xl font-semibold text-ink-900">{pick(primary.name, lang)}</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="rounded-2xl bg-brand-50 p-4"><h3 className="font-semibold text-ink-900">{T("One thing to do today", "Una cosa para hacer hoy")}</h3><p className="mt-1 text-slate-800">{pick(primary.today, lang)}</p><h3 className="mt-4 font-semibold text-ink-900">{T("Why it matters", "Por qué importa")}</h3><p className="mt-1 text-slate-800">{pick(primary.why, lang)}</p></div>
        <Link href={hrefWithLang(`/tools?tool=${result.recommendedToolId}`, lang)} className="flex items-center justify-center rounded-2xl bg-brand-500 px-5 py-4 text-center font-semibold text-white no-underline">{T("Open recommended tool", "Abrir herramienta recomendada")}</Link>
      </div>
    </section>

    <ActionCard pathwayId={result.primaryPathway} lang={lang} />

    <section className="rounded-3xl border bg-white p-5 shadow md:p-6">
      <h2 className="text-2xl font-semibold text-ink-900">{T("Tools for your plan", "Herramientas para tu plan")}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">{result.recommendedToolIds.map(id => <Link key={id} href={hrefWithLang(`/tools?tool=${id}`, lang)} className="rounded-2xl border bg-slate-50 p-4 no-underline"><span className="font-semibold text-ink-900">{toolName(id, lang)}</span><p className="mt-1 text-sm text-slate-700">{T("Use this when you are ready to turn the step into action.", "Úsala cuando quieras convertir el paso en acción.")}</p></Link>)}</div>
    </section>

    <section className="rounded-3xl border bg-white p-5 shadow md:p-6">
      <h2 className="text-2xl font-semibold text-ink-900">{T("Learn only what helps right now", "Aprende solo lo que ayuda ahora")}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">{resources.map(r => r && <Link key={r.id} href={hrefWithLang(`/resources#${r.id}`, lang)} className="rounded-2xl border bg-slate-50 p-4 no-underline"><span className="font-semibold text-ink-900">{pick(r.title, lang)}</span><p className="mt-1 text-sm text-slate-700">{pick(r.summary, lang)}</p></Link>)}</div>
    </section>

    <section className="rounded-3xl border bg-white p-5 shadow md:p-6">
      <h2 className="text-2xl font-semibold text-ink-900">{T("Terms that may help", "Términos que pueden ayudar")}</h2>
      <div className="mt-4 flex flex-wrap gap-2">{terms.map(t => t && <Link key={t.id} href={hrefWithLang(`/glossary#${t.id}`, lang)} className="rounded-full border bg-slate-50 px-3 py-1 text-sm no-underline">{lang === "es" ? t.spanishTerm : t.term}</Link>)}</div>
    </section>

    <section className="rounded-3xl border bg-brand-500 p-5 text-white shadow md:p-6">
      <h2 className="text-2xl font-semibold">{T("Talk this through", "Hablarlo con alguien")}</h2>
      <p className="mt-3 leading-relaxed text-brand-50">{pick(primary.talkPrompt, lang)}</p>
      <p className="mt-4 text-sm text-brand-50">{T("If you want another set of eyes, you can bring this plan to someone you trust and ask the question above in plain language.", "Si quieres otra mirada, puedes llevar este plan a alguien de confianza y hacer la pregunta de arriba en lenguaje claro.")}</p>
    </section>

    <section className="rounded-3xl border bg-slate-50 p-5 text-sm leading-relaxed text-slate-700 md:p-6">
      <details><summary className="cursor-pointer font-semibold text-ink-900">{T("How saving works", "Cómo funciona guardar")}</summary><p className="mt-2">{T("Your current plan is kept in this browser so you can return to it, retake the check-in, or clear it. A future version can add an optional save code or account-based return path.", "Tu plan actual queda en este navegador para que puedas volver, repetir la revisión o borrarlo. Una versión futura puede agregar un código opcional o una forma de volver con cuenta.")}</p></details>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row print:hidden"><Link href={hrefWithLang("/assessment", lang)} className="rounded-xl border bg-white px-4 py-2 text-center font-semibold no-underline">{T("Retake check-in", "Repetir revisión")}</Link><button onClick={onClear} className="rounded-xl border bg-white px-4 py-2 font-semibold">{T("Clear plan", "Borrar plan")}</button></div>
    </section>
    <section className="rounded-3xl border bg-white p-5 text-sm leading-relaxed text-slate-700 md:p-6">{T("This tool is educational. It is not financial, legal, tax, or credit advice. Your situation may be different, and you can choose what steps fit you.", "Esta herramienta es educativa. No es asesoría financiera, legal, fiscal ni de crédito. Tu situación puede ser diferente y puedes elegir los pasos que encajen contigo.")}</section>
  </div>;
}
function levelLabel(level: ImpactLevel, lang: Lang) { const x = { highest: { en: "Highest impact", es: "Mayor impacto" }, also: { en: "Also important", es: "También importante" }, watch: { en: "Watch later", es: "Mirar después" } }; return x[level][lang]; }
function toolName(id: string, lang: Lang) { const names: Record<string, { en: string; es: string }> = { "bill-calendar": { en: "Bill calendar / paycheck planner", es: "Calendario de cuentas / plan de pago" }, "debt-payoff": { en: "Debt payoff planner", es: "Planificador de deuda" }, "emergency-buffer": { en: "Buffer planner", es: "Planificador de colchón" }, "credit-checklist": { en: "Credit report checklist", es: "Lista de crédito" }, "conversation-script": { en: "Conversation script builder", es: "Creador de frases" } }; return names[id]?.[lang] ?? id; }
