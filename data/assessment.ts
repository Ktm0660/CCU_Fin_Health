export type Dimension = "habits" | "confidence" | "stability";
export type Option = { text_en: string; text_es: string; weights: Partial<Record<Dimension, number>> };
export type Question = { id: string; text_en: string; text_es: string; options: Option[] };

const o = (en: string, es: string, h=0,c=0,s=0) => ({ text_en: en, text_es: es, weights: { habits:h, confidence:c, stability:s } });

export const questions: Question[] = [
  // 1) Spending Awareness & Habits
  { id: "q1",
    text_en: "When the month ends, do you usually know where most of your money went?",
    text_es: "Cuando termina el mes, ¿sueles saber adónde fue la mayor parte de tu dinero?",
    options: [ o("Yes, I track it closely.","Sí, lo registro de cerca.",3,1,1),
               o("I have a general idea.","Tengo una idea general.",2,0,0),
               o("Not really.","No mucho.",1,-1,-1),
               o("No, I often wonder where it goes.","No, a menudo me pregunto adónde se va.",0,-2,-2) ]
  },
  { id: "q2",
    text_en: "How often do you feel stressed about paying your regular bills?",
    text_es: "¿Con qué frecuencia sientes estrés al pagar tus cuentas habituales?",
    options: [ o("Hardly ever","Casi nunca",3,2,2),
               o("Sometimes","A veces",2,1,1),
               o("Often","A menudo",1,-1,-1),
               o("Almost every month","Casi todos los meses",0,-2,-2) ]
  },
  { id: "q3",
    text_en: "When you make everyday purchases (groceries, gas), what guides you?",
    text_es: "Cuando haces compras diarias (comida, gasolina), ¿qué te guía?",
    options: [ o("I stick to a list or budget.","Sigo una lista o presupuesto.",3,1,1),
               o("I try to spend carefully.","Intento gastar con cuidado.",2,0,0),
               o("I buy what I need in the moment.","Compro lo que necesito en el momento.",1,-1,0),
               o("I often spend without thinking much.","A menudo gasto sin pensarlo mucho.",0,-2,-1) ]
  },
  { id: "q4",
    text_en: "If you had extra money at month end, what would you do first?",
    text_es: "Si te sobrara dinero al final de mes, ¿qué harías primero?",
    options: [ o("Add to savings.","Agregar a ahorros.",2,1,3),
               o("Pay off debt.","Pagar deudas.",2,1,2),
               o("Treat myself or family.","Darme un gusto a mí o a mi familia.",1,0,0),
               o("I usually don't have extra.","Usualmente no me sobra.",0,-1,-2) ]
  },
  // 2) Saving & Stability
  { id: "q5",
    text_en: "Do you have money set aside for emergencies?",
    text_es: "¿Tienes dinero ahorrado para emergencias?",
    options: [ o("Yes, a few months’ worth.","Sí, algunos meses.",2,1,3),
               o("A little, not much.","Un poco, no mucho.",1,0,2),
               o("Not now, but want to start.","No ahora, pero quiero empezar.",1,1,1),
               o("No, paycheck to paycheck.","No, vivo al día.",0,-1,-2) ]
  },
  { id: "q6",
    text_en: "How confident are you about reaching your goals?",
    text_es: "¿Qué tan seguro te sientes de alcanzar tus metas?",
    options: [ o("Very confident—on track.","Muy seguro—en camino.",2,3,2),
               o("Somewhat confident—trying.","Algo seguro—intentándolo.",1,2,1),
               o("Unsure—haven’t planned.","Inseguro—sin plan.",0,0,0),
               o("Not confident—out of reach.","Nada seguro—lejos.",0,-2,-1) ]
  },
  { id: "q7",
    text_en: "When unexpected income (tax refund) comes in, what do you do?",
    text_es: "Cuando llega un ingreso inesperado (impuestos), ¿qué haces?",
    options: [ o("Save most of it.","Ahorro la mayoría.",2,1,3),
               o("Spend part and save part.","Gasto una parte y ahorro otra.",1,0,2),
               o("Use it to catch up on bills or debt.","Lo uso para ponerme al día.",1,1,2),
               o("Spend it right away.","Lo gasto de inmediato.",0,-1,-1) ]
  },
  // 3) Borrowing & Credit Confidence
  { id: "q8",
    text_en: "How do you feel about your current debt?",
    text_es: "¿Cómo te sientes respecto a tus deudas actuales?",
    options: [ o("Manage well and pay on time.","Lo manejo bien y pago a tiempo.",2,2,2),
               o("Okay, sometimes hard.","Bien, a veces difícil.",1,0,0),
               o("Stressful or overwhelming.","Estresante o abrumador.",0,-2,-1),
               o("I don’t have credit/loans.","No tengo crédito/préstamos.",1,0,1) ]
  },
  { id: "q9",
    text_en: "When you need to borrow, where do you turn?",
    text_es: "Cuando necesitas pedir dinero, ¿a dónde recurres?",
    options: [ o("Credit union or bank.","Cooperativa o banco.",2,2,1),
               o("Family or friends.","Familia o amigos.",1,0,0),
               o("Payday/online lender.","Prestamistas rápidos.",0,-2,-2),
               o("Avoid borrowing.","Evito pedir prestado.",1,1,1) ]
  },
  { id: "q10",
    text_en: "Have you ever been turned down for credit?",
    text_es: "¿Te han rechazado crédito alguna vez?",
    options: [ o("No.","No.",2,1,2),
               o("Yes, once or twice.","Sí, una o dos veces.",1,0,0),
               o("Yes, more than once.","Sí, varias veces.",0,-2,-1),
               o("Never applied.","Nunca solicité.",0,0,0) ]
  },
  // 4) Trust & Connection
  { id: "q11",
    text_en: "Do you currently have an account with a credit union or bank?",
    text_es: "¿Actualmente tienes una cuenta en una cooperativa o banco?",
    options: [ o("Yes, use it often.","Sí, la uso seguido.",2,1,1),
               o("Yes, rarely use it.","Sí, la uso poco.",1,0,0),
               o("Used to, not anymore.","Antes sí, ya no.",0,-1,-1),
               o("No account right now.","No tengo actualmente.",0,-2,-2) ]
  },
  { id: "q12",
    text_en: "How comfortable talking to financial institutions?",
    text_es: "¿Qué tan cómodo te sientes al hablar con instituciones financieras?",
    options: [ o("Very comfortable—understood.","Muy cómodo—me entienden.",2,3,1),
               o("Depends on the person.","Depende de la persona.",1,1,0),
               o("Not comfortable—judged.","Incómodo—me juzgan.",0,-2,0),
               o("I avoid it—don’t trust.","Lo evito—no confío.",0,-3,0) ]
  },
  { id: "q13",
    text_en: "What has made you hesitant to trust a bank/credit union?",
    text_es: "¿Qué te ha hecho dudar en confiar?",
    options: [ o("Fees and costs.","Comisiones y costos.",0,-1,-1),
               o("Not welcomed/understood.","No me recibieron bien.",0,-2,0),
               o("Language barriers.","Barreras de idioma.",0,-2,0),
               o("Prefer cash.","Prefiero efectivo.",0,-1,-1),
               o("Haven’t thought about it.","No lo he pensado.",0,0,0) ]
  },
  { id: "q14",
    text_en: "If opening an account were easy, transparent, judgment-free, would you join?",
    text_es: "Si abrir una cuenta fuera fácil, transparente y sin juicios, ¿te unirías?",
    options: [ o("Very likely.","Muy probable.",1,3,1),
               o("Maybe, if I felt safe.","Quizá, si me siento seguro.",0,2,0),
               o("Unsure.","No estoy seguro.",0,0,0),
               o("Not likely—bad experiences.","Poco probable—malas experiencias.",0,-2,0) ]
  },
  // 5) Planning for the Future
  { id: "q15",
    text_en: "Do you have a plan or budget for big goals?",
    text_es: "¿Tienes un plan o presupuesto para grandes metas?",
    options: [ o("Yes, I follow a plan.","Sí, sigo un plan.",2,2,3),
               o("Thought about it, not written.","Lo pensé, no escrito.",1,1,1),
               o("Not yet, want help.","Aún no, quiero ayuda.",1,1,1),
               o("No, take things as they come.","No, voy sobre la marcha.",0,0,0) ]
  },
  { id: "q16",
    text_en: "Do you have someone you trust to talk about money?",
    text_es: "¿Tienes alguien de confianza para hablar de dinero?",
    options: [ o("Yes, often.","Sí, seguido.",1,2,2),
               o("Sometimes.","A veces.",1,1,1),
               o("Not really, wish I did.","No mucho, quisiera.",0,0,0),
               o("No, I decide alone.","No, yo decido solo.",0,-1,0) ]
  },
  { id: "q17",
    text_en: "Most days, how do you feel about money?",
    text_es: "La mayoría de los días, ¿cómo te sientes respecto al dinero?",
    options: [ o("Calm and in control.","Calmo y en control.",2,2,2),
               o("Trying, but stressful.","Intentando, pero estresante.",1,0,0),
               o("Unsure and anxious.","Inseguro y ansioso.",0,-1,0),
               o("Overwhelmed or stuck.","Abrumado o estancado.",0,-2,-1) ]
  }
];

