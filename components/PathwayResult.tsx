import Link from "next/link";
import { getResourceById, getTermById, type GuideResult } from "@/lib/guideScoring";
import { pathways, pick } from "@/data/guide";
import { hrefWithLang, type Lang } from "@/lib/lang";
import ActionCard from "@/components/ActionCard";

export default function PathwayResult({ result, lang, onClear }: { result: GuideResult; lang: Lang; onClear: () => void }) {
  const primary = pathways[result.primaryPathway];
  const secondary = pathways[result.secondaryPathway];
  const T = (en: string, es: string) => lang === "es" ? es : en;
  const resources = result.recommendedResourceIds.map(getResourceById).filter(Boolean);
  const terms = result.recommendedTermIds.map(getTermById).filter(Boolean);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-gradient-to-br from-brand-50 via-white to-white p-5 shadow md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Your money plan", "Tu plan de dinero")}</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-ink-900 md:text-4xl">{pick(primary.name, lang)}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-800">{pick(primary.explanation, lang)}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-4"><span className="text-xs font-semibold uppercase text-slate-500">{T("Primary pathway", "Ruta principal")}</span><p className="mt-1 font-semibold text-ink-900">{pick(primary.name, lang)}</p></div>
          <div className="rounded-2xl border bg-white p-4"><span className="text-xs font-semibold uppercase text-slate-500">{T("Secondary pathway", "Ruta secundaria")}</span><p className="mt-1 font-semibold text-ink-900">{pick(secondary.name, lang)}</p></div>
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow md:p-6">
        <h2 className="text-2xl font-semibold text-ink-900">{T("Why this may matter right now", "Por qué puede importar ahora")}</h2>
        <p className="mt-2 leading-relaxed text-slate-800">{pick(primary.why, lang)}</p>
      </section>

      <ActionCard pathwayId={result.primaryPathway} lang={lang} />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border bg-white p-5 shadow md:p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Recommended tool", "Herramienta recomendada")}</p>
          <h2 className="mt-1 text-xl font-semibold text-ink-900">{toolName(result.recommendedToolId, lang)}</h2>
          <p className="mt-2 text-sm text-slate-700">{T("Use this first if you want help turning the plan into numbers or words.", "Usa esto primero si quieres convertir el plan en números o palabras.")}</p>
          <Link href={hrefWithLang(`/tools?tool=${result.recommendedToolId}`, lang)} className="mt-4 inline-block rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white no-underline">{T("Open tool", "Abrir herramienta")}</Link>
        </div>
        <div className="rounded-3xl border bg-white p-5 shadow md:col-span-2 md:p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Recommended learning", "Aprendizaje recomendado")}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {resources.map((r) => r && <Link key={r.id} href={hrefWithLang(`/resources#${r.id}`, lang)} className="rounded-2xl border bg-slate-50 p-4 no-underline"><span className="text-sm font-semibold text-ink-900">{pick(r.title, lang)}</span><p className="mt-1 text-xs text-slate-700">{pick(r.summary, lang)}</p></Link>)}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow md:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Financial terms translator", "Traductor de términos financieros")}</p>
        <h2 className="mt-1 text-2xl font-semibold text-ink-900">{T("Terms that may help", "Términos que pueden ayudar")}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {terms.map(t => t && <Link key={t.id} href={hrefWithLang(`/glossary#${t.id}`, lang)} className="rounded-full border bg-slate-50 px-3 py-1 text-sm no-underline">{lang === "es" ? t.spanishTerm : t.term}</Link>)}
        </div>
      </section>

      <section className="rounded-3xl border bg-brand-500 p-5 text-white shadow md:p-6">
        <h2 className="text-2xl font-semibold">{T("Talk this through", "Hablarlo con alguien")}</h2>
        <p className="mt-3 leading-relaxed text-brand-50">{pick(primary.talkPrompt, lang)}</p>
        <p className="mt-4 text-sm text-brand-50">{T("Bring this plan to someone you trust, ask a money question in plain language, or use the script builder before a conversation.", "Lleva este plan a alguien de confianza, haz una pregunta en lenguaje simple o usa el creador de frases antes de una conversación.")}</p>
      </section>

      <section className="rounded-3xl border bg-slate-50 p-5 text-sm leading-relaxed text-slate-700 md:p-6">
        <strong className="text-ink-900">{T("Saved locally:", "Guardado localmente:")}</strong> {T("Your latest plan is saved only on this device/browser. It is not a login, is not stored on a server, and may be lost if browser data is cleared.", "Tu plan más reciente se guarda solo en este dispositivo/navegador. No es un inicio de sesión, no se guarda en un servidor y puede perderse si se borran datos del navegador.")}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row print:hidden">
          <Link href={hrefWithLang("/assessment", lang)} className="rounded-xl border bg-white px-4 py-2 text-center font-semibold no-underline">{T("Retake assessment", "Repetir evaluación")}</Link>
          <button onClick={onClear} className="rounded-xl border bg-white px-4 py-2 font-semibold">{T("Clear saved result", "Borrar resultado")}</button>
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 text-sm leading-relaxed text-slate-700 md:p-6">
        {T("This tool is educational. It is not financial, legal, tax, or credit advice. Your situation may be different, and you can choose what steps fit you.", "Esta herramienta es educativa. No es asesoría financiera, legal, fiscal ni de crédito. Tu situación puede ser diferente y puedes elegir los pasos que encajen contigo.")}
      </section>
    </div>
  );
}

function toolName(id: string, lang: Lang) {
  const names: Record<string, { en: string; es: string }> = {
    "bill-calendar": { en: "Bill calendar / paycheck planner", es: "Calendario de cuentas / plan de pago" },
    "debt-payoff": { en: "Debt payoff planner", es: "Planificador de pago de deuda" },
    "emergency-buffer": { en: "Emergency buffer planner", es: "Planificador de colchón de emergencia" },
    "credit-checklist": { en: "Credit report checklist", es: "Lista para reporte de crédito" },
    "conversation-script": { en: "Conversation script builder", es: "Creador de frases para conversación" },
  };
  return names[id]?.[lang] ?? id;
}
