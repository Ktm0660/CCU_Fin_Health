/**
 * Generates a friendly, localized 30-day starter plan based on persona + weakest pillar.
 * Export: build30DayPlan(persona, primaryPillar, locale)
 */
import type { Locale, Pillar } from "./personas";

export function build30DayPlan(persona: string, primary: Pillar, locale: Locale) {
  const L = (en: string, es: string) => (locale === "es" ? es : en);
  const steps = [
    {
      day: 1,
      text: L(
        "Pick one micro-habit you can do in 3 minutes.",
        "Elige un micro-hábito que puedas hacer en 3 minutos."
      ),
    },
    {
      day: 7,
      text: L(
        "Set one automatic transfer (even $5) toward a goal.",
        "Configura una transferencia automática (aunque sea $5) para una meta."
      ),
    },
    {
      day: 14,
      text: L(
        "Do a 10-minute check-in: what felt easier? what still blocks you?",
        "Haz una revisión de 10 minutos: ¿qué fue más fácil? ¿qué te bloquea aún?"
      ),
    },
    {
      day: 21,
      text: L(
        "Tackle one ‘paperwork’ task with a script or checklist.",
        "Resuelve una tarea de ‘papeles’ usando un guion o lista de verificación."
      ),
    },
    {
      day: 30,
      text: L(
        "Celebrate a win and set the next tiny upgrade.",
        "Celebra un logro y define la siguiente pequeña mejora.",
      ),
    },
  ];

  // Add one targeted nudge based on primary pillar
  const targeted = {
    habits: L("Add bill due-dates to your weekly calendar.", "Agrega fechas de pago a tu calendario semanal."),
    confidence: L("Practice one ‘talk track’ aloud for a decision you’ve been avoiding.", "Practica en voz alta un guion para una decisión que has estado evitando."),
    stability: L("Name your emergency goal and link it to an auto-transfer.", "Nombra tu meta de emergencia y vincúlala a una transferencia automática."),
    access: L("Open (or review) your fee-friendly account setup.", "Abre (o revisa) una cuenta sin cargos innecesarios."),
    resilience: L("Take the scam spot-check: review your last 10 texts/calls for red flags.", "Haz una revisión anti-estafas: revisa tus últimos 10 mensajes/llamadas."),
  } as const;

  return {
    headline: L("Your 30-Day Starter Plan", "Tu Plan Inicial de 30 Días"),
    steps,
    targeted: targeted[primary],
  };
}
