import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getResourceById, getTermById } from "@/lib/guideScoring";
import { loadLocalPlan, type LocalMoneyPlan } from "@/lib/localPlanStorage";
import { pathways, pick } from "@/data/guide";
import { getLangFromQueryOrStorage, hrefWithLang, type Lang } from "@/lib/lang";
import SavedPlanBanner from "@/components/SavedPlanBanner";

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>((router.query.lang === "es" ? "es" : (router.locale as Lang)) || "en");
  const [plan, setPlan] = useState<LocalMoneyPlan | null>(null);
  const T = (en: string, es: string) => (lang === "es" ? es : en);
  useEffect(() => { setLang(getLangFromQueryOrStorage()); setPlan(loadLocalPlan()); }, [router.locale, router.query.lang]);
  const nextTool = plan?.recommendedToolId;
  const learning = plan?.recommendedResourceIds?.[0] ? getResourceById(plan.recommendedResourceIds[0]) : null;
  const terms = plan?.recommendedTermIds?.slice(0, 4).map(getTermById).filter(Boolean) ?? [];
  return <><Head><title>{T("Find your next money step | Connections", "Encuentra tu próximo paso de dinero | Connections")}</title></Head><main className="min-h-screen py-6">
    <SavedPlanBanner lang={lang} onClear={() => setPlan(null)} />
    <section className="mt-6 rounded-3xl border bg-gradient-to-br from-brand-50 via-white to-white p-5 shadow md:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Personalized financial action tool", "Herramienta personalizada de acción financiera")}</p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink-900 md:text-5xl">{plan ? T("Your plan is ready when you are", "Tu plan está listo cuando tú lo estés") : T("Find your next money step", "Encuentra tu próximo paso de dinero")}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">{T("Understand what is happening with your money, choose practical next steps, use focused tools, and learn the terms that matter right now.", "Entiende qué pasa con tu dinero, elige pasos prácticos, usa herramientas enfocadas y aprende los términos que importan ahora.")}</p>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Link href={hrefWithLang(plan ? "/results?saved=1" : "/assessment", lang)} className="rounded-xl bg-brand-500 px-5 py-4 text-center font-semibold text-white no-underline">{plan ? T("Resume my plan", "Continuar mi plan") : T("Start my money check-in", "Empezar mi revisión")}</Link><Link href={hrefWithLang("/resources", lang)} className="rounded-xl border bg-white px-5 py-4 text-center font-semibold no-underline">{T("View learning library", "Ver biblioteca")}</Link><Link href={hrefWithLang("/glossary", lang)} className="rounded-xl border bg-white px-5 py-4 text-center font-semibold no-underline">{T("Translate financial terms", "Traducir términos")}</Link><Link href={hrefWithLang("/tools", lang)} className="rounded-xl border bg-white px-5 py-4 text-center font-semibold no-underline">{T("Use tools", "Usar herramientas")}</Link></div>
    </section>
    {plan && <section className="mt-6 grid gap-4 md:grid-cols-2"><Card title={T("Recommended next tool", "Herramienta recomendada")} body={toolName(nextTool, lang)} href={hrefWithLang(`/tools?tool=${nextTool}`, lang)} /><Card title={T("Recommended learning", "Aprendizaje recomendado")} body={learning ? pick(learning.title, lang) : pick(pathways[plan.primaryPathway].name, lang)} href={hrefWithLang("/resources", lang)} /><Card title={T("Recent focus areas", "Áreas de enfoque recientes")} body={plan.impactAreas.slice(0, 3).map(a => pick(pathways[a.pathwayId].name, lang)).join(" • ")} href={hrefWithLang("/results?saved=1", lang)} /><Card title={T("Terms to understand", "Términos para entender")} body={terms.map(t => lang === "es" ? t!.spanishTerm : t!.term).join(" • ")} href={hrefWithLang("/glossary", lang)} /></section>}
    {!plan && <section className="mt-6 grid gap-4 md:grid-cols-2">{[[T("Start with what matters most", "Empieza con lo que importa"), T("Your answers help personalize your plan without forcing you into a score.", "Tus respuestas ayudan a personalizar tu plan sin reducirlo a un puntaje.")], [T("Use practical tools", "Usa herramientas prácticas"), T("Plan bills, organize debt, build a buffer, check credit, or prepare a conversation.", "Planifica cuentas, organiza deuda, crea un colchón, revisa crédito o prepara una conversación.")]].map(([title, body]) => <div key={title} className="rounded-2xl border bg-white p-5 shadow-soft"><h2 className="font-semibold text-ink-900">{title}</h2><p className="mt-2 text-sm text-slate-700">{body}</p></div>)}</section>}
  </main></>;
}
function Card({ title, body, href }: { title: string; body: string; href: string }) { return <Link href={href} className="rounded-2xl border bg-white p-5 no-underline shadow-soft"><h2 className="font-semibold text-ink-900">{title}</h2><p className="mt-2 text-sm text-slate-700">{body}</p></Link>; }
function toolName(id: string | undefined, lang: Lang) { const names: Record<string, { en: string; es: string }> = { "bill-calendar": { en: "Bill calendar / paycheck planner", es: "Calendario de cuentas / plan de pago" }, "debt-payoff": { en: "Debt payoff planner", es: "Planificador de deuda" }, "emergency-buffer": { en: "Buffer planner", es: "Planificador de colchón" }, "credit-checklist": { en: "Credit checklist", es: "Lista de crédito" }, "conversation-script": { en: "Conversation script builder", es: "Creador de frases" } }; return id ? names[id]?.[lang] ?? id : ""; }
