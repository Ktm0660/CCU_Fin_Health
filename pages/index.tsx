import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import LanguageToggle from "@/components/LanguageToggle";

export default function Home() {
  const router = useRouter();
  const locale = (router.locale as "en" | "es") || "en";
  const t = (en: string, es: string) => (locale === "en" ? en : es);
  const langToggle = locale === "en" ? "es" : "en";

  return (
    <>
      <Head>
        <title>{t("Feel confident about your money again | Connections", "Vuelve a sentir confianza con tu dinero | Connections")}</title>
        <meta
          name="description"
          content={t(
            "Take our 3-minute Financial Health Checkup — no judgment, just clarity and small steps forward.",
            "Haz nuestra evaluación de 3 minutos — sin juicios, con claridad y pasos simples."
          )}
        />
      </Head>

      <main className="min-h-screen">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />
          <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-20">
            <div className="flex items-center justify-between mb-4 md:hidden">
              {/* mobile top toggle too */}
              <LanguageToggle />
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block rounded-full bg-white border px-3 py-1 text-xs md:text-sm text-slate-700 shadow">
                  {t("Judgment-free & private", "Sin juicios y privado")}
                </span>
                <h1 className="mt-4 font-semibold text-3xl md:text-5xl leading-tight text-ink-900">
                  {t("Feel confident about your money again.", "Vuelve a sentir confianza con tu dinero.")}
                </h1>
                <p className="mt-3 text-slate-700 text-base md:text-lg">
                  {t(
                    "Take our quick Financial Health Checkup—get plain-language insights and a simple action path.",
                    "Haz nuestra Evaluación de Salud Financiera—recibe ideas claras y una ruta de acción simple."
                  )}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/assessment"
                    className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-white no-underline shadow hover:opacity-95"
                  >
                    {t("Start my free checkup", "Empezar mi evaluación gratis")}
                  </Link>
                  <Link
                    href={router.asPath}
                    locale={langToggle}
                    className="inline-flex items-center justify-center rounded-xl border px-5 py-3 no-underline text-ink-900 bg-white hover:bg-brand-50"
                  >
                    {langToggle === "es" ? "Español" : "English"}
                  </Link>
                </div>

                <p className="mt-3 text-xs text-slate-600">
                  {t("Takes about 3 minutes · No credit pull · No sales pitch", "Toma ~3 minutos · Sin consultar crédito · Sin ventas")}
                </p>

                {/* INFO CARDS: softer, clearly non-interactive */}
                <div className="mt-6 grid md:grid-cols-3 gap-3">
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

              {/* right column stays as-is (testimonial metric card) */}
              <div className="md:pl-8">
                <div className="rounded-3xl border bg-white shadow p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 border text-brand-700 font-semibold">AC</div>
                    <div>
                      <p className="font-medium text-ink-900">
                        {t("“I finally have a simple plan.”", "“Por fin tengo un plan simple.”")}
                      </p>
                      <p className="text-xs text-slate-600">
                        {t("Member in rural Idaho", "Socia en Idaho rural")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <Metric label={t("Habits", "Hábitos")} value="On Track" />
                    <Metric label={t("Confidence", "Confianza")} value={t("Progress", "Tomando ritmo")} />
                    <Metric label={t("Stability", "Estabilidad")} value={t("Getting Started", "Empezando")} />
                  </div>
                  <Link
                    href="/assessment"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-4 py-2 text-white no-underline"
                  >
                    {t("See your snapshot", "Conoce tu panorama")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS / COMMUNITY */}
        <section className="bg-white border-t">
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
            <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
              {t("Real voices from our community", "Voces reales de nuestra comunidad")}
            </h2>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <Quote
                text={t(
                  "“I used to avoid looking at my accounts. This helped me start small and feel in control.”",
                  "“Evitaba ver mis cuentas. Esto me ayudó a empezar en pequeño y sentir control.”"
                )}
                who={t("Parent in Mini-Cassia", "Madre en Mini-Cassia")}
              />
              <Quote
                text={t(
                  "“I realized I was doing better than I thought—and where I could grow.”",
                  "“Me di cuenta de que iba mejor de lo que creía—y dónde crecer.”"
                )}
                who={t("Farm worker, Bingham County", "Trabajador agrícola, condado de Bingham")}
              />
              <Quote
                text={t(
                  "“They explained things simply. No pressure, just help.”",
                  "“Me explicaron todo simple. Sin presión, solo ayuda.”"
                )}
                who={t("Member in Twin Falls", "Socia en Twin Falls")}
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-brand-50">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
            <div className="rounded-3xl border bg-white shadow p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-ink-900">
                  {t("Ready to take the first step?", "¿Listo para dar el primer paso?")}
                </h3>
                <p className="text-slate-700">
                  {t("Start your free checkup—no credit pull, no sales pitch.", "Empieza tu evaluación gratis—sin consultar crédito, sin ventas.")}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/assessment"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-white no-underline"
                >
                  {t("Start my free checkup", "Empezar mi evaluación gratis")}
                </Link>
                <Link
                  href="/resources"
                  className="inline-flex items-center justify-center rounded-xl border px-5 py-3 no-underline text-ink-900 bg-white hover:bg-brand-50"
                >
                  {t("Explore tools & resources", "Explorar herramientas y recursos")}
                </Link>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-600">
              {t(
                "Powered by Connections Credit Union — serving rural Idaho with judgment-free guidance.",
                "Impulsado por Connections Credit Union — sirviendo a Idaho rural con orientación sin juicios."
              )}
            </p>
          </div>
        </section>

        {/* MOBILE PINNED CTA */}
        <div className="fixed bottom-4 inset-x-0 px-4 md:hidden">
          <div className="mx-auto max-w-md rounded-2xl shadow-lg border bg-white p-2 flex items-center gap-2">
            <span className="text-sm text-slate-700">
              {t("Take the checkup", "Haz la evaluación")}
            </span>
            <Link
              href="/assessment"
              className="ml-auto inline-flex items-center justify-center rounded-xl bg-brand-500 px-3 py-2 text-white text-sm no-underline"
            >
              {t("Start", "Empezar")}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function InfoTile({ emoji, title, body }:{ emoji:string; title:string; body:string }) {
  return (
    <div className="rounded-2xl border bg-white/60 p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full border bg-white flex items-center justify-center text-lg" aria-hidden>{emoji}</div>
        <div>
          <p className="font-semibold text-ink-900">{title}</p>
          <p className="text-sm text-slate-700">{body}</p>
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

function Quote({ text, who }: { text: string; who: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow">
      <p className="italic text-slate-800">“{text.replace(/^“|”$/g, "")}”</p>
      <p className="mt-2 text-xs text-slate-600">{who}</p>
    </div>
  );
}