export type AnswerMap = Record<string, number>; // questionId -> option index
export type Score = {
  habits: number; confidence: number; stability: number;
  maxHabits: number; maxConfidence: number; maxStability: number;
  total: number; totalMax: number;
};

function perDimMax() {
  // For each question, the max contribution per dimension is the highest weight available in that dim
  let maxH=0, maxC=0, maxS=0;
  questions.forEach(q => {
    let h=0, c=0, s=0;
    q.options.forEach(o => {
      h = Math.max(h, o.weights.habits ?? 0);
      c = Math.max(c, o.weights.confidence ?? 0);
      s = Math.max(s, o.weights.stability ?? 0);
    });
    maxH += h; maxC += c; maxS += s;
  });
  return { maxH, maxC, maxS };
}

export function scoreAnswers(ans: AnswerMap): Score {
  let h=0,c=0,s=0;
  questions.forEach(q => {
    const idx = ans[q.id];
    if (idx !== undefined) {
      const w = q.options[idx].weights;
      h += w.habits ?? 0;
      c += w.confidence ?? 0;
      s += w.stability ?? 0;
    }
  });
  const { maxH, maxC, maxS } = perDimMax();
  return {
    habits: h, confidence: c, stability: s,
    maxHabits: maxH, maxConfidence: maxC, maxStability: maxS,
    total: h + c + s,
    totalMax: maxH + maxC + maxS
  };
}

export function partialScore(ans: AnswerMap) {
  // same as scoreAnswers but helpful during the live flow
  return scoreAnswers(ans);
}

export function guidance(dim: "habits"|"confidence"|"stability", score: number) {
  if (dim==="habits") return score>=26 ? "Your day-to-day choices are steady. Keep the rhythm going." :
    score>=18 ? "You’re finding your rhythm — small, consistent steps unlock big change." :
    "Let’s put simple rails in place—one list, one bill-pay rule, one savings rule.";
  if (dim==="confidence") return score>=26 ? "You advocate for yourself and ask clear questions." :
    score>=18 ? "You deserve clear, judgment-free guidance—and we’ll help you get it." :
    "We’ll make it transparent and safe to talk about money. You’re not alone here.";
  return score>=26 ? "Your safety net is forming nicely." :
    score>=18 ? "You’re building a foundation—let’s grow your safety net together." :
    "First wins matter: mini emergency fund and one debt relief move.";
}
