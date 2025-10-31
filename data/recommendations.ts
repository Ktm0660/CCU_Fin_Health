/**
 * Bilingual, pillar-aware catalog + ranker.
 * Exports:
 *   - recommend(buckets, locale, opts?) : RecLocalized[]
 *   - catalog
 * Types:
 *   - BucketKey5 (same keys as elsewhere)
 */
import type { BucketKey5 } from "./assessment";

export type Locale = "en" | "es";
export type Pillar = "habits" | "confidence" | "stability" | "access" | "resilience";

export type RecItem = {
  id: string;
  kind: "tool" | "edu" | "product";
  dims: Pillar[];                  // which pillars this helps
  title: { en: string; es: string };
  blurb: { en: string; es: string };
  href: string;                    // internal route or external link
  effort: "micro" | "low" | "med" | "high";
  cost?: "free" | "$" | "$$";
  eligibility?: {
    creditPull?: boolean;
    accountRequired?: boolean;
    branchVisit?: boolean;
    language?: ("en" | "es")[];
  };
};

export type BucketsArg = Record<Pillar, BucketKey5>;

// Return type with localized strings
export type RecLocalized = Omit<RecItem, "title" | "blurb"> & {
  title: string;
  blurb: string;
};

// Lower number = weaker → higher priority
const rankOrder: Record<BucketKey5, number> = {
  building: 1,
  getting_started: 2,
  progress: 3,
  on_track: 4,
  empowered: 5,
};

const catalog: RecItem[] = [
  {
    id: "habit-jars",
    kind: "tool",
    dims: ["habits"],
    title: {
      en: "Bill-Calendar & Habit Jars",
      es: "Calendario de Pagos y ‘Jarras’ de Hábitos",
    },
    blurb: {
      en: "A five-minute weekly planner that pairs due-dates with tiny, repeatable money habits.",
      es: "Un planificador semanal de cinco minutos que combina fechas de pago con micro-hábitos financieros.",
    },
    href: "/tools/habit-jars",
    effort: "micro",
    cost: "free",
  },
  {
    id: "confidence-coach",
    kind: "tool",
    dims: ["confidence"],
    title: { en: "Friendly Finance Coach", es: "Asesor Financiero Amigable" },
    blurb: {
      en: "Scripted, judgment-free check-ins and templates for tough calls (like talking to a lender or landlord).",
      es: "Acompañamiento sin juicios y guiones útiles para conversaciones difíciles (con prestamistas o propietarios).",
    },
    href: "/coach",
    effort: "low",
    cost: "free",
  },
  {
    id: "stability-buffer",
    kind: "product",
    dims: ["stability"],
    title: { en: "Rainy-Day Share (Goal Sub-Account)", es: "Ahorro de Emergencia (Subcuenta Objetivo)" },
    blurb: {
      en: "Name your goal, set auto-transfers, and watch a safety cushion grow.",
      es: "Nombra tu meta, activa transferencias automáticas y crea tu colchón de seguridad.",
    },
    href: "/products/goal-saver",
    effort: "low",
    eligibility: { accountRequired: true, language: ["en", "es"] },
  },
  {
    id: "access-itin",
    kind: "product",
    dims: ["access"],
    title: { en: "ITIN-Friendly Checking", es: "Cuenta de Cheques Apta para ITIN" },
    blurb: {
      en: "No SSN required. Human support to get started and avoid common fees.",
      es: "Sin necesidad de SSN. Apoyo humano para empezar y evitar cargos comunes.",
    },
    href: "/products/checking-itin",
    effort: "low",
    cost: "$",
    eligibility: { accountRequired: true, language: ["en", "es"] },
  },
  {
    id: "resilience-credit-builder",
    kind: "product",
    dims: ["resilience"],
    title: { en: "Credit Builder Loan", es: "Préstamo para Construir Crédito" },
    blurb: {
      en: "Small fixed payments reported to bureaus. Builds payment history safely.",
      es: "Pagos fijos pequeños reportados a burós. Construye historial de pagos con seguridad.",
    },
    href: "/products/credit-builder",
    effort: "med",
    cost: "$",
    eligibility: { creditPull: true, accountRequired: true },
  },
  {
    id: "edu-budget-101",
    kind: "edu",
    dims: ["habits", "stability"],
    title: { en: "Budgeting 101 (FiCEP-aligned)", es: "Presupuesto 101 (alineado a FiCEP)" },
    blurb: {
      en: "Short lessons + worksheet bundle mapped to FiCEP: tracking, categorizing, and adjusting.",
      es: "Lecciones cortas + plantillas según FiCEP: registro, categorías y ajustes.",
    },
    href: "/learn/budget-101",
    effort: "low",
    cost: "free",
  },
  {
    id: "edu-debt-options",
    kind: "edu",
    dims: ["stability", "resilience"],
    title: { en: "Debt Options, Decoded", es: "Opciones de Deuda, al Detalle" },
    blurb: {
      en: "Snowball vs. avalanche, consolidation, hardship—when each path makes sense.",
      es: "‘Bola de nieve’ vs. ‘Avalancha’, consolidación, dificultad—cuándo conviene cada camino.",
    },
    href: "/learn/debt-options",
    effort: "low",
    cost: "free",
  },
  {
    id: "access-banker-hours",
    kind: "tool",
    dims: ["access", "confidence"],
    title: { en: "Ask-a-Banker (Asynchronous)", es: "Pregunta a un Banquero (Asíncrono)" },
    blurb: {
      en: "Send a question anytime and get a response by the next business day.",
      es: "Envía tu pregunta en cualquier momento y recibe respuesta el siguiente día hábil.",
    },
    href: "/tools/ask-banker",
    effort: "micro",
    cost: "free",
  },
  {
    id: "resilience-scam-shield",
    kind: "edu",
    dims: ["resilience"],
    title: { en: "Scam Shield Mini-Course", es: "Mini-Curso: Escudo contra Estafas" },
    blurb: {
      en: "Spot red flags in texts, calls, and wires. Practice with real examples.",
      es: "Detecta señales de alerta en mensajes, llamadas y transferencias. Practica con casos reales.",
    },
    href: "/learn/scam-shield",
    effort: "low",
    cost: "free",
  },
];

