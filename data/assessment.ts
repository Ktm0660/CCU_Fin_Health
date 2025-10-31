/* Five-pillar assessment: Habits, Confidence, Stability, Trust & Access, Resilience */
export const BUCKETS5 = [
  "building",
  "getting_started",
  "progress",
  "on_track",
  "empowered",
] as const;

export type BucketKey5 = typeof BUCKETS5[number];

export const rankOrder5: Record<BucketKey5, number> = {
  building: 1,
  getting_started: 2,
  progress: 3,
  on_track: 4,
  empowered: 5,
};

export type Pillar = "habits" | "confidence" | "stability" | "trust" | "resilience";

export type Option = {
  text_en: string;
  text_es: string; // temporary: mirrors EN until translated
  weights: Partial<Record<Pillar, number>>; // each answer contributes 0..3 to one or more pillars
};

export type Question = {
  id: string;
  pillar: Pillar;
  text_en: string;
  text_es: string; // temporary: mirrors EN until translated
  options: Option[]; // 4 options (A..D), scored 3/2/1/0
};

// helper to build options quickly
const o = (en: string, es: string, w: Partial<Record<Pillar, number>>) => ({
  text_en: en, text_es: es || en, weights: w
});

// ==== QUESTIONS (22) ====
// NOTE: text_es mirrors English for now; translators can fill later.
export const questionsBase: Question[] = [
  // HABITS (Q1-Q5)
  {
    id: "q1",
    pillar: "habits",
    text_en: "When you get paid, what happens next?",
    text_es: "Cuando te pagan, ¿qué sucede después?",
    options: [
      o("I move some to savings automatically.", "", { habits: 3 }),
      o("I pay bills first, then decide what’s left.", "", { habits: 2 }),
      o("I mostly cover basics—there’s little left over.", "", { habits: 1 }),
      o("I live paycheck to paycheck and just try to make it to the next one.", "", { habits: 0 })
    ]
  },
  {
    id: "q2",
    pillar: "habits",
    text_en: "How often do you look at where your money actually goes?",
    text_es: "¿Con qué frecuencia miras a dónde va realmente tu dinero?",
    options: [
      o("Daily or weekly.", "", { habits: 3 }),
      o("A few times a month.", "", { habits: 2 }),
      o("Rarely.", "", { habits: 1 }),
      o("Almost never—it’s stressful.", "", { habits: 0 })
    ]
  },
  {
    id: "q3",
    pillar: "habits",
    text_en: "When you shop or spend, how much do you plan ahead?",
    text_es: "Cuando compras o gastas, ¿cuánto planeas de antemano?",
    options: [
      o("I budget before I go.", "", { habits: 3 }),
      o("I try to stay mindful.", "", { habits: 2 }),
      o("I buy what seems needed.", "", { habits: 1 }),
      o("I often spend without realizing how much.", "", { habits: 0 })
    ]
  },
  {
    id: "q4",
    pillar: "habits",
    text_en: "When it comes to debt, which sounds most like you?",
    text_es: "En cuanto a tus deudas, ¿cuál te representa mejor?",
    options: [
      o("I manage and pay on time.", "", { habits: 3 }),
      o("I’m keeping up but it’s tight.", "", { habits: 2 }),
      o("I sometimes miss payments.", "", { habits: 1 }),
      o("I feel stuck or overwhelmed by debt.", "", { habits: 0 })
    ]
  },
  {
    id: "q5",
    pillar: "habits",
    text_en: "When you think about borrowing or taking on new debt, what best describes you?",
    text_es: "Cuando piensas en endeudarte o tomar un nuevo préstamo, ¿qué te describe mejor?",
    options: [
      o("I borrow only when it’s strategic and affordable.", "", { habits: 3 }),
      o("I take loans occasionally when needed.", "", { habits: 2 }),
      o("I’ve added new debt recently to cover expenses.", "", { habits: 1 }),
      o("I often rely on new loans or credit to stay afloat.", "", { habits: 0 })
    ]
  },

  // CONFIDENCE (Q6-Q9)
  {
    id: "q6",
    pillar: "confidence",
    text_en: "When money topics come up—interest, credit, loans—how do you feel?",
    text_es: "Cuando surgen temas de dinero—intereses, crédito, préstamos—¿cómo te sientes?",
    options: [
      o("I can explain them to others.", "", { confidence: 3 }),
      o("I generally understand.", "", { confidence: 2 }),
      o("I hear the words but don’t fully get them.", "", { confidence: 1 }),
      o("I usually tune out—it’s confusing.", "", { confidence: 0 })
    ]
  },
  {
    id: "q7",
    pillar: "confidence",
    text_en: "How well do you understand what affects your credit score (FICO)?",
    text_es: "¿Qué tan bien entiendes qué afecta tu puntaje de crédito (FICO)?",
    options: [
      o("Very well—I monitor it regularly.", "", { confidence: 3 }),
      o("I know the basics.", "", { confidence: 2 }),
      o("I’ve heard of it but not sure how it works.", "", { confidence: 1 }),
      o("I don’t know my score or what impacts it.", "", { confidence: 0 })
    ]
  },
  {
    id: "q8",
    pillar: "confidence",
    text_en: "If your credit union offered free financial coaching, you would…",
    text_es: "Si tu cooperativa ofreciera asesoría financiera gratuita, tú…",
    options: [
      o("Be excited to learn.", "", { confidence: 3 }),
      o("Join if the timing worked.", "", { confidence: 2 }),
      o("Want to, but worry about being judged.", "", { confidence: 1 }),
      o("Avoid it—I’d feel uncomfortable.", "", { confidence: 0 })
    ]
  },
  {
    id: "q9",
    pillar: "confidence",
    text_en: "When you make a big financial choice, what do you rely on most?",
    text_es: "Al tomar una gran decisión financiera, ¿en qué te basas más?",
    options: [
      o("Facts and research.", "", { confidence: 3 }),
      o("Advice from people I trust.", "", { confidence: 2 }),
      o("My gut feeling.", "", { confidence: 1 }),
      o("I usually put it off.", "", { confidence: 0 })
    ]
  },

  // STABILITY (Q10-Q13)
  {
    id: "q10",
    pillar: "stability",
    text_en: "If your income stopped, how long could you cover essentials?",
    text_es: "Si tus ingresos se detuvieran, ¿cuánto tiempo cubrirías lo esencial?",
    options: [
      o("3+ months.", "", { stability: 3 }),
      o("1–2 months.", "", { stability: 2 }),
      o("A few weeks.", "", { stability: 1 }),
      o("I’m living paycheck to paycheck already.", "", { stability: 0 })
    ]
  },
  {
    id: "q11",
    pillar: "stability",
    text_en: "When an unexpected expense hits—like a car repair—what’s your first move?",
    text_es: "Cuando surge un gasto inesperado—como reparar el auto—¿cuál es tu primera acción?",
    options: [
      o("Pay with savings or cash.", "", { stability: 3 }),
      o("Use a credit card and pay it off soon.", "", { stability: 2 }),
      o("Borrow or delay another bill.", "", { stability: 1 }),
      o("Panic first, plan later.", "", { stability: 0 })
    ]
  },
  {
    id: "q12",
    pillar: "stability",
    text_en: "How steady does your income feel month to month?",
    text_es: "¿Qué tan estables son tus ingresos mes a mes?",
    options: [
      o("Very steady.", "", { stability: 3 }),
      o("Mostly steady with some fluctuation.", "", { stability: 2 }),
      o("Often unpredictable.", "", { stability: 1 }),
      o("Highly unstable.", "", { stability: 0 })
    ]
  },
  {
    id: "q13",
    pillar: "stability",
    text_en: "How often does money stress follow you through the day?",
    text_es: "¿Con qué frecuencia el estrés por el dinero te acompaña durante el día?",
    options: [
      o("Rarely.", "", { stability: 3 }),
      o("Sometimes.", "", { stability: 2 }),
      o("Most days.", "", { stability: 1 }),
      o("Almost always.", "", { stability: 0 })
    ]
  },

  // TRUST & ACCESS (Q14-Q17)
  {
    id: "q14",
    pillar: "trust",
    text_en: "When you walk into a bank or credit union, how do you usually feel?",
    text_es: "Cuando entras a un banco o cooperativa, ¿cómo te sientes normalmente?",
    options: [
      o("Relaxed—they’re here to help.", "", { trust: 3 }),
      o("Neutral—it depends on who’s there.", "", { trust: 2 }),
      o("A little anxious.", "", { trust: 1 }),
      o("I try to avoid going at all.", "", { trust: 0 })
    ]
  },
  {
    id: "q15",
    pillar: "trust",
    text_en: "How fair do financial institutions feel to you?",
    text_es: "¿Qué tan justas te parecen las instituciones financieras?",
    options: [
      o("Very fair—they give people chances.", "", { trust: 3 }),
      o("Mostly fair.", "", { trust: 2 }),
      o("Depends on who you are.", "", { trust: 1 }),
      o("Not fair—I feel judged or excluded.", "", { trust: 0 })
    ]
  },
  {
    id: "q16",
    pillar: "trust",
    text_en: "What keeps you from asking for financial help?",
    text_es: "¿Qué te impide pedir ayuda financiera?",
    options: [
      o("Nothing—I feel comfortable asking.", "", { trust: 3 }),
      o("I don’t know where to start.", "", { trust: 2 }),
      o("I worry they won’t understand me.", "", { trust: 1 }),
      o("I’m scared of being judged.", "", { trust: 0 })
    ]
  },
  {
    id: "q17",
    pillar: "trust",
    text_en: "If someone from a credit union offered help improving your finances, you would…",
    text_es: "Si alguien de una cooperativa ofreciera ayuda para mejorar tus finanzas, tú…",
    options: [
      o("Appreciate it and listen.", "", { trust: 3 }),
      o("Think about it first.", "", { trust: 2 }),
      o("Worry it’s a sales pitch.", "", { trust: 1 }),
      o("Feel too nervous to talk about it.", "", { trust: 0 })
    ]
  },

  // RESILIENCE (Q18-Q22)
  {
    id: "q18",
    pillar: "resilience",
    text_en: "When things go wrong financially, how do you usually respond?",
    text_es: "Cuando algo sale mal con tu dinero, ¿cómo respondes normalmente?",
    options: [
      o("I regroup fast and make a plan.", "", { resilience: 3 }),
      o("I stress, but figure it out eventually.", "", { resilience: 2 }),
      o("I freeze up for a while.", "", { resilience: 1 }),
      o("I try not to think about it.", "", { resilience: 0 })
    ]
  },
  {
    id: "q19",
    pillar: "resilience",
    text_en: "How clear are your goals for the next year?",
    text_es: "¿Qué tan claras están tus metas para el próximo año?",
    options: [
      o("Very clear—I have a plan.", "", { resilience: 3 }),
      o("I have some goals but no plan yet.", "", { resilience: 2 }),
      o("Thinking about goals but unsure where to start.", "", { resilience: 1 }),
      o("I’m just trying to get by day to day.", "", { resilience: 0 })
    ]
  },
  {
    id: "q20",
    pillar: "resilience",
    text_en: "If you set a financial goal, how likely are you to stick with it when life gets hard?",
    text_es: "Si te pones una meta financiera, ¿qué tan probable es que la mantengas cuando se complica?",
    options: [
      o("Very likely.", "", { resilience: 3 }),
      o("Usually, but I sometimes lose momentum.", "", { resilience: 2 }),
      o("I struggle to stay consistent.", "", { resilience: 1 }),
      o("I give up easily or forget about it.", "", { resilience: 0 })
    ]
  },
  {
    id: "q21",
    pillar: "resilience",
    text_en: "When you think about your financial future, what emotion shows up first?",
    text_es: "Cuando piensas en tu futuro financiero, ¿qué emoción aparece primero?",
    options: [
      o("Hopeful.", "", { resilience: 3 }),
      o("Cautiously optimistic.", "", { resilience: 2 }),
      o("Unsure.", "", { resilience: 1 }),
      o("Overwhelmed.", "", { resilience: 0 })
    ]
  },
  {
    id: "q22",
    pillar: "resilience",
    text_en: "How often do you celebrate small financial wins (like paying off a card or saving extra)?",
    text_es: "¿Con qué frecuencia celebras pequeños logros financieros (pagar una tarjeta, ahorrar un extra)?",
    options: [
      o("Regularly—it keeps me motivated.", "", { resilience: 3 }),
      o("Sometimes, if I remember.", "", { resilience: 2 }),
      o("Rarely.", "", { resilience: 1 }),
      o("Never thought about it.", "", { resilience: 0 })
    ]
  }
];

