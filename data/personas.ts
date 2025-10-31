/**
 * Friendly personas (bilingual) with non-judgmental tone.
 * Exports:
 *   - getPersona(buckets)
 *   - personaCopy (localized content by persona key)
 */
import type { BucketKey5 } from "./assessment";

export type Locale = "en" | "es";
export type Pillar = "habits" | "confidence" | "stability" | "access" | "resilience";

export type PersonaKey = "rebuilder" | "starter" | "steadier" | "planner" | "navigator";

export type BucketsArg = Record<Pillar, BucketKey5>;

const rankOrder: Record<BucketKey5, number> = {
  building: 1,
  getting_started: 2,
  progress: 3,
  on_track: 4,
  empowered: 5,
};

// Deterministic pick:
// - Find the two weakest pillars.
// - Map combined pattern to a persona that drives tone + plan.
export function getPersona(b: BucketsArg): PersonaKey {
  const pillars = (Object.keys(b) as Pillar[]).sort(
    (a, c) => rankOrder[b[a]] - rankOrder[b[c]]
  );
  const weakest = pillars.slice(0, 2).sort().join("|");

  switch (weakest) {
    case "access|confidence":
    case "access|habits":
      return "starter";    // building comfort + basic access & routines
    case "habits|stability":
    case "stability|confidence":
      return "rebuilder";  // reduce pressure, tiny wins, stabilize cashflow
    case "resilience|stability":
      return "steadier";   // shockproof systems, buffers, fraud/scam guard
    case "confidence|resilience":
      return "navigator";  // decisions, coaching, ‘talk tracks’, resilience reps
    default:
      return "planner";    // overall on track; optimize plan and goals
  }
}

type Localized<T> = { en: T; es: T };

export const personaCopy: Record<
  PersonaKey,
  {
    icon: string;
    title: Localized<string>;
    subtitle: Localized<string>;
    about: Localized<string>;
    focus: Localized<string[]>;
  }
> = {
  rebuilder: {
    icon: "🧰",
    title: {
      en: "The Rebuilder",
      es: "La/El Reconstructor(a)",
    },
    subtitle: {
      en: "Lower stress first, then steady the basics.",
      es: "Primero baja el estrés, luego estabiliza lo básico.",
    },
    about: {
      en: "You’re carrying real pressure. We’ll stack small wins and rebuild a sense of control.",
      es: "Llevas mucha presión. Sumaremos pequeñas victorias para recuperar el control.",
    },
    focus: {
      en: ["Micro-habits for bills", "Emergency mini-buffer", "Debt options you can trust"],
      es: ["Micro-hábitos de pagos", "Mini-colchón de emergencia", "Opciones de deuda confiables"],
    },
  },
  starter: {
    icon: "🌱",
    title: { en: "The Starter", es: "La/El Principiante" },
    subtitle: {
      en: "Comfort + access unlock your momentum.",
      es: "Comodidad + acceso para activar tu impulso.",
    },
    about: {
      en: "You’re ready to begin with simple steps and a friendly guide at your side.",
      es: "Estás listo para empezar con pasos simples y una guía amigable.",
    },
    focus: {
      en: ["ITIN-friendly accounts", "Avoiding common fees", "Judgment-free confidence boosts"],
      es: ["Cuentas aptas para ITIN", "Evitar cargos comunes", "Confianza sin juicios"],
    },
  },
  steadier: {
    icon: "🛡️",
    title: { en: "The Steadier", es: "La/El Estabilizador(a)" },
    subtitle: {
      en: "Shock-proof your money life.",
      es: "A prueba de choques en tu vida financiera.",
    },
    about: {
      en: "You’re building stability. We’ll strengthen buffers and guard against fraud and surprises.",
      es: "Estás construyendo estabilidad. Fortalezcamos colchones y prepárate contra fraudes y sorpresas.",
    },
    focus: {
      en: ["Rainy-day fund", "Scam defense", "Insurance & income buffers"],
      es: ["Fondo de emergencia", "Defensa ante estafas", "Seguros y respaldo de ingresos"],
    },
  },
  planner: {
    icon: "🧭",
    title: { en: "The Planner", es: "La/El Planificador(a)" },
    subtitle: {
      en: "Tidy systems, clearer goals.",
      es: "Sistemas ordenados, metas claras.",
    },
    about: {
      en: "You’re on track. Let’s align savings, debt strategy, and milestones with what you value.",
      es: "Vas bien. Alineemos ahorro, estrategia de deuda y metas con lo que valoras.",
    },
    focus: {
      en: ["Automations & goals", "Debt payoff strategy", "Milestone planning"],
      es: ["Automatizaciones y metas", "Estrategia de pago de deuda", "Planificación de hitos"],
    },
  },
  navigator: {
    icon: "🎧",
    title: { en: "The Navigator", es: "La/El Navegante" },
    subtitle: {
      en: "Decisions get easier with a co-pilot.",
      es: "Las decisiones son más fáciles con un copiloto.",
    },
    about: {
      en: "You want clarity for tricky choices. We’ll use scripts, checklists, and quick coaching.",
      es: "Buscas claridad para decisiones difíciles. Usaremos guiones, listas y coaching breve.",
    },
    focus: {
      en: ["Decision scripts", "Confidence reps", "Data-backed comparisons"],
      es: ["Guiones para decidir", "Entrenamiento de confianza", "Comparaciones con datos"],
    },
  },
};
