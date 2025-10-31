import type { Bucket5 } from "./assessment";

/** Simple localization helper types */
export type Localized<T> = { en: T; es: T };
const L = (en: string, es: string): Localized<string> => ({ en, es });

/** Canonical bucket labels shown to users (friendly names) */
const labels: Record<Bucket5, string> = {
  building: "Building",
  getting_started: "Getting Started",
  progress: "Making Progress",
  on_track: "On Track",
  empowered: "Empowered",
};

/** Copy used on the results page */
export const resultsCopy = {
  overall: {
    title: (b: Bucket5) =>
      L(`Your profile: ${labels[b]}`, `Tu perfil: ${labels[b]}`),

    body: (b: Bucket5) => {
      const en: Record<Bucket5, string> = {
        building:
          "You’re under real pressure. We’ll focus on fast, low-stress wins: one safety step, one bill rule, one weekly habit.",
        getting_started:
          "Pieces are in place. Next is steady rhythm: a small buffer, simple bill automation, and clear priorities.",
        progress:
          "Habits are forming. Let’s automate key moves and accelerate savings while reducing friction.",
        on_track:
          "You’re on a steady track. We’ll reinforce routines, grow buffers, and plan upcoming milestones.",
        empowered:
          "Solid foundation. Now optimize: protect against surprises, cut hidden costs, and align to 6–12 month goals.",
      };
      const es: Record<Bucket5, string> = {
        building:
          "Estás bajo presión. Iremos por victorias rápidas y de poco estrés: un paso de seguridad, una regla para cuentas y un hábito semanal.",
        getting_started:
          "Tienes piezas en su lugar. Lo siguiente es un ritmo constante: un pequeño colchón, automatizar pagos y prioridades claras.",
        progress:
          "Los hábitos están tomando forma. Automatizaremos movimientos clave y aceleraremos el ahorro reduciendo fricción.",
        on_track:
          "Vas en buen camino. Reforzaremos rutinas, creceremos los colchones y planificaremos los próximos hitos.",
        empowered:
          "Una base sólida. Ahora optimiza: protégete de imprevistos, reduce costos ocultos y alinea metas de 6–12 meses.",
      };
      return { en: en[b], es: es[b] };
    },
  },

  /** Per-dimension blurbs (shown under the big hero result) */
  dims: {
    habits: L(
      "Habits: Make spending boring on purpose—lists before trips, autopay minimums, and a weekly money check-in.",
      "Hábitos: Haz que el gasto sea ‘aburrido’ a propósito—lista antes de comprar, pagos automáticos y una revisión semanal."
    ),
    confidence: L(
      "Confidence: Judgment-free conversations, clear fee examples, and scripts help you ask the right questions.",
      "Confianza: Charlas sin juicios, ejemplos claros de comisiones y guiones para hacer las preguntas correctas."
    ),
    stability: L(
      "Stability: Build a small buffer first, then grow to 1–3 months of expenses with round-ups and auto-saves.",
      "Estabilidad: Crea primero un pequeño colchón y luego llega a 1–3 meses con redondeos y ahorros automáticos."
    ),
    planning: L(
      "Planning: A one-page Money Map turns goals into steps—sinking funds (car, medical, holidays) reduce surprises.",
      "Planificación: Un ‘Mapa de Dinero’ convierte metas en pasos—los fondos de reserva (auto, médico, fiestas) reducen sorpresas."
    ),
    access_trust: L(
      "Access & Trust: Transparent fees, simple account openings (including ITIN), and our mobile branch meet you where you are.",
      "Acceso y Confianza: Comisiones transparentes, apertura simple (incluido ITIN) y nuestra sucursal móvil te acercan soluciones."
    ),
  },
} as const;

export type ResultsCopy = typeof resultsCopy;
