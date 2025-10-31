import { type Locale, t } from "@/lib/locale";
import { type AreaKey, type Bucket } from "@/data/personas";
import { type BucketKey5 } from "./assessment";
import { resources } from "./resources";

export type BucketsArg = Record<AreaKey, Bucket>;

export type RecItem = {
  id: string;
  title: string;
  detail?: string;
  href?: string;
};

export type RecommendationCard = {
  slug: string;
  title_en: string;
  title_es: string;
  summary_en?: string;
  summary_es?: string;
  href: string;
  title?: string;
};

const resourceMap = new Map(resources.map(r => [r.id, r]));

const bucketResourceMap: Record<BucketKey5, string[]> = {
  building: ["mini-emergency-fund", "safe-autopay-basics", "payday-alternative"],
  getting_started: ["mini-emergency-fund-250", "alerts-howto", "first-credit-builder-steps"],
  progress: ["alerts-howto", "credit-report-walkthrough", "fee-finder-common-charges"],
  on_track: ["credit-report-walkthrough", "itin-explainer", "safe-autopay-basics"],
  empowered: ["fee-finder-common-charges", "itin-explainer", "alerts-howto"],
};

function toCard(id: string): RecommendationCard | null {
  const res = resourceMap.get(id);
  if (!res) {
    return null;
  }
  return {
    slug: res.id,
    title_en: res.title_en,
    title_es: res.title_es || res.title_en,
    summary_en: res.summary_en,
    summary_es: res.summary_es || res.summary_en,
    href: res.href,
    title: res.title_en,
  };
}

function fallbackCards(): RecommendationCard[] {
  return resources.slice(0, 3).map(res => ({
    slug: res.id,
    title_en: res.title_en,
    title_es: res.title_es || res.title_en,
    summary_en: res.summary_en,
    summary_es: res.summary_es || res.summary_en,
    href: res.href,
    title: res.title_en,
  }));
}

function recommendFromBuckets(
  buckets: BucketsArg,
  locale: Locale,
  opts?: { limit?: number; includeDims?: AreaKey[] }
): RecItem[] {
  const inc = opts?.includeDims ?? (["habits", "stability", "confidence"] as AreaKey[]);
  const limit = opts?.limit ?? 3;

  const book = {
    habits: {
      getting_started: [
        t(
          "Use a simple “needs, goals, wants” list for the week.",
          "Usa una lista simple: necesidades, metas, gustos para la semana.",
          locale
        ),
        t(
          "Move $10–$25 per payday into a small buffer.",
          "Mueve $10–$25 por quincena a un pequeño colchón.",
          locale
        ),
      ],
      building: [
        t(
          "Schedule one “pay-down day” monthly.",
          "Programa un “día de pago de deudas” al mes.",
          locale
        ),
      ],
      progress: [
        t(
          "Pre-plan groceries with a 3-item swap list.",
          "Planifica víveres con una lista de 3 sustituciones.",
          locale
        ),
      ],
      on_track: [
        t("Auto-move savings on payday.", "Ahorro automático el día de pago.", locale),
      ],
      empowered: [
        t("Share your system—teach a friend.", "Comparte tu sistema—enseña a un amigo.", locale),
      ],
    },
    stability: {
      getting_started: [
        t(
          "Auto-schedule minimums and due dates.",
          "Programa mínimos y fechas de pago automáticos.",
          locale
        ),
      ],
      building: [
        t(
          "Create an emergency jar and label it “buffer”.",
          "Crea un frasco de emergencia y nómbralo “colchón”.",
          locale
        ),
      ],
      progress: [
        t("Grow buffer to $200–$400.", "Aumenta el colchón a $200–$400.", locale),
      ],
      on_track: [
        t("Build to 1 month of expenses.", "Sube a 1 mes de gastos.", locale),
      ],
      empowered: [
        t(
          "Check insurance deductibles vs. cash on hand.",
          "Revisa deducibles vs. efectivo disponible.",
          locale
        ),
      ],
    },
    confidence: {
      getting_started: [
        t(
          "Check credit report once; note 1–2 questions.",
          "Revisa tu reporte de crédito; anota 1–2 dudas.",
          locale
        ),
      ],
      building: [
        t(
          "Turn on balance and deposit alerts.",
          "Activa alertas de saldos y depósitos.",
          locale
        ),
      ],
      progress: [
        t(
          "Track three categories only this week.",
          "Controla solo tres rubros esta semana.",
          locale
        ),
      ],
      on_track: [
        t(
          "Set quarterly review on calendar.",
          "Agenda una revisión trimestral.",
          locale
        ),
      ],
      empowered: [
        t(
          "Mentor someone on budgeting basics.",
          "Guía a alguien en presupuesto básico.",
          locale
        ),
      ],
    },
    access: {
      getting_started: [
        t(
          "Add direct deposit to reduce fees and delays.",
          "Activa depósito directo para evitar retrasos y comisiones.",
          locale
        ),
      ],
      building: [
        t(
          "Ask about secured card / credit builder.",
          "Pregunta por tarjeta asegurada / “credit builder”.",
          locale
        ),
      ],
      progress: [
        t(
          "Bundle services (checking + savings) for perks.",
          "Agrupa servicios (cheques + ahorro) para beneficios.",
          locale
        ),
      ],
      on_track: [
        t(
          "Rate checkup: compare CU rates to current loans.",
          "Revisa tasas: compara las de la cooperativa con tus préstamos.",
          locale
        ),
      ],
      empowered: [
        t(
          "Explore member-only investment or CD specials.",
          "Explora inversiones o CDs exclusivos para socios.",
          locale
        ),
      ],
    },
    resilience: {
      getting_started: [
        t(
          "List 3 local supports (family, church, clinic).",
          "Anota 3 apoyos locales (familia, iglesia, clínica).",
          locale
        ),
      ],
      building: [
        t(
          "Create a “when life happens” checklist.",
          "Crea una lista de “cuando pase algo”.",
          locale
        ),
      ],
      progress: [
        t(
          "Practice a 2-minute breathe-reset before money tasks.",
          "Practica una respiración de 2 minutos antes de tareas de dinero.",
          locale
        ),
      ],
      on_track: [
        t(
          "Automate donations/charity as values allow.",
          "Automatiza donaciones según tus valores.",
          locale
        ),
      ],
      empowered: [
        t(
          "Build community savings/rotating group.",
          "Crea un grupo de ahorro rotativo comunitario.",
          locale
        ),
      ],
    },
  } as const;

  const out: RecItem[] = [];
  for (const dim of inc) {
    const b = buckets[dim];
    const picks = (book as any)[dim][b] as string[];
    for (const p of picks) out.push({ id: `${dim}:${b}:${p.slice(0, 16)}`, title: p });
  }
  return out.slice(0, limit);
}

export function recommend(bucket: BucketKey5): RecommendationCard[];
export function recommend(
  buckets: BucketsArg,
  locale: Locale,
  opts?: { limit?: number; includeDims?: AreaKey[] }
): RecItem[];
export function recommend(
  arg: BucketKey5 | BucketsArg,
  locale?: Locale,
  opts?: { limit?: number; includeDims?: AreaKey[] }
): RecommendationCard[] | RecItem[] {
  if (typeof arg === "string") {
    const ids = bucketResourceMap[arg] ?? [];
    const cards = ids
      .map(id => toCard(id))
      .filter((card): card is RecommendationCard => Boolean(card));
    if (cards.length) return cards;
    return fallbackCards();
  }
  if (!locale) throw new Error("locale is required when recommending by buckets");
  return recommendFromBuckets(arg, locale, opts);
}

export { recommendFromBuckets };
