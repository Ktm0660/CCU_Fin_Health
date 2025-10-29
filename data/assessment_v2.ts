export type Pillar = "habits" | "confidence" | "resilience" | "inclusion";

export type ChoiceOpt = {
  text_en: string;
  text_es: string;
  // weight contribution per pillar (−2..+2)
  w: Partial<Record<Pillar, number>>;
};

export type ChoiceQuestion = {
  id: string;
  kind: "choice";
  text_en: string;
  text_es: string;
  pillar: Pillar; // primary attribution (for guidance)
  options: ChoiceOpt[];
  skipIf?: { key: string; equals: number | string | boolean }; // simple skip gate
};

export type SliderQuestion = {
  id: string;
  kind: "slider";
  text_en: string;
  text_es: string;
  pillar: Pillar;
  left_en: string;
  left_es: string;
  right_en: string;
  right_es: string;
  // slider is discretized to 5 buckets [0..4] → −2..+2
  map?: number[]; // optional override of [-2,-1,0,1,2]
  skipIf?: { key: string; equals: number | string | boolean };
};

export type QV2 = ChoiceQuestion | SliderQuestion;

export type AnswersV2 = Record<string, number>; // for choice: option index; for slider: bucket 0..4

export const LABELS = {
  buckets: (pct: number) =>
    pct < 40 ? "Needs Focus" :
    pct < 70 ? "Building" :
    pct < 85 ? "Solid" : "Strong"
};

// Helper to make options quickly
const o = (
  en: string, es: string,
  w: Partial<Record<Pillar, number>>
): ChoiceOpt => ({ text_en: en, text_es: es, w });

// Slider map default
const SLIDER_MAP = [-2, -1, 0, 1, 2];

