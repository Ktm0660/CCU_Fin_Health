import type { BucketKey5 } from "./assessment";

/** Lightweight catalog item for tailored suggestions. */
export type RecItem = {
  title: string;
  href: string;      // can be internal route or external URL
  kind: "tool" | "edu" | "product";
};

/** Buckets for each dimension. */
export type Buckets = {
  habits: BucketKey5;
  confidence: BucketKey5;
  stability: BucketKey5;
};

type Locale = "en" | "es";

/** Rank helper for choosing weakest/strongest dims. */
const rank: Record<BucketKey5, number> = {
  rebuilding: 1,
  getting_started: 2,
  progress: 3,
  on_track: 4,
  empowered: 5
};

const L = (locale: Locale, en: string, es: string) => (locale === "en" ? en : es);

/**
 * recommend: returns 4–6 items focused on the lowest dimension bucket,
 * plus 1–2 general supports. Internal routes prefer your site; swap or
 * extend with CU-specific links anytime.
 */
export function recommend(b: Buckets, locale: Locale): RecItem[] {
  // Determine the weakest dimension (lowest rank). Tie-breaker favors Stability, then Habits, then Confidence.
  const dims = [
    { key: "stability", r: rank[b.stability] },
    { key: "habits", r: rank[b.habits] },
    { key: "confidence", r: rank[b.confidence] }
  ] as const;

  const weakest = dims.slice().sort((a, z) => a.r - z.r)[0].key as "habits" | "confidence" | "stability";

  const out: RecItem[] = [];

  // Stability-focused recs
  if (weakest === "stability") {
    out.push(
      {
        kind: "tool",
        title: L(locale, "Start a $100–$300 mini emergency fund", "Inicia un fondo de emergencia de $100–$300"),
        href: "/resources#emergency"
      },
      {
        kind: "tool",
        title: L(locale, "Set up automatic savings (even $10/week)", "Activa ahorro automático (aunque sea $10/semana)"),
        href: "/resources#autosave"
      },
      {
        kind: "edu",
        title: L(locale, "Plan for surprise bills (car, home, medical)", "Planifica gastos sorpresa (auto, hogar, médico)"),
        href: "/resources#sinking-funds"
      },
      {
        kind: "product",
        title: L(locale, "Explore a low-fee savings account (optional)", "Explora una cuenta de ahorro de bajo costo (opcional)"),
        href: "/products#savings"
      }
    );
  }

  // Habits-focused recs
  if (weakest === "habits") {
    out.push(
      {
        kind: "tool",
        title: L(locale, "One-page spending plan (needs → wants)", "Plan de gastos de una página (necesidades → gustos)"),
        href: "/resources#spending-plan"
      },
      {
        kind: "tool",
        title: L(locale, "Set one bill to autopay (minimum)", "Activa pago automático en una cuenta (mínimo)"),
        href: "/resources#autopay"
      },
      {
        kind: "edu",
        title: L(locale, "3-minute list before grocery/gas", "Lista de 3 minutos antes de súper/gasolina"),
        href: "/resources#shopping-list"
      },
      {
        kind: "product",
        title: L(locale, "Optional: alerts in digital banking", "Opcional: alertas en banca digital"),
        href: "/resources#alerts"
      }
    );
  }

  // Confidence-focused recs
  if (weakest === "confidence") {
    out.push(
      {
        kind: "edu",
        title: L(locale, "Understand your free credit report", "Entiende tu reporte de crédito gratis"),
        href: "/resources#credit-report"
      },
      {
        kind: "tool",
        title: L(locale, "Questions to ask at a credit union—no judgment", "Preguntas para hacer en la cooperativa—sin juicios"),
        href: "/resources#questions"
      },
      {
        kind: "tool",
        title: L(locale, "Schedule a conversation with a counselor", "Agenda una conversación con un consejero"),
        href: "/resources#counseling"
      },
      {
        kind: "product",
        title: L(locale, "Optional: secured card/credit builder", "Opcional: tarjeta garantizada/constructor de crédito"),
        href: "/products#credit-builder"
      }
    );
  }

  // General supports (always helpful)
  out.push(
    {
      kind: "edu",
      title: L(locale, "How to handle a $400 surprise cost", "Cómo cubrir un gasto sorpresa de $400"),
      href: "/resources#handle-400"
    },
    {
      kind: "tool",
      title: L(locale, "Find nearby branches/mobile unit schedule", "Ubica sucursales/programa de unidad móvil"),
      href: "/resources#mobile"
    }
  );

  // De-duplicate by title in case of overlap
  const seen = new Set<string>();
  return out.filter(i => (seen.has(i.title) ? false : (seen.add(i.title), true)));
}
