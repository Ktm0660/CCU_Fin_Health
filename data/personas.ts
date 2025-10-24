import type { Bucket5 } from "./assessment";

export type PersonaKey =
  | "rebuilder"
  | "starter"
  | "juggler"
  | "balancer"
  | "navigator"
  | "builder";

export type Buckets = {
  habits: Bucket5;
  confidence: Bucket5;
  stability: Bucket5;
};

const rank: Record<Bucket5, number> = {
  rebuilding: 1,
  getting_started: 2,
  progress: 3,
  on_track: 4,
  empowered: 5,
};

export function getPersona(b: Buckets): PersonaKey {
  const H = rank[b.habits];
  const C = rank[b.confidence];
  const S = rank[b.stability];

  // 1) Rebuilder
  if (S <= 2 && (H <= 2 || C <= 2)) return "rebuilder";

  // 2) Starter
  if (H <= 2 && C <= 3 && S <= 3) return "starter";

  // 3) Juggler
  if (H >= 3 && C >= 3 && S <= 3) return "juggler";

  // 4) Balancer
  if (H >= 3 && H <= 4 && C >= 3 && C <= 4 && S >= 3 && S <= 4) return "balancer";

  // 5) Navigator
  if (C >= 4 && (H >= 4 || S >= 4) && H > 2 && S > 2) return "navigator";

  // 6) Builder (fallback)
  return "builder";
}

type Locale = "en" | "es";

export function personaCopy(locale: Locale) {
  const L = (en: string, es: string) => (locale === "en" ? en : es);

  return {
    label: {
      rebuilder: L("The Rebuilder", "La Reconstrucción"),
      starter: L("The Starter", "Quien Comienza"),
      juggler: L("The Juggler", "Quien Hace Malabares"),
      balancer: L("The Balancer", "El Equilibrado"),
      navigator: L("The Navigator", "La/El Navegante"),
      builder: L("The Builder", "Quien Construye"),
    } as const,
    icon: {
      rebuilder: "🧰",
      starter: "🌱",
      juggler: "🤹",
      balancer: "⚖️",
      navigator: "🧭",
      builder: "🧱",
    } as const,
    summary: {
      rebuilder: L(
        "You’re under real pressure. We’ll shrink stress fast with small, steady wins.",
        "Estás bajo presión real. Reduciremos el estrés con logros pequeños y constantes."
      ),
      starter: L(
        "You’re ready to get organized. Simple rails will make every month easier.",
        "Estás listo para organizarte. Rieles simples harán cada mes más fácil."
      ),
      juggler: L(
        "Your routines work, but the buffer feels thin. Time to build cushioning.",
        "Tus rutinas funcionan, pero el colchón es delgado. Es hora de engrosarlo."
      ),
      balancer: L(
        "Solid patterns and careful choices. Let’s tune and plan ahead.",
        "Patrones sólidos y decisiones cuidadosas. Afinemos y planifiquemos."
      ),
      navigator: L(
        "You compare options and plan ahead. Keep compounding smart moves.",
        "Comparas opciones y planificas. Sigue acumulando decisiones inteligentes."
      ),
      builder: L(
        "Momentum is building. Keep stacking simple wins.",
        "El impulso crece. Sigue sumando logros simples."
      ),
    } as const,
    steps: {
      rebuilder: [
        L("Start a $100–$300 mini emergency fund.", "Inicia un fondo de emergencia de $100–$300."),
        L("Set one bill to autopay (minimum).", "Activa pago automático en una cuenta (mínimo)."),
        L("Make one debt relief move (rate reduction or plan).", "Da un paso de alivio de deuda (baja tasa o plan)."),
      ],
      starter: [
        L("Use a one-page spending list (Needs → Bills → Wants).", "Usa una lista simple (Necesidades → Cuentas → Gustos)."),
        L("Turn on low-balance and large-purchase alerts.", "Activa alertas de saldo bajo y compras grandes."),
        L("Autosave $10/week to a separate space.", "Ahorra $10/semana en un espacio separado."),
      ],
      juggler: [
        L("Create sinking funds for car/home/medical.", "Crea apartados para auto/hogar/médico."),
        L("Automate a small ‘buffer’ transfer on payday.", "Automatiza un pequeño ‘colchón’ en día de pago."),
        L("Review 1 recurring bill to optimize.", "Optimiza 1 gasto recurrente."),
      ],
      balancer: [
        L("Schedule a monthly 15-minute money check-in.", "Agenda una revisión mensual de 15 minutos."),
        L("Raise autosave by a small step-up.", "Aumenta el ahorro automático un poco."),
        L("Plan for one big expense 3–6 months ahead.", "Planifica un gasto grande con 3–6 meses."),
      ],
      navigator: [
        L("Name sub-accounts by goal and automate them.", "Nombra subcuentas por meta y automatízalas."),
        L("Compare two offers before borrowing.", "Compara dos ofertas antes de pedir."),
        L("Mentor a friend or share what worked.", "Apoya a alguien compartiendo lo que te funcionó."),
      ],
      builder: [
        L("Write your next goal and deadline.", "Escribe tu próxima meta y fecha."),
        L("Set calendar nudges for monthly check-ins.", "Activa recordatorios para revisiones mensuales."),
        L("Pull your free credit report and note 1 action.", "Descarga tu reporte de crédito y define 1 acción."),
      ],
    } as const,
  };
}