// --- Randomization helpers (stable per render) ---
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Returns a deep copy with options randomized per question and questions randomized overall.
export function getRandomizedQuestions(): Question[] {
  const q = questionsBase.map(q => ({
    ...q,
    options: shuffle(q.options)
  }));
  return shuffle(q);
}

// --- Scoring ---
export type AnswerMap = Record<string, number>; // questionId -> chosen option index (against randomized options)

export type PillarScores = Record<Pillar, number>;
export type PillarMax = Record<Pillar, number>;

export type Score = {
  byPillar: PillarScores;
  maxByPillar: PillarMax;
  total: number;
  totalMax: number;
};

function perDimMax(questions: Question[]): PillarMax {
  const max: PillarMax = { habits: 0, confidence: 0, stability: 0, trust: 0, resilience: 0 };
  questions.forEach(q => {
    // highest possible contribution for that pillar in this question
    const m = Math.max(...q.options.map(o => (o.weights[q.pillar] ?? 0)));
    max[q.pillar] += m;
  });
  return max;
}

function computeScore(questions: Question[], answers: AnswerMap): Score {
  const by: PillarScores = { habits: 0, confidence: 0, stability: 0, trust: 0, resilience: 0 };
  questions.forEach(q => {
    const idx = answers[q.id];
    if (idx !== undefined) {
      const w = q.options[idx]?.weights ?? {};
      (Object.keys(w) as Pillar[]).forEach(p => { by[p] += w[p] ?? 0; });
    }
  });
  const maxBy = perDimMax(questions);
  const total = (Object.keys(by) as Pillar[]).reduce((s, p) => s + by[p], 0);
  const totalMax = (Object.keys(maxBy) as Pillar[]).reduce((s, p) => s + maxBy[p], 0);
  return { byPillar: by, maxByPillar: maxBy, total, totalMax };
}

