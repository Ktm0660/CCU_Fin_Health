// Copy and helpers for the 5-bucket results screen (EN/ES).
import { Bucket5, scoreAnswers, bucketize5 } from "@/data/assessment";
export { scoreAnswers, bucketize5 };
type Locale = "en"|"es";

export function bucketCopy5(locale: Locale) {
  const L = (en:string, es:string)=> locale==="en" ? en : es;

  const labels = {
    rebuilding: L("Rebuilding","Reconstruyendo"),
    getting_started: L("Getting Started","Empezando"),
    progress: L("Making Progress","Tomando ritmo"),
    on_track: L("On Track","En buen camino"),
    empowered: L("Empowered","Con control")
  } as const;

  const overall = {
    title: (b:Bucket5)=> L(`Your profile: ${labels[b]}`, `Tu perfil: ${labels[b]}`),
    body: (b:Bucket5)=> {
      const en: Record<Bucket5,string> = {
        rebuilding: "You’re facing real pressure. We’ll focus on small wins that reduce stress fast.",
        getting_started: "You’re beginning to take control. Simple routines will make every month easier.",
        progress: "You’re building steady habits. A few tweaks can increase confidence and stability.",
        on_track: "You’ve built solid patterns. Let’s optimize and plan ahead.",
        empowered: "You’re in control—keep compounding good choices, and consider mentoring others."
      };
      const es: Record<Bucket5,string> = {
        rebuilding: "Estás bajo presión real. Nos enfocaremos en pequeños logros para bajar el estrés pronto.",
        getting_started: "Estás empezando a tomar control. Rutinas simples facilitan cada mes.",
        progress: "Vas creando hábitos firmes. Unos ajustes aumentan confianza y estabilidad.",
        on_track: "Tienes patrones sólidos. Ahora optimicemos y planifiquemos.",
        empowered: "Tienes el control—sigue acumulando buenas decisiones y quizá apoya a otros."
      };
      return locale==="en" ? en[b] : es[b];
    }
  };

  const dim = {
    habits: {
      strengths: (b:Bucket5)=> locale==="en" ? (
        b==="empowered" ? ["Consistent tracking and mindful spending.","Bills organized; surprises are rare."] :
        b==="on_track" ? ["Most days are planned, not reactive.","You adjust spending with intention."] :
        b==="progress" ? ["You’re catching yourself before impulse buys.","You’re using simple lists or rules."] :
        b==="getting_started" ? ["You’re noticing patterns and learning your triggers."] :
        ["We’ll add simple rails: one list, one autopay, one savings rule."]
      ) : (
        b==="empowered" ? ["Seguimiento constante y gasto consciente.","Cuentas organizadas; pocas sorpresas."] :
        b==="on_track" ? ["La mayoría de los días son planificados, no reactivos.","Ajustas el gasto con intención."] :
        b==="progress" ? ["Te detienes antes de compras impulsivas.","Usas listas o reglas sencillas."] :
        b==="getting_started" ? ["Estás notando patrones y aprendiendo tus disparadores."] :
        ["Pondremos rieles simples: una lista, un pago automático, una regla de ahorro."]
      )
    },
    confidence: {
      strengths: (b:Bucket5)=> locale==="en" ? (
        b==="empowered" ? ["You ask clear questions and self-advocate.","You compare options before choosing."] :
        b==="on_track" ? ["You’re comfortable asking for help.","You look for plain-language answers."] :
        b==="progress" ? ["You’re building confidence by checking more often."] :
        b==="getting_started" ? ["You’re ready to talk with someone who listens."] :
        ["We’ll make it safe and clear to ask for help—no judgment."]
      ) : (
        b==="empowered" ? ["Haces preguntas claras y te defiendes.","Comparas opciones antes de elegir."] :
        b==="on_track" ? ["Te sientes cómodo pidiendo ayuda.","Buscas respuestas en lenguaje claro."] :
        b==="progress" ? ["Estás ganando confianza al revisar con más frecuencia."] :
        b==="getting_started" ? ["Estás listo para hablar con alguien que escucha."] :
        ["Haremos seguro y claro pedir ayuda—sin juicios."]
      )
    },
    stability: {
      strengths: (b:Bucket5)=> locale==="en" ? (
        b==="empowered" ? ["Emergency fund and buffer are in place.","You plan ahead for larger expenses."] :
        b==="on_track" ? ["Savings is consistent.","You’re reducing surprise bills with planning."] :
        b==="progress" ? ["You’re starting a cushion and catching up faster."] :
        b==="getting_started" ? ["You’re ready to set up the first small safety net."] :
        ["First wins: mini emergency fund and one debt relief move."]
      ) : (
        b==="empowered" ? ["Tienes fondo de emergencia y colchón.","Planeas gastos grandes con anticipación."] :
        b==="on_track" ? ["Ahorro constante.","Reduces sorpresas con planificación."] :
        b==="progress" ? ["Estás formando un colchón y te pones al día más rápido."] :
        b==="getting_started" ? ["Listo para crear el primer colchón pequeño."] :
        ["Primeros logros: fondo de emergencia pequeño y un paso de alivio de deuda."]
      )
    }
  } as const;

  return { labels, overall, dim };
}
