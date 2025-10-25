export type Area = "habits" | "confidence" | "stability";
export type Level = "discover" | "stabilize" | "grow" | "thrive";

export type Lesson = {
  id: string;
  area: Area;
  level: Level;
  // Plain-language, bilingual
  title_en: string;
  title_es: string;
  summary_en: string;
  summary_es: string;
  href: string; // internal route or external link
  duration_min: number; // rough time
};

const L = (
  id: string,
  area: Area,
  level: Level,
  enTitle: string,
  esTitle: string,
  enSummary: string,
  esSummary: string,
  href: string,
  min: number
): Lesson => ({
  id, area, level,
  title_en: enTitle, title_es: esTitle,
  summary_en: enSummary, summary_es: esSummary,
  href, duration_min: min
});

/** Initial micro-library: short, actionable, zero-jargon. */
export const lessons: Lesson[] = [
  // HABITS
  L(
    "habits-list",
    "habits", "discover",
    "Make a 1-page spending list",
    "Haz una lista de gastos de 1 página",
    "Sort money into Needs → Bills → Wants. Use it before groceries or gas; it’s not a spreadsheet—just a list.",
    "Ordena el dinero en Necesidades → Cuentas → Gustos. Úsala antes del súper o gasolina; no es una hoja de cálculo—solo una lista.",
    "/resources#spending-list", 3
  ),
  L(
    "habits-alerts",
    "habits", "stabilize",
    "Turn on balance & large-purchase alerts",
    "Activa alertas de saldo y compras grandes",
    "Automatic nudges reduce surprises and help you catch mistakes early.",
    "Avisos automáticos evitan sorpresas y te ayudan a corregir a tiempo.",
    "/resources#alerts", 2
  ),
  L(
    "habits-checkin",
    "habits", "grow",
    "Monthly 15-minute money check-in",
    "Revisión mensual de 15 minutos",
    "Pick one day to scan your account, pay one lingering bill, and set one small goal.",
    "Elige un día para revisar tu cuenta, pagar un pendiente y fijar una meta pequeña.",
    "/resources#monthly-checkin", 4
  ),
  L(
    "habits-optimize",
    "habits", "thrive",
    "Trim one recurring expense",
    "Recorta un gasto recurrente",
    "Call or cancel one subscription; redirect the savings to your goal space.",
    "Cancela o baja un servicio; dirige ese ahorro a tu meta.",
    "/resources#trim-expenses", 5
  ),

  // STABILITY
  L(
    "stability-mini-fund",
    "stability", "discover",
    "Start a mini emergency fund ($100–$300)",
    "Empieza un fondo pequeño de emergencia ($100–$300)",
    "Open a separate space and auto-move a small amount each payday.",
    "Abre un espacio aparte y mueve automáticamente una cantidad pequeña cada pago.",
    "/resources#mini-emergency", 3
  ),
  L(
    "stability-automate",
    "stability", "stabilize",
    "Automate a tiny transfer",
    "Automatiza una transferencia pequeña",
    "Consistency beats size. Even $5 builds the habit and the buffer.",
    "La constancia gana al monto. Aunque sean $5, forma el hábito y el colchón.",
    "/resources#autosave", 2
  ),
  L(
    "stability-sinking",
    "stability", "grow",
    "Create a ‘repairs & surprises’ sinking fund",
    "Crea un apartado para ‘reparaciones y sorpresas’",
    "Set aside a few dollars monthly for car, appliances, or school costs.",
    "Aparta unos dólares al mes para auto, aparatos o escuela.",
    "/resources#sinking-fund", 4
  ),
  L(
    "stability-3to6",
    "stability", "thrive",
    "Grow toward 3–6 months of expenses",
    "Aumenta hacia 3–6 meses de gastos",
    "Use goal sub-accounts and step up your autosave after raises or tax refunds.",
    "Usa subcuentas por meta y sube el ahorro automático tras aumentos o devoluciones.",
    "/resources#three-to-six", 6
  ),

  // CONFIDENCE
  L(
    "confidence-questions",
    "confidence", "discover",
    "3 questions to ask any lender—without jargon",
    "3 preguntas para cualquier prestamista—sin jerga",
    "What’s the total cost? What happens if I’m late? How can I lower the rate or fees?",
    "¿Cuál es el costo total? ¿Qué pasa si me atraso? ¿Cómo bajo la tasa o comisiones?",
    "/resources#lender-questions", 3
  ),
  L(
    "confidence-credit-report",
    "confidence", "stabilize",
    "Pull your free credit report safely",
    "Descarga tu reporte de crédito gratis",
    "Check errors and understand the main drivers—on your schedule, privately.",
    "Revisa errores y entiende los factores principales—en privado, a tu ritmo.",
    "/resources#credit-report", 5
  ),
  L(
    "confidence-compare",
    "confidence", "grow",
    "Compare two loan offers side-by-side",
    "Compara dos préstamos lado a lado",
    "Use a simple total-cost sheet to see fees, APR, and penalties clearly.",
    "Usa una hoja de ‘costo total’ para ver comisiones, APR y penalizaciones.",
    "/resources#compare-loans", 4
  ),
  L(
    "confidence-story",
    "confidence", "thrive",
    "Practice your money story",
    "Practica tu historia de dinero",
    "Explain your goal in 30 seconds: income, plan, and how this product helps.",
    "Explica tu meta en 30 segundos: ingreso, plan y cómo ayuda este producto.",
    "/resources#money-story", 3
  ),
];

export function lessonTitle(l: Lesson, locale: "en"|"es") {
  return locale === "en" ? l.title_en : l.title_es;
}
export function lessonSummary(l: Lesson, locale: "en"|"es") {
  return locale === "en" ? l.summary_en : l.summary_es;
}

/** Pick N lessons by weakest area + current level; fall back with variety. */
export function pickLessons(
  area: Area,
  level: Level,
  locale: "en"|"es",
  n = 3
) {
  const primary = lessons.filter(l => l.area === area);
  // Prefer same or adjacent level
  const order: Level[] = [level, "discover", "stabilize", "grow", "thrive"];
  const ranked = order.flatMap(Lv => primary.filter(l => l.level === Lv));
  const unique = dedupeBy(ranked, l => l.id);
  return unique.slice(0, n);
}

function dedupeBy<T>(arr: T[], key: (t:T)=>string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const k = key(item);
    if (!seen.has(k)) { seen.add(k); out.push(item); }
  }
  return out;
}
