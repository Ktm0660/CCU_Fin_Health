import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getLangFromQueryOrStorage, hrefWithLang, type Lang } from "@/lib/lang";
import { clearLocalPlan, loadLocalPlan, type LocalMoneyPlan } from "@/lib/localPlanStorage";
import PathwayResult from "@/components/PathwayResult";

export default function Results() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [plan, setPlan] = useState<LocalMoneyPlan | null>(null);

  useEffect(() => {
    setLang(getLangFromQueryOrStorage());
    setPlan(loadLocalPlan());
  }, [router.query.lang]);

  const T = (en: string, es: string) => lang === "es" ? es : en;

  function clearPlan() {
    clearLocalPlan();
    setPlan(null);
  }

  if (!plan) {
    return (
      <section className="py-8">
        <div className="rounded-3xl border bg-white p-6 text-center shadow md:p-8">
          <h1 className="text-3xl font-semibold text-ink-900">{T("No saved money plan found", "No se encontró un plan guardado")}</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-700">{T("Take the money check-in to create a practical plan. Nothing is stored on a server, and your latest plan is saved only on this device/browser.", "Haz la revisión de dinero para crear un plan práctico. Nada se guarda en un servidor y tu plan más reciente se guarda solo en este dispositivo/navegador.")}</p>
          <Link href={hrefWithLang("/assessment", lang)} className="mt-6 inline-block rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white no-underline">{T("Start my money check-in", "Empezar mi revisión")}</Link>
        </div>
      </section>
    );
  }

  return <section className="py-6"><PathwayResult result={plan} lang={lang} onClear={clearPlan} /></section>;
}