// 16-question compact set (FiCEP-aligned), with minimal skip-logic
export const questions_v2: QV2[] = [
  // HABITS (4)
  { id: "q1", kind: "choice", pillar: "habits",
    text_en: "End of month, do you know where the money went?",
    text_es: "Al fin de mes, ¿sabes adónde se fue el dinero?",
    options: [
      o("Yes, I track closely.", "Sí, lo registro de cerca.", { habits: 2 }),
      o("General idea.", "Tengo una idea general.", { habits: 1 }),
      o("Not really.", "No mucho.", { habits: -1 }),
      o("No, I often wonder.", "No, a menudo me pregunto.", { habits: -2 }),
    ]
  },
  { id: "q2", kind: "choice", pillar: "habits",
    text_en: "Bill-pay routine?",
    text_es: "¿Rutina para pagar cuentas?",
    options: [
      o("Autopay or set schedule.", "Pagos automáticos o calendario.", { habits: 2, resilience: 1 }),
      o("Usually on time.", "Casi siempre a tiempo.", { habits: 1 }),
      o("Sometimes late.", "A veces tarde.", { habits: -1, resilience: -1 }),
      o("Often late or unsure.", "A menudo tarde o no sé.", { habits: -2, resilience: -1 }),
    ]
  },
  { id: "q3", kind: "choice", pillar: "habits",
    text_en: "Groceries/gas decisions:",
    text_es: "Decisiones en comida/gasolina:",
    options: [
      o("List/budget first.", "Lista/presupuesto primero.", { habits: 2 }),
      o("Try to spend carefully.", "Intento gastar con cuidado.", { habits: 1 }),
      o("Buy in the moment.", "Compro en el momento.", { habits: -1 }),
      o("Often impulse.", "A menudo por impulso.", { habits: -2 }),
    ]
  },
  { id: "q4", kind: "slider", pillar: "habits",
    text_en: "Impulse control day-to-day",
    text_es: "Control de impulsos día a día",
    left_en: "Often impulsive", left_es: "A menudo impulsivo",
    right_en: "Rarely impulsive", right_es: "Rara vez impulsivo",
  },

  // CONFIDENCE (4)
  { id: "q5", kind: "choice", pillar: "confidence",
    text_en: "Comfort asking bank/credit union questions?",
    text_es: "¿Comodidad para preguntar al banco/cooperativa?",
    options: [
      o("Very comfortable.", "Muy cómodo.", { confidence: 2 }),
      o("Depends on the person.", "Depende de la persona.", { confidence: 1 }),
      o("Uncomfortable.", "Incómodo.", { confidence: -1 }),
      o("I avoid it.", "Lo evito.", { confidence: -2 }),
    ]
  },
  { id: "q6", kind: "choice", pillar: "confidence",
    text_en: "Understanding of fees/interest?",
    text_es: "¿Entendimiento de comisiones/intereses?",
    options: [
      o("Clear understanding.", "Entiendo claramente.", { confidence: 2 }),
      o("Basic idea.", "Una idea básica.", { confidence: 1 }),
      o("Not sure.", "No estoy seguro.", { confidence: -1 }),
      o("I find it confusing.", "Me confunde.", { confidence: -2 }),
    ]
  },
  { id: "q7", kind: "slider", pillar: "confidence",
    text_en: "Goal clarity",
    text_es: "Claridad de metas",
    left_en: "Fuzzy", left_es: "Difusas",
    right_en: "Clear & written", right_es: "Claras y escritas",
  },
  { id: "q8", kind: "choice", pillar: "confidence",
    text_en: "Do you read statements or app activity?",
    text_es: "¿Revisas estados o actividad en la app?",
    options: [
      o("Yes, regularly.", "Sí, regularmente.", { confidence: 2, habits: 1 }),
      o("Sometimes.", "A veces.", { confidence: 1 }),
      o("Rarely.", "Rara vez.", { confidence: -1 }),
      o("Never.", "Nunca.", { confidence: -2 }),
    ]
  },

  // RESILIENCE (5)
  { id: "q9", kind: "choice", pillar: "resilience",
    text_en: "Emergency cushion?",
    text_es: "¿Colchón de emergencias?",
    options: [
      o("Several months saved.", "Varios meses ahorrados.", { resilience: 2 }),
      o("A little.", "Un poco.", { resilience: 1 }),
      o("Not now; want to start.", "No ahora; quiero empezar.", { resilience: 0 }),
      o("None; paycheck to paycheck.", "Nada; vivo al día.", { resilience: -2 }),
    ]
  },
  { id: "q10", kind: "slider", pillar: "resilience",
    text_en: "Income predictability",
    text_es: "Previsibilidad de ingresos",
    left_en: "Irregular", left_es: "Irregular",
    right_en: "Predictable", right_es: "Previsible",
  },
  { id: "q11", kind: "choice", pillar: "resilience",
    text_en: "Debt stress",
    text_es: "Estrés por deudas",
    options: [
      o("Manage well/on time.", "Manejo bien/a tiempo.", { resilience: 2, confidence: 1 }),
      o("Okay, sometimes hard.", "Bien, a veces difícil.", { resilience: 0 }),
      o("Stressful/overwhelming.", "Estresante/abrumador.", { resilience: -2, confidence: -1 }),
      o("I don't have debt.", "No tengo deudas.", { resilience: 1 }),
    ]
  },
  { id: "q12", kind: "choice", pillar: "resilience",
    text_en: "$400 surprise—what happens?",
    text_es: "Sorpresa de $400—¿qué pasa?",
    options: [
      o("Cover from savings.", "Cubro con ahorros.", { resilience: 2 }),
      o("Use savings + adjust budget.", "Ahorros + ajusto presupuesto.", { resilience: 1 }),
      o("Delay a bill/borrow small.", "Retraso un pago/pido poco.", { resilience: -1 }),
      o("Payday/overdraft.", "Prestamista rápido/sobregiro.", { resilience: -2 }),
    ]
  },
  { id: "q13", kind: "slider", pillar: "resilience",
    text_en: "Month-end leftover",
    text_es: "Sobrante al fin de mes",
    left_en: "Shortfall", left_es: "Falta",
    right_en: "Some leftover", right_es: "Algo sobrante",
  },

  // INCLUSION (3)
  { id: "q14", kind: "choice", pillar: "inclusion",
    text_en: "Current account status",
    text_es: "Estado actual de cuenta",
    options: [
      o("Active & used often.", "Activa y la uso seguido.", { inclusion: 2 }),
      o("Have one; use rarely.", "Tengo; uso poco.", { inclusion: 0 }),
      o("Used to; not now.", "Antes sí; ya no.", { inclusion: -1 }),
      o("Unbanked now.", "Sin cuenta ahora.", { inclusion: -2 }),
    ]
  },
  { id: "q15", kind: "slider", pillar: "inclusion",
    text_en: "Trust with financial institutions",
    text_es: "Confianza con instituciones financieras",
    left_en: "Low trust", left_es: "Baja confianza",
    right_en: "High trust", right_es: "Alta confianza",
  },
  { id: "q16", kind: "choice", pillar: "inclusion",
    text_en: "Barriers you’ve faced?",
    text_es: "¿Barreras que has enfrentado?",
    options: [
      o("None significant.", "Ninguna significativa.", { inclusion: 2 }),
      o("Language/communication.", "Idioma/comunicación.", { inclusion: -1, confidence: -1 }),
      o("Not welcomed/understood.", "No me entendieron/recibieron.", { inclusion: -2 }),
      o("Prefer cash/payday.", "Prefiero efectivo/prestamistas.", { inclusion: -2, resilience: -1 }),
    ]
  },
];

