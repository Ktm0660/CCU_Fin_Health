import { useMemo, useState } from "react";
import Link from "next/link";

type Term = {
  key: string;
  term_en: string; term_es: string;
  def_en: string; def_es: string;
  tags?: string[];
};

const TERMS: Term[] = [
  { key: "apr", term_en: "APR", term_es: "APR",
    def_en: "Annual Percentage Rate. The yearly cost of borrowing. For credit cards it includes interest and some fees.",
    def_es: "Tasa de Porcentaje Anual. El costo anual de pedir prestado. En tarjetas incluye interés y algunas comisiones.",
    tags: ["credit"] },
  { key: "apy", term_en: "APY", term_es: "APY",
    def_en: "Annual Percentage Yield. The yearly rate you earn on savings after compounding.",
    def_es: "Rendimiento Porcentual Anual. Tasa anual que ganas en ahorros después de capitalización.",
    tags: ["savings"] },
  { key: "grace", term_en: "Grace period", term_es: "Período de gracia",
    def_en: "Time after the statement where you can pay without interest. Missing it can trigger interest on new purchases.",
    def_es: "Tiempo después del estado de cuenta para pagar sin interés. Si lo pierdes, pueden cobrar interés en compras nuevas.",
    tags: ["credit"] },
  { key: "minpay", term_en: "Minimum payment", term_es: "Pago mínimo",
    def_en: "The smallest amount due on a credit card. Paying only this keeps the account current but slows payoff.",
    def_es: "Cantidad más pequeña a pagar en una tarjeta. Mantiene la cuenta al día pero alarga la deuda.",
    tags: ["credit"] },
  { key: "overdraft", term_en: "Overdraft fee", term_es: "Cargo por sobregiro",
    def_en: "Fee when a transaction pushes your account below $0. Low-balance alerts and a small buffer help avoid it.",
    def_es: "Cargo cuando una transacción deja tu cuenta bajo $0. Alertas y un pequeño colchón ayudan a evitarlo.",
    tags: ["fees"] },
  { key: "util", term_en: "Credit utilization", term_es: "Utilización de crédito",
    def_en: "How much of your limit you use. Under ~30% is usually healthier; under 10% is excellent.",
    def_es: "Cuánto de tu límite usas. Debajo del ~30% suele ser mejor; debajo del 10% es excelente.",
    tags: ["credit"] },
  { key: "itin", term_en: "ITIN", term_es: "ITIN",
    def_en: "Individual Taxpayer Identification Number—often used to open accounts or loans when you don’t have an SSN.",
    def_es: "Número de Identificación Personal del Contribuyente—se usa para abrir cuentas o préstamos sin SSN.",
    tags: ["access"] },
  { key: "routing", term_en: "Routing number", term_es: "Número de ruta",
    def_en: "9-digit number that identifies your credit union/bank for transfers and direct deposit.",
    def_es: "Número de 9 dígitos que identifica tu institución para transferencias y depósito directo.",
    tags: ["payments"] },
  { key: "secured", term_en: "Secured card/loan", term_es: "Tarjeta/préstamo garantizado",
    def_en: "You put money down as security. Great starter path to build credit with low risk.",
    def_es: "Pones dinero como garantía. Buena ruta inicial para construir crédito con bajo riesgo.",
    tags: ["credit"] },
];

export default function Glossary() {
  const [q, setQ] = useState("");
  const [lang, setLang] = useState<"en"|"es">(
    typeof navigator !== "undefined" && navigator.language?.startsWith("es") ? "es" : "en"
  );

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = TERMS.filter((t) => {
      const hay = (lang==="en" ? (t.term_en+" "+t.def_en) : (t.term_es+" "+t.def_es)).toLowerCase();
      return !needle || hay.includes(needle);
    });
    return filtered.sort((a,b) => (lang==="en" ? a.term_en.localeCompare(b.term_en) : a.term_es.localeCompare(b.term_es)));
  }, [q, lang]);

  return (
    <section className="motion-safe:animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink-900">{lang==="en" ? "Jargon Breakdown" : "Glosario sin jerga"}</h1>
        <button
          onClick={() => setLang((p)=> p==="en" ? "es" : "en")}
          className="px-3 py-1 rounded-xl border transition hover:bg-brand-50"
          aria-label="Toggle language"
        >
          {lang==="en" ? "Español" : "English"}
        </button>
      </div>

      <p className="text-slate-700 mb-3">
        {lang==="en"
          ? "Plain-language definitions with quick tips. Tap a term to learn more or see a related guide."
          : "Definiciones simples con consejos rápidos. Toca un término para aprender más o ver una guía relacionada."}
      </p>

      <input
        aria-label={lang==="en" ? "Search terms" : "Buscar términos"}
        value={q} onChange={(e)=>setQ(e.target.value)}
        className="w-full rounded-xl border p-2 mb-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-300"
        placeholder={lang==="en" ? "Search terms…" : "Buscar términos…"}
      />

      <ul className="space-y-3">
        {list.map((item) => (
          <li key={item.key} className="bg-white rounded-2xl shadow-soft p-4 border motion-safe:animate-fade-in">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold text-ink-900">
                {lang==="en" ? item.term_en : item.term_es}
              </h3>
              {item.tags && (
                <div className="flex gap-1 flex-wrap">
                  {item.tags.map((tg)=>(
                    <span key={tg} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 border">{tg}</span>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-800">{lang==="en" ? item.def_en : item.def_es}</p>

            <div className="mt-3">
              {/* Simple related links based on tag heuristics */}
              {item.tags?.includes("credit") && (
                <Link href="/tools?topic=confidence" className="text-sm underline">
                  {lang==="en" ? "See credit-building guides →" : "Ver guías para construir crédito →"}
                </Link>
              )}
              {item.tags?.includes("fees") && (
                <Link href="/tools?topic=trust" className="text-sm underline">
                  {lang==="en" ? "See fee-avoidance tips →" : "Ver consejos para evitar cargos →"}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
