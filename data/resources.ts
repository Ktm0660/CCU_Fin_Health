export type Area = "habits" | "confidence" | "stability" | "trust";
export type RType = "tool" | "explainer" | "download" | "video" | "product";

export type Resource = {
  id: string;
  type: RType;
  area: Area[];           // which dimensions this helps
  tags: string[];         // freeform: "ITIN","payday-alt","rural","spanish-first"
  title_en: string;
  title_es: string;
  summary_en: string;
  summary_es: string;
  href: string;           // internal route or external link
  locale: "en" | "es" | "both";
  body_en?: string;
  body_es?: string;
};

const R = (
  id: string,
  type: RType,
  area: Area[],
  tags: string[],
  title_en: string,
  title_es: string,
  summary_en: string,
  summary_es: string,
  href: string,
  locale: "en" | "es" | "both" = "both"
): Resource => ({
  id, type, area, tags, title_en, title_es, summary_en, summary_es, href, locale
});

// Seed items (add more freely)
export const resources: Resource[] = [
  R(
    "itin-explainer",
    "explainer",
    ["trust","confidence","stability"],
    ["ITIN","immigrant-friendly","spanish-first"],
    "ITIN lending at a credit union: what to bring and how it works",
    "Préstamos con ITIN en la cooperativa: requisitos y proceso",
    "Step-by-step guide to apply with an ITIN—documents, timelines, and transparent costs.",
    "Guía paso a paso para solicitar con ITIN—documentos, tiempos y costos transparentes.",
    "/products/itin-lending",
    "both"
  ),
  R(
    "payday-alternative",
    "explainer",
    ["stability","trust"],
    ["payday-alt","fee-transparency"],
    "Small-Dollar Relief (a safer payday alternative)",
    "Alivio de gastos pequeños (alternativa más segura al ‘payday’)",
    "Clear total-cost example vs. payday. How approval works without surprises.",
    "Ejemplo claro de costo total vs. ‘payday’. Cómo funciona la aprobación sin sorpresas.",
    "/products/small-dollar",
    "both"
  ),
  R(
    "mini-emergency-fund",
    "explainer",
    ["stability","habits"],
    ["starter","quick-win"],
    "Start a mini emergency fund ($100–$300)",
    "Empieza un fondo de emergencia pequeño ($100–$300)",
    "Create a separate space and automate a tiny transfer; your buffer starts here.",
    "Crea un espacio aparte y automatiza una transferencia pequeña; tu colchón inicia aquí.",
    "/resources#mini-emergency",
    "both"
  ),
  R(
    "credit-report-walkthrough",
    "tool",
    ["confidence"],
    ["no-jargon","privacy"],
    "Pull your free credit report safely",
    "Descarga tu reporte de crédito gratis",
    "A step-by-step, private walkthrough to check errors and understand the basics.",
    "Guía paso a paso y privada para revisar errores y entender lo básico.",
    "/resources#credit-report",
    "both"
  ),
  R(
    "alerts-howto",
    "tool",
    ["habits","stability"],
    ["automation","surprise-proof"],
    "Turn on balance & large-purchase alerts",
    "Activa alertas de saldo y compras grandes",
    "Catch issues early and reduce surprises—set alerts in a few taps.",
    "Detecta problemas temprano y reduce sorpresas—activa alertas en pocos pasos.",
    "/resources#alerts",
    "both"
  ),
  {
    id: "mini-emergency-fund-250",
    type: "explainer",
    area: ["stability","habits"],
    tags: ["savings","no-jargon","spanish-first"],
    title_en: "Build a $250 safety buffer (mini emergency fund)",
    title_es: "Crea un colchón de $250 (fondo de emergencia pequeño)",
    summary_en: "A simple, fast path to your first safety buffer—so surprise bills don’t sink the month.",
    summary_es: "Una ruta simple y rápida para tu primer colchón de seguridad—para que un gasto sorpresa no arruine el mes.",
    href: "/resources#mini-emergency-fund-250",
    locale: "both",
    body_en: `
**Why $250?** It’s small enough to start this week, big enough to catch many surprise bills.

**3-step plan**
1) Open/choose a savings pocket.
2) Turn on an automatic move: $10–$25 on payday.
3) Park unexpected money (rebates, refunds) here first.

**Tip:** Hide it from your main balance. Out of sight = out of temptation.`,
    body_es: `
**¿Por qué $250?** Es una meta alcanzable esta semana y suficiente para muchos imprevistos.

**Plan en 3 pasos**
1) Abre/elige un bolsillo de ahorro.
2) Activa un traslado automático: $10–$25 en día de pago.
3) Envía dinero inesperado (reembolsos) aquí primero.

**Consejo:** Mantén este dinero separado de tu saldo principal.`
  },
  {
    id: "safe-autopay-basics",
    type: "explainer",
    area: ["habits","stability"],
    tags: ["bill-pay","no-jargon"],
    title_en: "Set up bill autopay—safely",
    title_es: "Configura pagos automáticos—con seguridad",
    summary_en: "Use autopay for minimums + one “pay-down day” a month to lower stress without overdrafts.",
    summary_es: "Usa pagos automáticos para mínimos + un “día de avance” al mes para reducir estrés sin sobregiros.",
    href: "/resources#safe-autopay-basics",
    locale: "both",
    body_en: `
**Good autopay** = minimums only. Then pick one day a month to add extra to the highest-impact bill.

**Checklist**
- Turn on autopay minimums for utilities, phone, and credit cards.
- Set your **pay-down day** reminder.
- Keep a $50–$100 buffer in checking to avoid fees.`,
    body_es: `
**Buen autopago** = solo mínimos. Luego elige un día al mes para agregar extra al pago de mayor impacto.

**Lista**
- Activa pagos automáticos mínimos en servicios, teléfono y tarjetas.
- Pon un recordatorio para tu **día de avance**.
- Mantén $50–$100 de colchón en tu cuenta para evitar cargos.`
  },
  {
    id: "first-credit-builder-steps",
    type: "explainer",
    area: ["confidence","stability"],
    tags: ["credit","immigrant-friendly","no-jargon"],
    title_en: "Your first credit-builder steps",
    title_es: "Primeros pasos para construir crédito",
    summary_en: "A gentle start: secured card or share-secured loan, tiny limit, one bill, on-time every time.",
    summary_es: "Un inicio sencillo: tarjeta garantizada o préstamo con ahorro, límite pequeño, una cuenta, siempre a tiempo.",
    href: "/resources#first-credit-builder-steps",
    locale: "both",
    body_en: `
**Pick one:** secured card **or** share-secured loan.
- Use 5–10% of the limit each month (a small recurring bill works well).
- Pay on time—set autopay for the statement balance or minimum.

**After 6 months:** consider a limit increase or another trade line.`,
    body_es: `
**Elige uno:** tarjeta garantizada **o** préstamo con ahorro.
- Usa 5–10% del límite al mes (una cuenta recurrente funciona bien).
- Paga a tiempo—activa autopago del saldo o del mínimo.

**Después de 6 meses:** considera aumentar límite u otra línea.`
  },
  {
    id: "fee-finder-common-charges",
    type: "explainer",
    area: ["trust","confidence"],
    tags: ["fees","transparency","no-jargon"],
    title_en: "Fee finder: understand common bank/credit union fees",
    title_es: "Guía de cargos: entiende tarifas comunes",
    summary_en: "Spot the big four fees and how to avoid them—overdraft, non-network ATM, monthly service, and late fees.",
    summary_es: "Identifica las 4 tarifas más comunes y cómo evitarlas—sobregiro, cajero no afiliado, cargo mensual y moras.",
    href: "/resources#fee-finder-common-charges",
    locale: "both",
    body_en: `
**Overdraft/NSF:** keep a small buffer; consider opt-out or low-balance alerts.
**Non-network ATM:** use your network or cash-back with a purchase.
**Monthly service fee:** ask about no-fee/low-fee accounts or direct deposit waivers.
**Late fee:** autopay minimum + calendar reminder for the rest.`,
    body_es: `
**Sobregiro/NSF:** mantén un pequeño colchón; considera alertas o no participar.
**Cajero no afiliado:** usa cajeros de tu red o retiro con compra.
**Cargo mensual:** pregunta por cuentas sin cargo o con depósito directo.
**Mora:** autopago del mínimo + recordatorio para el resto.`
  }
];

export function rTitle(r: Resource, locale: "en"|"es") {
  if (r.locale === "both") return locale==="en" ? r.title_en : r.title_es;
  return r.locale === "en" ? r.title_en : r.title_es;
}
export function rSummary(r: Resource, locale: "en"|"es") {
  if (r.locale === "both") return locale==="en" ? r.summary_en : r.summary_es;
  return r.locale === "en" ? r.summary_en : r.summary_es;
}
