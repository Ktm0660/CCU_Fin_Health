import { rankOrder5, type Pillar } from "@/data/assessment";
import { hrefWithLang, type Lang } from "@/lib/lang";
import { sortPillarsByNeed, type PillarMetric } from "@/lib/resultsShared";

export type ActionStep = {
  id: string;
  pillar: Pillar | "general";
  title_en: string;
  title_es: string;
  detail_en: string;
  detail_es: string;
  href: string;
};

type PillarActionSet = {
  focus: ActionStep;
  growth: ActionStep;
};

const baseActions: Record<Pillar, PillarActionSet> = {
  habits: {
    focus: {
      id: "mini-emergency-fund-boost",
      pillar: "habits",
      title_en: "Start a tiny safety buffer",
      title_es: "Empieza un pequeño colchón",
      detail_en: "Move $10–$25 on payday into a named savings pocket. A labeled buffer reduces stress fast.",
      detail_es: "Mueve $10–$25 en día de pago a un ahorro con nombre. Un colchón pequeño baja el estrés rápido.",
      href: "/resources#mini-emergency-fund-250",
    },
    growth: {
      id: "autopay-setup",
      pillar: "habits",
      title_en: "Set autopay for minimums—safely",
      title_es: "Activa pagos automáticos—con seguridad",
      detail_en: "Turn on autopay for minimums and pick one ‘pay-down day’ a month to add extra without overdrafts.",
      detail_es: "Activa autopago de mínimos y elige un “día de avance” al mes para agregar extra sin sobregiros.",
      href: "/resources#safe-autopay-basics",
    },
  },
  stability: {
    focus: {
      id: "alerts-and-due-dates",
      pillar: "stability",
      title_en: "Turn on balance & due-date alerts",
      title_es: "Activa alertas de saldo y fechas",
      detail_en: "Set low-balance and bill alerts so surprises don’t knock you off track this week.",
      detail_es: "Configura alertas de saldo bajo y de facturas para que nada te sorprenda esta semana.",
      href: "/resources#alerts",
    },
    growth: {
      id: "small-dollar-relief",
      pillar: "stability",
      title_en: "Compare safer small-dollar relief",
      title_es: "Compara alivios pequeños más seguros",
      detail_en: "If cash is tight, see how our small-dollar option beats payday fees and keeps you moving forward.",
      detail_es: "Si el efectivo está justo, conoce la opción de alivio pequeño sin las tarifas del ‘payday’.",
      href: "/products/small-dollar",
    },
  },
  confidence: {
    focus: {
      id: "credit-report-walkthrough",
      pillar: "confidence",
      title_en: "Pull your free credit report, step-by-step",
      title_es: "Descarga tu reporte de crédito, paso a paso",
      detail_en: "Follow a private walkthrough to spot errors and list 1–2 questions to ask a coach.",
      detail_es: "Sigue una guía privada para detectar errores y anotar 1–2 preguntas para un asesor.",
      href: "/resources#credit-report",
    },
    growth: {
      id: "glossary-refresh",
      pillar: "confidence",
      title_en: "Decode one money term in minutes",
      title_es: "Descifra un término financiero en minutos",
      detail_en: "Use the jargon-free glossary to clear up a confusing word—one quick win builds momentum.",
      detail_es: "Usa el glosario sin jerga para aclarar una palabra confusa; una victoria rápida crea impulso.",
      href: "/glossary",
    },
  },
  trust: {
    focus: {
      id: "fee-finder",
      pillar: "trust",
      title_en: "Spot and dodge common fees",
      title_es: "Detecta y evita cargos comunes",
      detail_en: "Review the fee finder to avoid overdraft, ATM, and late fees before they hit.",
      detail_es: "Revisa la guía de cargos para evitar sobregiros, cajeros externos y moras antes de que aparezcan.",
      href: "/fees",
    },
    growth: {
      id: "itin-walkthrough",
      pillar: "trust",
      title_en: "See how ITIN-friendly lending works",
      title_es: "Conoce cómo funcionan los préstamos con ITIN",
      detail_en: "Learn documents, timeline, and costs for ITIN lending so you know what to expect—no surprises.",
      detail_es: "Conoce documentos, tiempos y costos de los préstamos con ITIN para que nada te tome por sorpresa.",
      href: "/products/itin-lending",
    },
  },
  resilience: {
    focus: {
      id: "community-support-check",
      pillar: "resilience",
      title_en: "Make a simple backup list",
      title_es: "Haz una lista de respaldo simple",
      detail_en: "List 3 people or services you can tap this week (family, clinic, coach) and save it in your phone.",
      detail_es: "Anota 3 apoyos a los que puedas acudir esta semana (familia, clínica, asesor) y guárdalos en tu teléfono.",
      href: "/learn",
    },
    growth: {
      id: "plan-review",
      pillar: "resilience",
      title_en: "Schedule a 15-min money check-in",
      title_es: "Agenda una revisión de dinero de 15 minutos",
      detail_en: "Block a short calendar slot to review one bill and one goal—small, consistent check-ins build resilience.",
      detail_es: "Aparta 15 minutos para revisar una cuenta y una meta; chequeos pequeños y constantes crean resiliencia.",
      href: "/learn",
    },
  },
};

const fallbackSteps: ActionStep[] = [
  {
    id: "budget-basics",
    pillar: "general",
    title_en: "Try a 7-day needs/goals list",
    title_es: "Prueba una lista de necesidades/metas de 7 días",
    detail_en: "Write needs, must-pay bills, and 1 small goal. It keeps the week calm and focused.",
    detail_es: "Escribe necesidades, cuentas obligatorias y 1 meta pequeña. Mantiene la semana en calma y enfocada.",
    href: "/plan",
  },
  {
    id: "more-resources",
    pillar: "general",
    title_en: "Browse tools matched to you",
    title_es: "Explora herramientas a tu medida",
    detail_en: "Visit resources to pick one tool to try today—short, clear guides with no judgment.",
    detail_es: "Visita recursos para elegir una herramienta hoy; guías breves y sin juicios.",
    href: "/resources",
  },
  {
    id: "book-coach",
    pillar: "general",
    title_en: "Talk with a coach or branch guide",
    title_es: "Habla con un asesor o guía en sucursal",
    detail_en: "Bring one question to a coach—getting clarity now prevents costly guesses later.",
    detail_es: "Lleva una pregunta a un asesor; aclarar dudas hoy evita decisiones costosas después.",
    href: "/learn",
  },
];

export function buildActionPlan(
  metrics: Partial<Record<Pillar, PillarMetric>>,
  lang: Lang
): Array<ActionStep & { title: string; detail: string; href: string }> {
  const steps: ActionStep[] = [];
  const orderedPillars = sortPillarsByNeed(metrics);

  orderedPillars.forEach(pillar => {
    if (steps.length >= 3) return;
    const metric = metrics[pillar];
    const severity = metric ? rankOrder5[metric.bucket] : 3;
    const set = severity <= 2 ? baseActions[pillar].focus : baseActions[pillar].growth;
    if (!steps.find(s => s.id === set.id)) steps.push(set);
  });

  for (const fb of fallbackSteps) {
    if (steps.length >= 3) break;
    if (!steps.find(s => s.id === fb.id)) steps.push(fb);
  }

  return steps.slice(0, 3).map(step => ({
    ...step,
    title: lang === "en" ? step.title_en : step.title_es,
    detail: lang === "en" ? step.detail_en : step.detail_es,
    href: hrefWithLang(step.href, lang),
  }));
}