export function scoreAnswers(answers: AnswerMap): Score;
export function scoreAnswers(questions: Question[], answers: AnswerMap): Score;
export function scoreAnswers(arg1: Question[] | AnswerMap, arg2?: AnswerMap): Score {
  if (Array.isArray(arg1)) {
    return computeScore(arg1, arg2 ?? {});
  }
  return computeScore(questionsBase, arg1 ?? {});
}

export function normalize0to100(value: number, max: number) {
  return Math.round((value / Math.max(1, max)) * 100);
}

export type BucketizedScore = { key: BucketKey5; pct: number; rank: number };

export function bucketize5(score: Score): BucketizedScore;
export function bucketize5(pct: number): BucketKey5;
export function bucketize5(input: number | Score): BucketKey5 | BucketizedScore {
  const pct = typeof input === "number" ? input : (input.total / Math.max(1, input.totalMax));
  let key: BucketKey5;
  if (pct >= 0.8) key = "empowered";
  else if (pct >= 0.6) key = "on_track";
  else if (pct >= 0.4) key = "progress";
  else if (pct >= 0.2) key = "getting_started";
  else key = "building";

  if (typeof input === "number") return key;
  return { key, pct, rank: rankOrder5[key] };
}

type Lang = "en" | "es";
type BucketContent = {
  title: string;
  summary: string;
  strengths: string[];
  focus: string[];
  tips: string[];
};

