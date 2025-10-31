/**
 * Friendly personas (bilingual) with non-judgmental tone.
 * Exports:
 *   - getPersona(buckets)
 *   - personaCopy (localized content by persona key)
 */
import type { BucketKey5 } from "./assessment";

export type Locale = "en" | "es";
export type Localized<T> = { en: T; es: T };
export type Pillar = "habits" | "confidence" | "stability" | "access" | "resilience";

export type PersonaKey =
  | "rebuilder"
  | "starter"
  | "progress"
  | "on_track"
  | "empowered";

type PersonaCopy = {
  icon: string;
  title: Localized<string>;
  subtitle: Localized<string>;
  about: Localized<string>;
  focus: Localized<string[]>;
  // ADD this field so plan.tsx can render a 30-day action checklist
  plan30day: Localized<string[]>;
};

export type BucketsArg = Record<Pillar, BucketKey5>;

const rankOrder: Record<BucketKey5, number> = {
  building: 1,
  getting_started: 2,
  progress: 3,
  on_track: 4,
  empowered: 5,
};

// Deterministic pick by the lowest-ranked bucket across pillars.
export function getPersona(b: BucketsArg): PersonaKey {
  const stages = Object.values(b) as BucketKey5[];
  const weakestStage = stages.reduce((lowest, current) =>
    rankOrder[current] < rankOrder[lowest] ? current : lowest
  );

  switch (weakestStage) {
    case "building":
      return "rebuilder";
    case "getting_started":
      return "starter";
    case "progress":
      return "progress";
    case "on_track":
      return "on_track";
    case "empowered":
    default:
      return "empowered";
  }
}

