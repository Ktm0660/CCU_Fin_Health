export type Locale = "en" | "es";
export function t(locale: Locale, key: string): string {
  return (dict[locale] as any)[key] ?? key;
}
export function tz(locale: Locale, m: {en:string; es:string}) {
  return locale === "en" ? m.en : m.es;
}

const dict = {
  en: {
    // layout & nav
    appName: "Connections Financial Health",
    navHome: "Home",
    navAssessment: "Assessment",
    navResources: "Tools",
    navProducts: "Products",
    langEnglish: "English",
    langSpanish: "Español",
    "nav.home": "Home",
    "nav.assessment": "Checkup",
    "nav.resources": "Tools & Resources",
    "nav.products": "Products",
    "nav.glossary": "Glossary",
    "nav.results": "Results",
    "nav.plan": "Action Path",
    "nav.explore": "Explore",
    "nav.getHelp": "Get help",
    "nav.counseling": "Counseling",
    "nav.mobileUnit": "Mobile unit & schedule",

    // home
    heroTitle: "Feel safer and stronger with money.",
    heroBody:
      "Simple tools, clear guidance, and real people who listen. Whether you bank with us or not, this space is for you.",
    getStarted: "Start the Assessment",
    learnMore: "Explore Tools & Resources",
    homeWhatYouGet: "What you’ll get",
    homeWhy1T: "No pressure",
    homeWhy1B: "Use the tools even if you never open an account.",
    homeWhy2T: "Clear & transparent",
    homeWhy2B: "Plain-language guidance and no surprises.",
    homeWhy3T: "Bilingual help",
    homeWhy3B: "Switch languages anytime. We’ll meet you where you are.",
    homeHowTitle: "How it works",
    homeHow1: "Answer quick, judgment-free questions.",
    homeHow2: "Get a simple snapshot in plain language.",
    homeHow3: "Leave with next steps and a 30-day plan.",

    // assessment
    assessTitle: "Connections Financial Health & Trust Assessment",
    progress: "Question",
    of: "of",
    back: "Back",
    next: "Next",
    seeResults: "See my results",

    // results
    resultsTitle: "Your Financial Health Snapshot",
    overall: "Overall",
    habits: "Habits",
    confidence: "Confidence",
    stability: "Stability",
    helpfulNext: "Helpful next steps",
    exploreTools: "Explore Tools & Resources",
    seeProducts: "See Optional CU Products",
    makePlan: "Create my 30-day plan",
    "results.guidedPath": "Your guided path",
    "results.startHere": "Start here",
    "learn.title": "Short lessons",
    "learn.explore": "Explore lessons",

    // buckets
    bStart: "Getting Started",
    bBuild: "Finding Your Rhythm",
    bStrong: "Steady & Building",

    // plan
    planTitle: "Your 30-Day Action Plan",
    planPrint: "Print or save PDF",
    planIntro: "Small, steady steps. Here’s a short plan based on your snapshot.",

    // footer
    footerLine: "No judgment. No pressure. Just tools to help you feel safer and stronger with money."
  },
  es: {
    // layout & nav
    appName: "Salud Financiera de Connections",
    navHome: "Inicio",
    navAssessment: "Evaluación",
    navResources: "Herramientas",
    navProducts: "Productos",
    langEnglish: "English",
    langSpanish: "Español",
    "nav.home": "Inicio",
    "nav.assessment": "Evaluación",
    "nav.resources": "Herramientas y recursos",
    "nav.products": "Productos",
    "nav.glossary": "Glosario",
    "nav.results": "Resultados",
    "nav.plan": "Ruta de acción",
    "nav.explore": "Explorar",
    "nav.getHelp": "Obtener ayuda",
    "nav.counseling": "Consejería",
    "nav.mobileUnit": "Unidad móvil y horario",

    // home
    heroTitle: "Siéntete más seguro y fuerte con tu dinero.",
    heroBody:
      "Herramientas simples, orientación clara y personas reales que escuchan. Seas miembro o no, este espacio es para ti.",
    getStarted: "Comenzar la evaluación",
    learnMore: "Explorar herramientas y recursos",
    homeWhatYouGet: "Lo que recibirás",
    homeWhy1T: "Sin presión",
    homeWhy1B: "Úsalas incluso si nunca abres una cuenta.",
    homeWhy2T: "Claro y transparente",
    homeWhy2B: "Orientación en lenguaje sencillo y sin sorpresas.",
    homeWhy3T: "Ayuda bilingüe",
    homeWhy3B: "Cambia de idioma cuando quieras. Te encontramos donde estés.",
    homeHowTitle: "Cómo funciona",
    homeHow1: "Responde preguntas breves y sin juicios.",
    homeHow2: "Obtén un panorama simple en lenguaje claro.",
    homeHow3: "Sal con próximos pasos y un plan de 30 días.",

    // assessment
    assessTitle: "Evaluación de Salud Financiera y Confianza",
    progress: "Pregunta",
    of: "de",
    back: "Atrás",
    next: "Siguiente",
    seeResults: "Ver mis resultados",

    // results
    resultsTitle: "Tu panorama de salud financiera",
    overall: "General",
    habits: "Hábitos",
    confidence: "Confianza",
    stability: "Estabilidad",
    helpfulNext: "Próximos pasos útiles",
    exploreTools: "Explorar herramientas y recursos",
    seeProducts: "Ver productos opcionales",
    makePlan: "Crear mi plan de 30 días",
    "results.guidedPath": "Tu ruta guiada",
    "results.startHere": "Empieza aquí",
    "learn.title": "Lecciones cortas",
    "learn.explore": "Explorar lecciones",

    // buckets
    bStart: "Empezando",
    bBuild: "Tomando ritmo",
    bStrong: "Firme y avanzando",

    // plan
    planTitle: "Tu plan de acción de 30 días",
    planPrint: "Imprimir o guardar PDF",
    planIntro: "Pasos pequeños y constantes. Aquí tienes un plan corto según tu panorama.",

    // footer
    footerLine: "Sin juicios. Sin presión. Solo herramientas para sentirte más seguro y fuerte con el dinero."
  }
};
export default dict;