function priorityFor(p: Pillar, buckets: BucketsArg) {
  // Lower bucket rank -> higher priority
  return rankOrder[buckets[p]];
}

function sortByImpact(buckets: BucketsArg, items: RecItem[]) {
  return [...items].sort((a, b) => {
    // Compare by worst pillar each item targets
    const aMin = Math.min(...a.dims.map((d) => priorityFor(d, buckets)));
    const bMin = Math.min(...b.dims.map((d) => priorityFor(d, buckets)));
    if (aMin !== bMin) return aMin - bMin;

    // Then prefer micro/low effort first for momentum
    const effortRank = { micro: 1, low: 2, med: 3, high: 4 } as const;
    const aE = effortRank[a.effort];
    const bE = effortRank[b.effort];
    if (aE !== bE) return aE - bE;

    // Then prefer free/low-cost
    const costRank = { free: 1, $: 2, $$: 3 } as const;
    const aC = a.cost ? costRank[a.cost] : 2;
    const bC = b.cost ? costRank[b.cost] : 2;
    return aC - bC;
  });
}

export function recommend(
  buckets: BucketsArg,
  locale: Locale,
  opts?: { limit?: number; includeDims?: Pillar[] }
): RecLocalized[] {
  const limit = opts?.limit ?? 6;
  const includeDims = opts?.includeDims;

  const pool = includeDims?.length
    ? catalog.filter((c) => c.dims.some((d) => includeDims.includes(d)))
    : catalog;

  const ranked = sortByImpact(buckets, pool);

  // Order pillars by weakness (lowest bucket rank first)
  const pillarsByWeakness = (["habits", "confidence", "stability", "access", "resilience"] as Pillar[])
    .sort((a, b) => priorityFor(a, buckets) - priorityFor(b, buckets));

  const out: RecItem[] = [];

  // Take up to 3 from each pillar starting with weakest, then fill
  for (const p of pillarsByWeakness) {
    for (const item of ranked) {
      if (out.length >= limit) break;
      if (item.dims.includes(p) && !out.find((x) => x.id === item.id)) {
        out.push(item);
        if (out.filter((x) => x.dims.includes(p)).length >= 3) break;
      }
    }
    if (out.length >= limit) break;
  }

  if (out.length < limit) {
    for (const item of ranked) {
      if (out.length >= limit) break;
      if (!out.find((x) => x.id === item.id)) out.push(item);
    }
  }

  // Localize on return
  const localized: RecLocalized[] = out.map((r) => ({
    ...r,
    title: r.title[locale] ?? r.title.en,
    blurb: r.blurb[locale] ?? r.blurb.en,
  }));

  return localized;
}

export type RecCatalog = typeof catalog;
export { catalog };
