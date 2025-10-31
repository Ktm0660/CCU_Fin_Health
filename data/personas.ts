import type { Bucket5 } from "./assessment";

export type BucketKey5 = Bucket5;

export type PersonaKey =
  | "rebuilder"
  | "stabilizer"
  | "builder"
  | "optimizer";

export type Localized<T> = { en: T; es: T };
const L = <T extends string | string[]>(en: T, es: T): Localized<T> => ({ en, es });

export function getPersona(bucket: BucketKey5): PersonaKey {
  switch (bucket) {
    case "building":
      return "rebuilder";
    case "getting_started":
      return "stabilizer";
    case "progress":
      return "builder";
    case "on_track":
    case "empowered":
      return "optimizer";
    default:
      return "rebuilder";
  }
}

export const personaLabels: Record<PersonaKey, Localized<string>> = {
  rebuilder: L("Rebuilder", "Reconstruyendo"),
  stabilizer: L("Stabilizer", "Estabilizando"),
  builder: L("Builder", "Construyendo"),
  optimizer: L("Optimizer", "Optimizando"),
};

export const personaCopy: Record<
  PersonaKey,
  {
    title: Localized<string>;
    subtitle: Localized<string>;
    about: Localized<string>;
    focus: Localized<string[]>;
    plan30day: Localized<string[]>; // ✅ renamed field
  }
> = {
  rebuilder: {
    title: personaLabels.rebuilder,
    subtitle: L(
      "Small, fast wins to lower stress and regain control.",
      "Pequeñas victorias rápidas para bajar el estrés y recuperar el control."
    ),
    about: L(
      "You’re carrying real pressure. We’ll start with one safety step, one clear bill rule, and one weekly money check-in.",
      "Llevas presión real. Empezamos con un paso de seguridad, una regla clara para cuentas y una revisión semanal del dinero."
    ),
    focus: L(
      [
        "Mini emergency buffer ($100–$300).",
        "Autopay minimums on essentials.",
        "One weekly 10-minute money check-in.",
      ],
      [
        "Colchón de emergencia pequeño ($100–$300).",
        "Pagos automáticos mínimos en lo esencial.",
        "Una revisión semanal de 10 minutos.",
      ]
    ),
    plan30day: L(
      [
        "Open a no-fee savings; set $10–$15 auto-transfer.",
        "List bills by due date; enable autopay minimums.",
        "Pick one high-stress bill and call to set a plan.",
      ],
      [
        "Abre un ahorro sin comisiones; auto-traspaso de $10–$15.",
        "Lista las cuentas por fecha; activa mínimos automáticos.",
        "Elige la cuenta que más te estresa y acuerda un plan.",
      ]
    ),
  },

  stabilizer: {
    title: personaLabels.stabilizer,
    subtitle: L(
      "Build rhythm and reduce surprises.",
      "Crea ritmo y reduce sorpresas."
    ),
    about: L(
      "You’ve got pieces in place. Next is steady rhythm—small buffer growth, simple automation, and clear spending priorities.",
      "Ya tienes piezas colocadas. Ahora ritmo constante: crecer el colchón, automatizar y priorizar el gasto."
    ),
    focus: L(
      [
        "Grow buffer toward 1 month of essentials.",
        "Round-up or $25 auto-saves.",
        "Sinking funds for car/medical/holidays.",
      ],
      [
        "Aumenta el colchón hacia 1 mes de esenciales.",
        "Redondeos o ahorros automáticos de $25.",
        "Fondos de reserva: auto/médico/festivos.",
      ]
    ),
    plan30day: L(
      [
        "Add one sinking fund (car repair) with auto-save.",
        "Set a ‘needs-first’ grocery list template.",
        "Schedule a monthly money hour.",
      ],
      [
        "Crea un fondo de reserva (auto) con ahorro automático.",
        "Usa una lista de supermercado ‘necesidades primero’.",
        "Programa una ‘hora de dinero’ mensual.",
      ]
    ),
  },

  builder: {
    title: personaLabels.builder,
    subtitle: L(
      "Lock in habits and accelerate progress.",
      "Consolida hábitos y acelera el progreso."
    ),
    about: L(
      "Habits are forming. Let’s automate key moves and accelerate savings while trimming hidden costs.",
      "Los hábitos se afianzan. Automatizamos movimientos clave y aceleramos el ahorro recortando costos ocultos."
    ),
    focus: L(
      [
        "Debt paydown plan (highest cost first or snowball).",
        "Auto-increase savings by 1–2% per quarter.",
        "Fee audit: remove avoidable charges.",
      ],
      [
        "Plan de pago de deudas (mayor costo o bola de nieve).",
        "Aumenta el ahorro automático 1–2% por trimestre.",
        "Audita comisiones y elimina cargos evitables.",
      ]
    ),
    plan30day: L(
      [
        "Refinance or consolidate one high-APR balance (if eligible).",
        "Auto-bump savings by $10/month.",
        "Cancel one unused subscription.",
      ],
      [
        "Refinancia o consolida un saldo con APR alto (si aplica).",
        "Aumenta el ahorro automático $10/mes.",
        "Cancela una suscripción no usada.",
      ]
    ),
  },

  optimizer: {
    title: personaLabels.optimizer,
    subtitle: L(
      "Protect and optimize for the next 6–12 months.",
      "Protege y optimiza para los próximos 6–12 meses."
    ),
    about: L(
      "Solid foundation. Now optimize: protect against surprises, align investments to timeline, and tune cash flow.",
      "Base sólida. Ahora optimiza: protégete de imprevistos, alinea inversiones al plazo y ajusta el flujo."
    ),
    focus: L(
      [
        "3–6 months expenses target.",
        "Goal-based buckets (auto/home/education).",
        "Review insurance and rate options.",
      ],
      [
        "Meta de 3–6 meses de gastos.",
        "Cuentas por metas (auto/hogar/educación).",
        "Revisa seguros y opciones de tasas.",
      ]
    ),
    plan30day: L(
      [
        "Raise emergency fund auto-save by 5–10%.",
        "Annual ‘rate check’ on loans and CDs.",
        "Map a 12-month Money Plan.",
      ],
      [
        "Sube el ahorro de emergencia 5–10%.",
        "‘Chequeo anual’ de tasas en préstamos y CDs.",
        "Traza un plan de 12 meses.",
      ]
    ),
  },
};
