import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getLangFromQueryOrStorage, hrefWithLang, type Lang } from "@/lib/lang";
import SavedPlanBanner from "@/components/SavedPlanBanner";

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>((router.query.lang === "es" ? "es" : (router.locale as Lang)) || "en");
  const T = (en: string, es: string) => (lang === "es" ? es : en);
  const langToggle = lang === "en" ? "es" : "en";

  useEffect(() => setLang(getLangFromQueryOrStorage()), [router.locale, router.query.lang]);

  return (
    <>
      <Head>
        <title>{T("Find your next money step | Connections", "Encuentra tu próximo paso de dinero | Connections")}</title>
        <meta name="description" content={T("Answer a few questions. Get a practical next step, a simple plan, tools, and plain-language explanations that fit your situation.", "Responde unas preguntas. Obtén un próximo paso práctico, un plan simple, herramientas y explicaciones claras para tu situación.")} />
      </Head>
      <main className="min-h-screen py-6">
        <SavedPlanBanner lang={lang} />
        <section className="mt-6 rounded-3xl border bg-gradient-to-br from-brand-50 via-white to-white p-5 shadow md:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Anonymous financial guide", "Guía financiera anónima")}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink-900 md:text-5xl">{T("Find your next money step", "Encuentra tu próximo paso de dinero")}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">{T("Answer a few questions. Get a practical next step, a simple plan, tools you can use, and plain-language explanations that fit your situation.", "Responde unas preguntas. Obtén un próximo paso práctico, un plan simple, herramientas útiles y explicaciones claras para tu situación.")}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href={hrefWithLang("/assessment", lang)} className="rounded-xl bg-brand-500 px-5 py-4 text-center font-semibold text-white no-underline">{T("Start my money check-in", "Empezar mi revisión")}</Link>
            <Link href={hrefWithLang("/resources", lang)} className="rounded-xl border bg-white px-5 py-4 text-center font-semibold no-underline">{T("View learning library", "Ver biblioteca")}</Link>
            <Link href={hrefWithLang("/glossary", lang)} className="rounded-xl border bg-white px-5 py-4 text-center font-semibold no-underline">{T("Translate financial terms", "Traducir términos")}</Link>
            <Link href={hrefWithLang("/results?saved=1", lang)} className="rounded-xl border bg-white px-5 py-4 text-center font-semibold no-underline">{T("View saved plan", "Ver plan guardado")}</Link>
          </div>
          <p className="mt-4 text-sm text-slate-600">{T("No login. No email. No account numbers. Saved plans stay only on this device/browser.", "Sin inicio de sesión. Sin email. Sin números de cuenta. Los planes quedan solo en este dispositivo/navegador.")}</p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            [T("Understand what feels hardest right now", "Entiende qué se siente más difícil ahora"), T("The check-in starts with your situation, not a score.", "La revisión empieza con tu situación, no con un puntaje.")],
            [T("Get a practical next step", "Obtén un próximo paso práctico"), T("Your result focuses on one useful action for today and a short 7-day plan.", "Tu resultado se enfoca en una acción para hoy y un plan de 7 días.")],
            [T("Use tools and plain-language guides", "Usa herramientas y guías claras"), T("Bill planning, debt organization, buffer planning, credit checklists, and conversation scripts.", "Plan de cuentas, organización de deuda, colchón, listas de crédito y frases para conversar.")],
            [T("Come back as life changes", "Vuelve cuando la vida cambie"), T("Retake the check-in or clear your saved local plan any time.", "Repite la revisión o borra el plan local cuando quieras.")],
          ].map(([title, body]) => <div key={title} className="rounded-2xl border bg-white p-5 shadow-soft"><h2 className="font-semibold text-ink-900">{title}</h2><p className="mt-2 text-sm text-slate-700">{body}</p></div>)}
        </section>

        <div className="mt-6 text-center">
          <Link href={hrefWithLang(router.asPath, langToggle)} className="text-sm font-semibold underline">{langToggle === "es" ? "Español" : "English"}</Link>
        </div>
      </main>
    </>
  );
}
