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
        <section className="relative overflow-hidden pt-3 md:pt-6">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />
          <div className="relative mx-auto max-w-6xl px-4 pb-10 md:pb-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block rounded-full bg-white border px-3 py-1 text-xs md:text-sm text-slate-700">
                  {t("Judgment-free & private", "Sin juicios y privado")}
                </span>

                <h1 className="mt-5 font-semibold text-[28px] leading-[1.25] md:text-5xl text-ink-900 motion-safe:animate-slide-up">
                  {t("Feel confident about your money again.", "Vuelve a sentir confianza con tu dinero.")}
                </h1>

                <p className="mt-4 text-slate-700 text-[16px] leading-relaxed md:text-lg md:leading-relaxed motion-safe:animate-fade-in">
                  {t(
                    "Take our quick Financial Health Checkup—get plain-language insights and a simple action path.",
                    "Haz nuestra Evaluación de Salud Financiera—recibe ideas claras y una ruta de acción simple."
                  )}
                </p>

                {/* Full-width primary CTA on mobile */}
                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/assessment"
                    className="btn btn-secondary w-full sm:w-auto px-6 py-4 text-base no-underline shadow-soft active:scale-[0.99]"
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
                <div className="mt-9 grid sm:grid-cols-3 gap-3 md:gap-4">
                  <div
                    className="bg-white border rounded-2xl p-4 shadow-soft motion-safe:animate-slide-up stagger"
                    style={{ animationDelay: "80ms", background: "linear-gradient(145deg, rgba(11,20,67,0.04), rgba(0,106,78,0.02))" }}
                  >
                    <h3 className="font-semibold text-ink-900">{t("Clarity", "Claridad")}</h3>
                    <p className="text-sm text-slate-700 mt-1">{t("Jargon-free help and tools you can actually use.", "Ayuda sin jerga y herramientas que realmente puedes usar.")}</p>
                  </div>
                  <div
                    className="bg-white border rounded-2xl p-4 shadow-soft motion-safe:animate-slide-up stagger"
                    style={{ animationDelay: "140ms", background: "linear-gradient(145deg, rgba(11,20,67,0.035), rgba(0,106,78,0.02))" }}
                  >
                    <h3 className="font-semibold text-ink-900">{t("Made for communities", "Hecho para comunidades")}</h3>
                    <p className="text-sm text-slate-700 mt-1">{t("Mobile branch + bilingual content to meet you where you are.", "Sucursal móvil + contenido bilingüe para encontrarte donde estás.")}</p>
                  </div>
                  <div
                    className="bg-white border rounded-2xl p-4 shadow-soft motion-safe:animate-slide-up stagger"
                    style={{ animationDelay: "200ms", background: "linear-gradient(145deg, rgba(11,20,67,0.03), rgba(0,106,78,0.02))" }}
                  >
                    <h3 className="font-semibold text-ink-900">{t("Simple next steps", "Pasos simples")}</h3>
                    <p className="text-sm text-slate-700 mt-1">{t("One small win this week beats a perfect plan later.", "Un pequeño logro esta semana vale más que un plan perfecto después.")}</p>
                  </div>
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
                  <Link href="/assessment" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-4 py-3 text-white no-underline shadow-soft hover:brightness-110 transition">
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-3 text-sm shadow-soft motion-safe:animate-fade-in">
      <div className="text-slate-600">{label}</div>
      <div className="font-semibold text-ink-900">{value}</div>
    </div>
  );
}
