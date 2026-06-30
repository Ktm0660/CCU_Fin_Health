import Link from "next/link";
import { useEffect, useState } from "react";
import { clearLocalPlan, loadLocalPlan, type LocalMoneyPlan } from "@/lib/localPlanStorage";
import { hrefWithLang, type Lang } from "@/lib/lang";

export default function SavedPlanBanner({ lang, onClear }: { lang: Lang; onClear?: () => void }) {
  const [plan, setPlan] = useState<LocalMoneyPlan | null>(null);
  const T = (en: string, es: string) => lang === "es" ? es : en;
  useEffect(() => setPlan(loadLocalPlan()), []);
  if (!plan) return null;
  const name = plan.preferredName ? `${plan.preferredName}, ` : "";
  return <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-soft md:p-5">
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><h2 className="font-semibold text-ink-900">{T(`${name}ready to keep going?`, `${name}¿listo/a para continuar?`)}</h2><p className="mt-1 text-sm leading-relaxed text-slate-700">{T("Resume your plan, update it as life changes, or clear it and start fresh.", "Continúa tu plan, actualízalo cuando cambie la vida o bórralo y empieza de nuevo.")}</p><details className="mt-2 text-xs text-slate-600"><summary className="cursor-pointer font-medium">{T("How saving works", "Cómo funciona guardar")}</summary><p className="mt-1">{T("Your current plan is kept in this browser. You can clear it any time.", "Tu plan actual queda en este navegador. Puedes borrarlo cuando quieras.")}</p></details></div><div className="grid gap-2 sm:grid-cols-3 md:min-w-[420px]"><Link href={hrefWithLang("/results?saved=1", lang)} className="rounded-xl bg-brand-500 px-3 py-2 text-center text-sm font-semibold text-white no-underline">{T("Resume my plan", "Continuar mi plan")}</Link><Link href={hrefWithLang("/assessment", lang)} className="rounded-xl border bg-white px-3 py-2 text-center text-sm font-semibold no-underline">{T("Retake check-in", "Repetir revisión")}</Link><button className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold" onClick={() => { clearLocalPlan(); setPlan(null); onClear?.(); }}>{T("Clear plan", "Borrar plan")}</button></div></div>
  </div>;
}