export const bucketCopy: Record<BucketKey5, Record<Lang, BucketContent>> = {
  building: {
    en: {
      title: "Finding your footing",
      summary:
        "Money is tight right now. We’ll steady essentials, reduce surprises, and build a small safety buffer so you can breathe.",
      strengths: [
        "You’re showing up and asking for clarity instead of guessing.",
        "You juggle competing essentials every month—so you already know where the pain points are.",
      ],
      focus: [
        "Protect housing, food, and transportation first.",
        "Automate or set reminders for one or two critical bills.",
        "Start the tiniest possible emergency cushion ($10–$25 per payday).",
      ],
      tips: [
        "List one community support (family, church, CU coach) you can call if income is delayed.",
        "Use a simple weekly list: needs, must-pay bills, and urgent goals.",
        "Move surprise money (rebates, refunds) straight into a labeled savings pocket.",
      ],
    },
    es: {
      title: "Buscando estabilidad",
      summary:
        "El dinero está muy ajustado. Vamos a estabilizar lo esencial, reducir sorpresas y crear un pequeño colchón para que respires mejor.",
      strengths: [
        "Das el paso de pedir claridad en lugar de adivinar.",
        "Cada mes equilibras gastos esenciales, así que sabes dónde duele más.",
      ],
      focus: [
        "Protege primero vivienda, comida y transporte.",
        "Automatiza o pon recordatorios para una o dos cuentas críticas.",
        "Empieza el colchón más pequeño posible ($10–$25 por pago).",
      ],
      tips: [
        "Anota un apoyo comunitario (familia, iglesia, asesor) al que puedas llamar si el ingreso se retrasa.",
        "Usa una lista semanal simple: necesidades, cuentas obligatorias y metas urgentes.",
        "Envía dinero sorpresa (reembolsos, devoluciones) directo a un ahorro con nombre.",
      ],
    },
  },
  getting_started: {
    en: {
      title: "Building momentum",
      summary:
        "Pieces are coming together. We’ll lock in steady bill habits, strengthen confidence, and grow a starter buffer.",
      strengths: [
        "You already track key bills and know when they hit.",
        "You’re willing to try new systems when they’re simple and judgment-free.",
      ],
      focus: [
        "Create one dashboard or list for upcoming bills and paydays.",
        "Practice one confident money conversation this month.",
        "Grow savings to cover one surprise expense (around $150–$300).",
      ],
      tips: [
        "Turn on balance or large-purchase alerts.",
        "Schedule a 15-minute weekly money check-in.",
        "Bundle due dates where possible so you only touch bills a few times each month.",
      ],
    },
    es: {
      title: "Tomando impulso",
      summary:
        "Las piezas se están uniendo. Aseguraremos hábitos con las cuentas, ganaremos confianza y haremos crecer un colchón inicial.",
      strengths: [
        "Ya controlas las cuentas principales y sabes cuándo vencen.",
        "Estás dispuesto a probar sistemas nuevos cuando son simples y sin juicios.",
      ],
      focus: [
        "Crea un listado o panel con las próximas cuentas y días de pago.",
        "Practica una conversación sobre dinero con confianza este mes.",
        "Aumenta el ahorro para cubrir un gasto sorpresa (entre $150 y $300).",
      ],
      tips: [
        "Activa alertas de saldo o de compras grandes.",
        "Programa una revisión semanal de 15 minutos.",
        "Agrupa fechas de pago cuando se pueda para manejar cuentas solo unas cuantas veces al mes.",
      ],
    },
  },
  progress: {
    en: {
      title: "Making steady progress",
      summary:
        "Habits are forming. We’ll fine-tune automation, protect momentum, and keep growing confidence in your plan.",
      strengths: [
        "You’ve already built repeatable routines.",
        "You review your accounts enough to catch issues early.",
      ],
      focus: [
        "Automate key transfers (savings, debt pay-down) where possible.",
        "Stress-test the budget for one larger surprise expense.",
        "Document your system so it’s easy to stay consistent.",
      ],
      tips: [
        "Name specific saving goals (car repairs, medical, holidays).",
        "Use a single sheet or app to track wins each month.",
        "Share your approach with someone you trust for extra accountability.",
      ],
    },
    es: {
      title: "Progreso constante",
      summary:
        "Los hábitos ya están tomando forma. Vamos a afinar la automatización, proteger el ritmo y mantener la confianza en tu plan.",
      strengths: [
        "Ya tienes rutinas repetibles.",
        "Revisas tus cuentas lo suficiente para detectar problemas temprano.",
      ],
      focus: [
        "Automatiza transferencias clave (ahorro, pago de deudas) cuando sea posible.",
        "Pon a prueba tu presupuesto ante un gasto grande inesperado.",
        "Documenta tu sistema para mantener la consistencia.",
      ],
      tips: [
        "Nombra metas de ahorro específicas (auto, médico, fiestas).",
        "Usa una hoja o app para anotar logros cada mes.",
        "Comparte tu método con alguien de confianza para más responsabilidad.",
      ],
    },
  },
  on_track: {
    en: {
      title: "On track and growing",
      summary:
        "You’re in a solid rhythm. We’ll reinforce systems, grow buffers, and plan for upcoming milestones.",
      strengths: [
        "Your bills and savings flows are predictable.",
        "You make thoughtful money decisions with information, not guesswork.",
      ],
      focus: [
        "Expand your emergency fund toward 1–3 months of essentials.",
        "Review insurance, fees, and rates to make sure they still fit.",
        "Set medium-term goals (car, education, home repairs) with timelines.",
      ],
      tips: [
        "Schedule quarterly financial reviews on your calendar.",
        "Automate contributions to sinking funds and retirement.",
        "Check in with a coach or advisor yearly to stay proactive.",
      ],
    },
    es: {
      title: "En camino y creciendo",
      summary:
        "Tienes un ritmo sólido. Vamos a reforzar sistemas, ampliar colchones y planear los próximos hitos.",
      strengths: [
        "Tus flujos de cuentas y ahorros son predecibles.",
        "Tomas decisiones informadas, no a base de suposiciones.",
      ],
      focus: [
        "Expande tu fondo de emergencia hacia 1–3 meses de gastos esenciales.",
        "Revisa seguros, comisiones y tasas para confirmar que siguen funcionando.",
        "Define metas de mediano plazo (auto, educación, reparaciones) con fechas.",
      ],
      tips: [
        "Agenda revisiones financieras trimestrales.",
        "Automatiza aportes a fondos de reserva y retiro.",
        "Habla con un asesor o coach cada año para mantenerte proactivo.",
      ],
    },
  },
  empowered: {
    en: {
      title: "Ready to optimize",
      summary:
        "You have a strong foundation. Now it’s about optimizing, cutting friction, and aligning money with long-term goals.",
      strengths: [
        "You already plan ahead and review results regularly.",
        "You’re comfortable teaching others what has worked for you.",
      ],
      focus: [
        "Fine-tune investments, insurance, and tax strategies.",
        "Identify hidden costs or leaks and redirect them toward goals.",
        "Mentor others or involve family so the system stays resilient.",
      ],
      tips: [
        "Automate charitable giving or community contributions.",
        "Review credit and loan products annually for better terms.",
        "Set ambitious 6–12 month milestones and break them into monthly moves.",
      ],
    },
    es: {
      title: "Listo para optimizar",
      summary:
        "Tienes una base fuerte. Ahora toca optimizar, reducir fricción y alinear el dinero con metas de largo plazo.",
      strengths: [
        "Ya planeas con anticipación y revisas resultados con frecuencia.",
        "Te sientes cómodo enseñando a otros lo que te funciona.",
      ],
      focus: [
        "Ajusta inversiones, seguros y estrategias fiscales.",
        "Detecta costos ocultos o fugas y redirígelos a tus metas.",
        "Guía a otros o involucra a la familia para que el sistema sea resistente.",
      ],
      tips: [
        "Automatiza donaciones o aportes comunitarios.",
        "Revisa productos de crédito y préstamos cada año para mejorar condiciones.",
        "Define metas ambiciosas de 6–12 meses y divídelas en pasos mensuales.",
      ],
    },
  },
};

// ---------- Legacy compatibility aliases (for older modules) ----------
export type Bucket5 = BucketKey5;        // matches `import type { Bucket5 } from "./assessment"`
export type BucketKey = BucketKey5;      // in case something imported BucketKey
export const bucketize = bucketize5;     // in case something imported bucketize
// ---------------------------------------------------------------------
