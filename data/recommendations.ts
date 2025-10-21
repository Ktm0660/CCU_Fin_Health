import type { BucketKey } from "./assessment";

/** Lightweight catalog for tailored suggestions. href can be external or internal. */
export type RecItem = { title: string; href: string; kind: "tool" | "edu" | "product" };

export function recommend(dimBuckets: { habits: BucketKey; confidence: BucketKey; stability: BucketKey }, locale: "en"|"es"): RecItem[] {
  const t = (en:string, es:string)=> locale==="en"? en : es;
  const items: RecItem[] = [];

  // Habits-driven tips
  if (dimBuckets.habits === "start") {
    items.push(
      { title: t("Starter Budget (Printable)", "Presupuesto inicial (Imprimible)"), href: "https://www.consumerfinance.gov/consumer-tools/budgeting/", kind: "tool" },
      { title: t("Needs-First Spending List", "Lista de gastos: necesidades primero"), href: "/resources", kind: "edu" }
    );
  } else if (dimBuckets.habits === "building") {
    items.push(
      { title: t("Envelope/Cash-Friendly Tips", "Consejos para sobres/efectivo"), href: "/resources", kind: "edu" }
    );
  } else {
    items.push(
      { title: t("Optimize Bill-Pay & Autopay", "Optimiza pagos y domiciliaciones"), href: "/resources", kind: "edu" }
    );
  }

  // Confidence-driven tips
  if (dimBuckets.confidence === "start") {
    items.push(
      { title: t("Talk with a Certified Financial Counselor (Free)", "Habla con un consejero financiero certificado (Gratis)"), href: "/products", kind: "product" },
      { title: t("Credit Report Access", "Acceso a reporte de crédito"), href: "https://www.annualcreditreport.com", kind: "tool" }
    );
  } else if (dimBuckets.confidence === "building") {
    items.push(
      { title: t("Plain-Language Fee Guide", "Guía de comisiones en lenguaje claro"), href: "/products", kind: "product" }
    );
  } else {
    items.push(
      { title: t("Plan Next Big Goal (Template)", "Plantilla para próxima meta grande"), href: "/resources", kind: "tool" }
    );
  }

  // Stability-driven tips
  if (dimBuckets.stability === "start") {
    items.push(
      { title: t("Mini Emergency Fund ($100–$300)", "Fondo de emergencia pequeño ($100–$300)"), href: "/resources", kind: "tool" },
      { title: t("Small-Dollar Bridge Loan (Alt to Payday)", "Préstamo puente de bajo monto (Alternativa a rápida)"), href: "/products", kind: "product" }
    );
  } else if (dimBuckets.stability === "building") {
    items.push(
      { title: t("Savings Builder (Auto-Deposit)", "Ahorros programados (Depósito automático)"), href: "/products", kind: "product" }
    );
  } else {
    items.push(
      { title: t("ITIN Auto/Signature Lending (If Needed)", "Préstamos con ITIN (si se requiere)"), href: "/products", kind: "product" }
    );
  }

  return dedupe(items);
}

function dedupe(items: RecItem[]): RecItem[] {
  const seen = new Set<string>();
  return items.filter(i => {
    const key = `${i.title}|${i.href}|${i.kind}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
