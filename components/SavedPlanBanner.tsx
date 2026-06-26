import Link from "next/link";
import { useEffect, useState } from "react";
import { clearLocalPlan, loadLocalPlan, type LocalMoneyPlan } from "@/lib/localPlanStorage";
import { hrefWithLang, type Lang } from "@/lib/lang";

export default function SavedPlanBanner({ lang, onClear }: { lang: Lang; onClear?: () => void }) {
  const [plan, setPlan] = useState<LocalMoneyPlan | null>(null);
  const T = (en: string, es: string) => lang === "es" ? es : en;

  useEffect(() => setPlan(loadLocalPlan()), []);
  if (!plan) return null;

  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-soft md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-semibold text-ink-900">{T("You have a saved money plan on this device.", "Tienes un plan de dinero guardado en este dispositivo.")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            {T(
              "This is saved only on this device/browser. It is not a login and may be lost if browser data is cleared. Avoid saving on a shared device if privacy is a concern.",
              "Esto se guarda solo en este dispositivo/navegador. No es un inicio de sesión y puede perderse si se borran los datos del navegador. Evita guardarlo en un dispositivo compartido si la privacidad te preocupa."
            )}
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 md:min-w-[420px]">
          <Link href={hrefWithLang("/results?saved=1", lang)} className="rounded-xl bg-brand-500 px-3 py-2 text-center text-sm font-semibold text-white no-underline">{T("View my saved plan", "Ver mi plan")}</Link>
          <Link href={hrefWithLang("/assessment", lang)} className="rounded-xl border bg-white px-3 py-2 text-center text-sm font-semibold no-underline">{T("Retake assessment", "Repetir evaluación")}</Link>
          <button className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold" onClick={() => { clearLocalPlan(); setPlan(null); onClear?.(); }}>{T("Clear saved plan", "Borrar plan")}</button>
        </div>
      </div>
    </div>
  );
}
