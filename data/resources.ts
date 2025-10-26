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
];

export function rTitle(r: Resource, locale: "en"|"es") {
  if (r.locale === "both") return locale==="en" ? r.title_en : r.title_es;
  return r.locale === "en" ? r.title_en : r.title_es;
}
export function rSummary(r: Resource, locale: "en"|"es") {
  if (r.locale === "both") return locale==="en" ? r.summary_en : r.summary_es;
  return r.locale === "en" ? r.summary_en : r.summary_es;
}
