import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const locale = (router.locale as "en" | "es") || "en";
  const t = (en: string, es: string) => (locale === "en" ? en : es);
  const langToggle = locale === "en" ? "es" : "en";

  return (
    <>
      <Head>
        <title>{t("Feel confident about your money again | Connections", "Vuelve a sentir confianza con tu dinero | Connections")}</title>
        <meta name="description" content={t(
          "Take our 3-minute Financial Health Checkup — no judgment, just clarity and small steps forward.",
          "Haz nuestra evaluación de 3 minutos — sin juicios, con claridad y pasos simples."
        )} />
      </Head>

      <main className="min-h-screen">
        {/* HERO with softer rhythm on mobile */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />
          <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-20">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block rounded-full bg-white border px-3 py-1 text-xs md:text-sm text-slate-700">
                  {t("Judgment-free & private", "Sin juicios y privado")}
                </span>

                <h1 className="mt-5 font-semibold text-[28px] leading-[1.25] md:text-5xl text-ink-900">
                  {t("Feel confident about your money again.", "Vuelve a sentir confianza con tu dinero.")}
                </h1>

                <p className="mt-4 text-slate-700 text-[16px] leading-relaxed md:text-lg md:leading-relaxed">
                  {t(
                    "Take our quick Financial Health Checkup—get plain-language insights and a simple action path.",
                    "Haz nuestra Evaluación de Salud Financiera—recibe ideas claras y una ruta de acción simple."
                  )}
                </p>

                {/* Full-width primary CTA on mobile */}
                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/assessment"
                    className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-6 py-4 text-white no-underline text-base shadow-sm hover:opacity-95 w-full sm:w-auto"
                  >
                    {t("Start my free checkup", "Empezar mi evaluación gratis")}
                  </Link>
                  <Link
                    href={router.asPath}
                    locale={langToggle}
                    className="inline-flex items-center justify-center rounded-xl border px-6 py-4 no-underline text-ink-900 bg-white hover:bg-brand-50 w-full sm:w-auto"
                  >
                    {langToggle === "es" ? "Español" : "English"}
                  </Link>
                </div>

                <p className="mt-3 text-xs text-slate-600">
                  {t("Takes about 3 minutes · No credit pull · No sales pitch", "Toma ~3 minutos · Sin consultar crédito · Sin ventas")}
                </p>

                {/* INFO TILES — more breathing room on mobile */}
                <div className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoTile
                    emoji="💡"
                    title={t("Clarity in minutes", "Claridad en minutos")}
                    body={t("Understand where you stand—without spreadsheets.", "Entiende dónde estás—sin hojas de cálculo.")}
                  />
                  <InfoTile
                    emoji="🌾"
                    title={t("Made for our communities", "Hecho para nuestras comunidades")}
                    body={t("Plain-language guidance that respects your life and time.", "Guía simple que respeta tu vida y tu tiempo.")}
                  />
                  <InfoTile
                    emoji="🧭"
                    title={t("Simple next steps", "Pasos simples")}
                    body={t("Walk away with a plan you can actually follow.", "Sal con un plan que realmente puedas seguir.")}
                  />
                </div>
              </div>

              {/* Right column testimonial */}
              <div className="md:pl-8">
                <div className="rounded-3xl border bg-white shadow p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 border text-brand-700 font-semibold">AC</div>
                    <div>
                      <p className="font-medium text-ink-900">{t("“I finally have a simple plan.”", "“Por fin tengo un plan simple.”")}</p>
                      <p className="text-xs text-slate-600">{t("Member in rural Idaho", "Socia en Idaho rural")}</p>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <Metric label={t("Habits", "Hábitos")} value="On Track" />
                    <Metric label={t("Confidence", "Confianza")} value={t("Progress", "Tomando ritmo")} />
                    <Metric label={t("Stability", "Estabilidad")} value={t("Getting Started", "Empezando")} />
                  </div>
                  <Link href="/assessment" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-4 py-3 text-white no-underline">
                    {t("See your snapshot", "Conoce tu panorama")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function InfoTile({ emoji, title, body }:{ emoji:string; title:string; body:string }) {
  return (
    <div className="rounded-xl bg-brand-50/60 p-5 border-l-4 border-brand-300">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-white/80 flex items-center justify-center text-lg border" aria-hidden>
          {emoji}
        </div>
        <div>
          <p className="font-semibold text-ink-900 text-[16px] leading-tight">{title}</p>
          <p className="text-sm text-slate-700 leading-relaxed mt-1">{body}</p>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-3 text-sm">
      <div className="text-slate-600">{label}</div>
      <div className="font-semibold text-ink-900">{value}</div>
    </div>
  );
}
