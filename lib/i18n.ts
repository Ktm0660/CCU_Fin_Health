export type Locale = "en" | "es";
export function t(locale: Locale, key: string): string {
  return (dict[locale] as any)[key] ?? key;
}
const dict = {
  en: {
    heroTitle: "Feel safer and stronger with money.",
    heroBody:
      "Simple tools, clear guidance, and real people who listen. Whether you bank with us or not, this space is for you.",
    getStarted: "Start the Assessment",
    learnMore: "Explore Tools & Resources",
    scoreTitle: "Your Financial Health Snapshot",
    habits: "Habits",
    confidence: "Confidence",
    stability: "Stability",
    nextSteps: "Helpful next steps",
  },
  es: {
    heroTitle: "Siéntete más seguro y fuerte con tu dinero.",
    heroBody:
      "Herramientas simples, orientación clara y personas reales que escuchan. Seas miembro o no, este espacio es para ti.",
    getStarted: "Comenzar la evaluación",
    learnMore: "Explorar herramientas y recursos",
    scoreTitle: "Tu panorama de salud financiera",
    habits: "Hábitos",
    confidence: "Confianza",
    stability: "Estabilidad",
    nextSteps: "Próximos pasos útiles",
  }
};