export const personaCopy: Record<PersonaKey, PersonaCopy> = {
  rebuilder: {
    icon: "🧱",
    title: {
      en: "Rebuilder",
      es: "Reconstruyendo",
    },
    subtitle: {
      en: "Start small, reduce stress, rebuild your footing.",
      es: "Comienza en pequeño, reduce el estrés y recupera estabilidad.",
    },
    about: {
      en: "You’re facing real pressure. We’ll focus on small wins and stability first—clear bills, stop late fees, and open space to breathe.",
      es: "Enfrentas presión real. Nos enfocaremos en victorias pequeñas y en la estabilidad: pagar cuentas, evitar recargos y ganar espacio para respirar.",
    },
    focus: {
      en: [
        "Stop late fees and overdrafts",
        "Stabilize essential bills",
        "Build a tiny buffer",
      ],
      es: [
        "Detener recargos y sobregiros",
        "Estabilizar gastos esenciales",
        "Crear un pequeño colchón",
      ],
    },
    plan30day: {
      en: [
        "Day 1–3: List essential bills and due dates; set calendar reminders.",
        "Day 4–7: Call one creditor to ask about hardship/fee reversal options.",
        "Day 8–10: Open a no-fee savings and auto-transfer $5–$20 per payday.",
        "Day 11–20: Switch at least one bill to autopay with a safe date.",
        "Day 21–30: Build a $50–$200 buffer and celebrate each deposit.",
      ],
      es: [
        "Día 1–3: Lista de gastos esenciales y fechas; pon recordatorios.",
        "Día 4–7: Llama a un acreedor y pregunta por opciones de apoyo/reverso de cargos.",
        "Día 8–10: Abre un ahorro sin comisiones y transfiere $5–$20 por nómina.",
        "Día 11–20: Pasa una factura a pago automático en una fecha segura.",
        "Día 21–30: Construye un colchón de $50–$200 y celebra cada depósito.",
      ],
    },
  },

  starter: {
    icon: "🌱",
    title: {
      en: "Getting Started",
      es: "Comenzando",
    },
    subtitle: {
      en: "Build a simple system that actually sticks.",
      es: "Crea un sistema simple que realmente se mantenga.",
    },
    about: {
      en: "You’re ready to build habits. We’ll create a simple plan for cash flow, bills, and a beginner emergency fund.",
      es: "Estás listo para crear hábitos. Haremos un plan simple para el flujo de efectivo, pagos y un fondo de emergencia inicial.",
    },
    focus: {
      en: [
        "Track cash flow weekly",
        "Automate essentials",
        "Start a $500–$1,000 emergency fund",
      ],
      es: [
        "Seguimiento semanal del flujo de efectivo",
        "Automatiza lo esencial",
        "Fondo de emergencia de $500–$1,000",
      ],
    },
    plan30day: {
      en: [
        "Week 1: Set up a weekly 15-minute money check-in.",
        "Week 1–2: Automate rent/utilities and minimum debt payments.",
        "Week 2–3: Route tax refunds or side income into emergency savings.",
        "Week 3–4: Build to your first $500 emergency target.",
      ],
      es: [
        "Semana 1: Programa una revisión semanal de 15 minutos.",
        "Semana 1–2: Automatiza renta/servicios y pagos mínimos de deuda.",
        "Semana 2–3: Envía devoluciones de impuestos o extras al ahorro de emergencia.",
        "Semana 3–4: Llega a los primeros $500 de tu meta de emergencia.",
      ],
    },
  },

  progress: {
    icon: "⚙️",
    title: {
      en: "In Progress",
      es: "En Progreso",
    },
    subtitle: {
      en: "Tighten the system and accelerate your wins.",
      es: "Ajusta el sistema y acelera tus logros.",
    },
    about: {
      en: "You’ve got momentum. We’ll optimize debt strategy, savings automation, and your guardrails.",
      es: "Tienes impulso. Optimizaremos la estrategia de deudas, el ahorro automático y tus reglas de protección.",
    },
    focus: {
      en: [
        "Pick a clear debt method (Snowball or Avalanche)",
        "Raise auto-savings rate",
        "Add guardrails for impulse spend",
      ],
      es: [
        "Elige un método de deuda (Bola de Nieve o Avalancha)",
        "Aumenta el ahorro automático",
        "Crea límites contra gastos impulsivos",
      ],
    },
    plan30day: {
      en: [
        "Days 1–5: Choose Snowball vs. Avalanche; write the exact order.",
        "Days 6–10: Increase auto-savings by 1–3%.",
        "Days 11–20: Introduce a 24-hour pause rule on non-essentials.",
        "Days 21–30: Make one extra principal payment on your priority debt.",
      ],
      es: [
        "Días 1–5: Elige Bola de Nieve o Avalancha; define el orden exacto.",
        "Días 6–10: Sube el ahorro automático 1–3%.",
        "Días 11–20: Aplica la regla de 24 horas en gastos no esenciales.",
        "Días 21–30: Haz un pago extra a capital en tu deuda prioritaria.",
      ],
    },
  },

  on_track: {
    icon: "🚀",
    title: {
      en: "On Track",
      es: "En Buen Camino",
    },
    subtitle: {
      en: "Scale up: protect, grow, and simplify.",
      es: "Escala: protege, crece y simplifica.",
    },
    about: {
      en: "You’re consistent. Now we’ll expand your safety net, automate growth, and simplify accounts.",
      es: "Eres constante. Ampliaremos tu red de seguridad, automatizaremos el crecimiento y simplificaremos cuentas.",
    },
    focus: {
      en: [
        "3–6 months emergency fund",
        "Automate retirement & sinking funds",
        "Optimize account structure",
      ],
      es: [
        "Fondo de emergencia de 3–6 meses",
        "Automatiza retiro y fondos por objetivo",
        "Optimiza tu estructura de cuentas",
      ],
    },
    plan30day: {
      en: [
        "Week 1: Map sinking funds (car, medical, travel) and set auto-transfers.",
        "Week 2: Increase retirement contribution 1–2%.",
        "Week 3: Consolidate or close unused accounts/cards.",
        "Week 4: Rebalance goals and set quarterly reviews.",
      ],
      es: [
        "Semana 1: Define fondos por objetivo y programa transferencias.",
        "Semana 2: Sube 1–2% tu aporte a retiro.",
        "Semana 3: Consolida o cierra cuentas/tarjetas que no uses.",
        "Semana 4: Reajusta metas y define revisiones trimestrales.",
      ],
    },
  },

  empowered: {
    icon: "🌟",
    title: {
      en: "Empowered",
      es: "Empoderado",
    },
    subtitle: {
      en: "Mentor your money and make it serve your life.",
      es: "Haz que tu dinero sirva a tu vida y guía a otros.",
    },
    about: {
      en: "Systems are humming. We’ll refine investing strategy, risk protection, and legacy moves.",
      es: "Tus sistemas funcionan. Refinaremos la inversión, la protección de riesgos y el legado.",
    },
    focus: {
      en: [
        "Goal-based investing tune-up",
        "Insurance & identity safeguards",
        "Legacy/estate foundations",
      ],
      es: [
        "Ajuste de inversión por metas",
        "Seguros y protección de identidad",
        "Bases de legado/sucesión",
      ],
    },
    plan30day: {
      en: [
        "Days 1–7: Review allocation vs. goals; rebalance if needed.",
        "Days 8–14: Audit insurance, beneficiaries, and credit freeze.",
        "Days 15–21: Draft/update simple estate docs and passwords plan.",
        "Days 22–30: Mentor someone: teach your system in one page.",
      ],
      es: [
        "Días 1–7: Revisa tu asignación vs. metas; rebalancea si se requiere.",
        "Días 8–14: Audita seguros, beneficiarios y congelación de crédito.",
        "Días 15–21: Redacta/actualiza documentos básicos y plan de contraseñas.",
        "Días 22–30: Mentorea a alguien: enseña tu sistema en una página.",
      ],
    },
  },
};