export function shuffle<T>(arr: T[], rng = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function normalizePillarScore(raw: number, max: number): number {
  if (max <= 0) return 0;
  const pct = Math.max(0, Math.min(100, Math.round(((raw + max) / (2 * max)) * 100)));
  // Explanation: each item ranges −2..+2; summing gives [−max..+max]; map to 0..100
  return pct;
}

export function scoreAnswersV2(ans: AnswersV2) {
  let raw: Record<Pillar, number> = { habits: 0, confidence: 0, resilience: 0, inclusion: 0 };
  let maxBy: Record<Pillar, number> = { habits: 0, confidence: 0, resilience: 0, inclusion: 0 };

  questions_v2.forEach(q => {
    const a = ans[q.id];
    if (a === undefined || Number.isNaN(a)) return;

    if (q.kind === "choice") {
      const idx = typeof a === "number" ? a : undefined;
      const opt = idx !== undefined ? q.options[idx] : undefined;
      if (!opt) return;

      const maxima: Partial<Record<Pillar, number>> = {};
      q.options.forEach(option => {
        (Object.entries(option.w) as [Pillar, number][]).forEach(([pillar, weight]) => {
          const cap = Math.abs(weight);
          maxima[pillar] = Math.max(maxima[pillar] ?? 0, cap);
        });
      });

      (Object.entries(maxima) as [Pillar, number][]).forEach(([pillar, cap]) => {
        if (cap > 0) {
          maxBy[pillar] += cap;
        }
      });

      (Object.entries(opt.w) as [Pillar, number][]).forEach(([pillar, weight]) => {
        raw[pillar] += weight;
      });
    } else {
      const bucket = typeof a === "number" ? a : 2; // default middle
      const map = q.map ?? SLIDER_MAP;
      const idx = Math.max(0, Math.min(4, bucket));
      const v = map[idx] ?? 0;
      const cap = map.reduce((m, val) => Math.max(m, Math.abs(val)), 0) || 2;
      maxBy[q.pillar] += cap;
      raw[q.pillar] += v;
    }
  });

  const norm: Record<Pillar, number> = {
    habits: normalizePillarScore(raw.habits, maxBy.habits),
    confidence: normalizePillarScore(raw.confidence, maxBy.confidence),
    resilience: normalizePillarScore(raw.resilience, maxBy.resilience),
    inclusion: normalizePillarScore(raw.inclusion, maxBy.inclusion),
  };

  const summary = (Object.keys(norm) as Pillar[]).reduce(
    (acc, pillar) => {
      if (maxBy[pillar] > 0) {
        acc.sum += norm[pillar];
        acc.count += 1;
      }
      return acc;
    },
    { sum: 0, count: 0 }
  );

  const overall = summary.count > 0 ? Math.round(summary.sum / summary.count) : 0;

  return { raw, maxBy, norm, overall };
}

export type PersonaKey =
  | "secure_navigator"
  | "cautious_builder"
  | "strained_juggler"
  | "overwhelmed_survivor"
  | "optimistic_starter"
  | "skeptical_independent";

export function personaFrom(norm: Record<Pillar, number>): PersonaKey {
  const { habits, confidence, resilience, inclusion } = norm;

  const solid = (x: number) => x >= 70;
  const low = (x: number) => x < 40;

  // 1) Secure Navigator
  if (solid(habits) && solid(resilience) && solid(confidence)) return "secure_navigator";

  // 2) Overwhelmed Survivor
  if (low(confidence) && low(resilience)) return "overwhelmed_survivor";

  // 3) Skeptical Independent
  if (inclusion < 50) return "skeptical_independent";

  // 4) Strained Juggler
  if (habits < 65 && resilience < 55) return "strained_juggler";

  // 5) Optimistic Starter
  if (confidence >= 60 && resilience >= 40 && habits >= 40 && habits < 75) return "optimistic_starter";

  // 6) Cautious Builder (fallback growth persona)
  return "cautious_builder";
}

export const personaCopy: Record<PersonaKey, { title_en: string; title_es: string; blurb_en: string; blurb_es: string }> = {
  secure_navigator: {
    title_en: "Secure Navigator",
    title_es: "Navegante Seguro",
    blurb_en: "Your systems are working. Let’s focus on growth and milestones.",
    blurb_es: "Tus sistemas funcionan. Enfoquémonos en el crecimiento y los logros."
  },
  cautious_builder: {
    title_en: "Cautious Builder",
    title_es: "Constructor Prudente",
    blurb_en: "You’re building good habits. A few simple systems will speed you up.",
    blurb_es: "Estás formando buenos hábitos. Unos sistemas sencillos te impulsarán más rápido."
  },
  strained_juggler: {
    title_en: "Strained Juggler",
    title_es: "Malabarista bajo presión",
    blurb_en: "Cash flow is tight. We’ll steady the month and reduce stress quickly.",
    blurb_es: "El flujo de efectivo es ajustado. Estabilizaremos el mes y reduciremos el estrés rápidamente."
  },
  overwhelmed_survivor: {
    title_en: "Overwhelmed Survivor",
    title_es: "Sobreviviente Abrumado",
    blurb_en: "You deserve a no-judgment plan. Tiny, clear steps will help first.",
    blurb_es: "Mereces un plan sin juicios. Pequeños pasos claros te ayudarán primero."
  },
  optimistic_starter: {
    title_en: "Optimistic Starter",
    title_es: "Principiante Optimista",
    blurb_en: "You’re ready to grow. Let’s set goals and build smart credit.",
    blurb_es: "Estás listo para crecer. Definamos metas y construyamos crédito inteligente."
  },
  skeptical_independent: {
    title_en: "Skeptical Independent",
    title_es: "Independiente Escéptico",
    blurb_en: "Transparency first. We’ll make fees, access, and options crystal clear.",
    blurb_es: "Transparencia ante todo. Haremos que las comisiones, el acceso y las opciones sean clarísimas."
  }
};

export function labelFor(pct: number) { return LABELS.buckets(pct); }
