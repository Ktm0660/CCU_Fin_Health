export type Dimension = "habits" | "confidence" | "stability";
export type BucketKey5 = "rebuilding" | "getting_started" | "progress" | "on_track" | "empowered";

/* ---------- Question model ---------- */
export type Option = {
  text_en: string;
  text_es: string;
  weights: Partial<Record<Dimension, number>>;
};

export type SliderConfig = {
  leftLabel_en: string;
  leftLabel_es: string;
  rightLabel_en: string;
  rightLabel_es: string;
  // bands: Left, Center-left, Center, Center-right, Right
  bands: [
    Partial<Record<Dimension, number>>,
    Partial<Record<Dimension, number>>,
    Partial<Record<Dimension, number>>,
    Partial<Record<Dimension, number>>,
    Partial<Record<Dimension, number>>
  ];
};

export type BaseQuestion = { id: string };
export type ChoiceQuestion = BaseQuestion & {
  kind: "choice";
  text_en: string;
  text_es: string;
  options: Option[];
};
export type SliderQuestion = BaseQuestion & {
  kind: "slider";
  text_en: string;
  text_es: string;
  slider: SliderConfig;
};
export type Question = ChoiceQuestion | SliderQuestion;

const o = (en: string, es: string, h=0,c=0,s=0): Option => ({
  text_en: en, text_es: es, weights: { habits:h, confidence:c, stability:s }
});

/* ---------- QUESTIONS (30) ---------- */
export const questions: Question[] = [
  // 1) Spending & Habits (6)
  { id:"q1", kind:"choice",
    text_en:"When you get paid, what happens first?",
    text_es:"Cuando te pagan, ¿qué sucede primero?",
    options:[
      o("I follow a written plan or budget.","Sigo un plan o presupuesto por escrito.",3,1,1),
      o("I pay the bills I remember and spend what’s left.","Pago las cuentas que recuerdo y gasto el resto.",2,0,0),
      o("I handle things as they come up.","Resuelvo las cosas según surgen.",1,-1,-1),
      o("I’m just getting by, paycheck to paycheck.","Apenas llego, de cheque en cheque.",0,-2,-2)
    ]
  },
  { id:"q2", kind:"choice",
    text_en:"How often do you check your balance or account activity?",
    text_es:"¿Con qué frecuencia revisas tu saldo o movimientos?",
    options:[
      o("Daily or almost daily.","Diario o casi diario.",3,1,1),
      o("About once a week.","Aproximadamente una vez por semana.",2,0,0),
      o("Only when something looks off.","Solo cuando algo se ve raro.",1,-1,0),
      o("Rarely—I don’t like seeing it.","Rara vez—no me gusta verlo.",0,-2,-1)
    ]
  },
  { id:"q3", kind:"choice",
    text_en:"When you make a purchase that wasn’t planned (not an emergency), how does it usually happen?",
    text_es:"Cuando haces una compra que no estaba planeada (no es emergencia), ¿cómo suele suceder?",
    options:[
      o("I check my balance or budget first, then decide.","Primero reviso mi saldo o presupuesto y luego decido.",3,1,1),
      o("I think for a moment and often buy it.","Lo pienso un momento y a menudo lo compro.",2,0,0),
      o("I buy on impulse, then figure it out later.","Compro por impulso y luego veo cómo ajusto.",1,-1,-1),
      o("I often regret it or stress afterward.","A menudo me arrepiento o me estreso después.",0,-2,-1)
    ]
  },
  { id:"q4", kind:"choice",
    text_en:"If a friend invites you to dinner right before payday, you would…",
    text_es:"Si un amigo te invita a cenar justo antes de la paga, tú…",
    options:[
      o("Go, no problem—I’ve planned for it.","Voy sin problema—ya lo había contemplado.",3,1,1),
      o("Check my budget and decide.","Reviso mi presupuesto y decido.",2,0,0),
      o("Go but spend carefully.","Voy pero gasto con cuidado.",1,-1,0),
      o("Hope my card goes through or skip another bill.","Espero que pase la tarjeta o salto otra cuenta.",0,-2,-2)
    ]
  },
  { id:"q5", kind:"choice",
    text_en:"How often do you make purchases you later regret?",
    text_es:"¿Con qué frecuencia haces compras de las que luego te arrepientes?",
    options:[
      o("Hardly ever.","Casi nunca.",3,1,1),
      o("Sometimes.","A veces.",2,0,0),
      o("Often.","A menudo.",1,-1,-1),
      o("Very often.","Muy a menudo.",0,-2,-2)
    ]
  },
  { id:"q6a", kind:"choice",
    text_en:"Which tools do you use to keep spending on track?",
    text_es:"¿Qué herramientas usas para mantener el gasto bajo control?",
    options:[
      o("Budgeting app or goals in my banking app.","App de presupuesto o metas en mi banca.",3,1,1),
      o("Basic online banking only.","Solo banca en línea básica.",2,0,0),
      o("Mostly cash/Venmo—no tracking.","Mayormente efectivo/Venmo—sin seguimiento.",1,-1,0),
      o("I lose track easily.","Pierdo el control con facilidad.",0,-2,-1)
    ]
  },

  // 2) Savings & Safety Net (6)
  { id:"q6", kind:"choice",
    text_en:"How many paychecks could you miss before falling behind?",
    text_es:"¿Cuántos cheques podrías perder antes de atrasarte?",
    options:[
      o("Three or more.","Tres o más.",2,1,3),
      o("Two.","Dos.",2,0,2),
      o("One.","Uno.",1,-1,1),
      o("None—I’m already tight.","Ninguno—ya estoy justo.",0,-2,-1)
    ]
  },
  { id:"q7", kind:"choice",
    text_en:"What do you do when you get unexpected money (bonus, refund, gift)?",
    text_es:"¿Qué haces cuando recibes dinero inesperado (bono, reembolso, regalo)?",
    options:[
      o("Save most of it.","Ahorro la mayor parte.",2,1,3),
      o("Split it—some save, some spend.","Lo divido—parte ahorro y parte gasto.",1,0,2),
      o("Use it to catch up on bills.","Lo uso para ponerme al día con cuentas.",1,1,2),
      o("Pay off debt.","Lo uso para pagar deudas.",1,1,2),
      o("Spend it quickly.","Lo gasto rápido.",0,-1,-1)
    ]
  },
  { id:"q8", kind:"choice",
    text_en:"Do you have a separate place for emergency savings?",
    text_es:"¿Tienes un lugar separado para ahorros de emergencia?",
    options:[
      o("Yes, with automatic deposits.","Sí, con depósitos automáticos.",2,1,3),
      o("Yes, but I move it in/out often.","Sí, pero lo muevo con frecuencia.",1,0,1),
      o("I save in my checking account.","Ahorro en mi cuenta de cheques.",1,0,1),
      o("I don’t have enough left over to save.","No me alcanza para ahorrar.",0,-1,-2)
    ]
  },
  { id:"q9", kind:"choice",
    text_en:"Saving each month is best described as…",
    text_es:"Ahorrar cada mes se describe mejor como…",
    options:[
      o("A normal bill I pay myself.","Una cuenta normal que me pago a mí mismo.",2,1,3),
      o("I try but it’s not consistent.","Intento, pero no es consistente.",1,0,2),
      o("I want to, but don’t know how to start.","Quiero, pero no sé cómo empezar.",1,1,1),
      o("I can’t right now.","No puedo ahora.",0,-1,-2)
    ]
  },
  { id:"q10", kind:"choice",
    text_en:"How confident are you that you could handle a $400 emergency?",
    text_es:"¿Qué tan seguro estás de poder cubrir una emergencia de $400?",
    options:[
      o("Very confident.","Muy seguro.",2,1,3),
      o("Somewhat confident.","Algo seguro.",1,0,2),
      o("Unsure.","Inseguro.",0,-1,0),
      o("Not at all confident.","Nada seguro.",0,-2,-1)
    ]
  },
  { id:"q10a", kind:"choice",
    text_en:"When your car or home needs a repair, what’s your usual plan?",
    text_es:"Cuando tu auto o casa necesitan reparación, ¿cuál es tu plan habitual?",
    options:[
      o("I have a buffer or sinking fund.","Tengo un colchón o fondo de ahorro específico.",2,1,3),
      o("I adjust other spending and handle it.","Ajusto otros gastos y lo cubro.",1,0,1),
      o("I use a card or borrow.","Uso tarjeta o pido prestado.",0,-1,0),
      o("I delay the repair and hope it holds.","Retraso la reparación y espero que aguante.",0,-2,-1)
    ]
  },

  // 3) Debt & Credit (6)
  { id:"q11", kind:"choice",
    text_en:"How do you usually make debt payments?",
    text_es:"¿Cómo sueles hacer tus pagos de deuda?",
    options:[
      o("Automatic—always on time.","Automático—siempre a tiempo.",2,2,2),
      o("Usually on time but manual.","Usualmente a tiempo pero manual.",1,1,1),
      o("Sometimes late.","A veces tarde.",0,-2,-1),
      o("Often late or skip.","A menudo tarde o salto pagos.",0,-3,-2)
    ]
  },
  { id:"q12", kind:"choice",
    text_en:"When you use a credit card, what’s your usual habit?",
    text_es:"Cuando usas una tarjeta de crédito, ¿cuál es tu costumbre?",
    options:[
      o("Pay in full monthly.","Pago el total cada mes.",2,2,2),
      o("Pay more than the minimum.","Pago más que el mínimo.",1,1,1),
      o("Pay the minimum.","Pago el mínimo.",0,-1,0),
      o("Avoid checking the balance.","Evito revisar el saldo.",0,-2,-1)
    ]
  },
  { id:"q13", kind:"choice",
    text_en:"Have you looked at your credit report in the past year?",
    text_es:"¿Has revisado tu reporte de crédito en el último año?",
    options:[
      o("Yes, and I understood it.","Sí, y lo entendí.",2,2,1),
      o("Yes, but it was confusing.","Sí, pero fue confuso.",1,1,0),
      o("No, I didn’t know I could.","No, no sabía que podía.",0,0,0),
      o("No, I’m afraid to.","No, me da miedo.",0,-2,0)
    ]
  },
  { id:"q14", kind:"choice",
    text_en:"If you needed $500 fast, where would you go first?",
    text_es:"Si necesitaras $500 rápido, ¿a dónde irías primero?",
    options:[
      o("My savings.","A mis ahorros.",2,1,3),
      o("Low-rate loan or line of credit.","Préstamo de bajo costo o línea.",1,1,2),
      o("Family or friends.","Familia o amigos.",1,0,0),
      o("Payday/online lender.","Prestamista rápido/en línea.",0,-2,-2)
    ]
  },
  { id:"q15", kind:"choice",
    text_en:"Thinking about your debt overall makes you feel…",
    text_es:"Pensar en tu deuda en general te hace sentir…",
    options:[
      o("Calm and in control.","Calmo y en control.",2,2,2),
      o("A bit stressed but manageable.","Algo estresado pero manejable.",1,1,1),
      o("Anxious or unsure.","Ansioso o inseguro.",0,-2,0),
      o("Overwhelmed.","Abrumado.",0,-3,-1)
    ]
  },
  { id:"q15a", kind:"choice",
    text_en:"What’s your main goal with debt right now?",
    text_es:"¿Cuál es tu meta principal con la deuda ahora?",
    options:[
      o("Pay off balances faster.","Pagar saldos más rápido.",1,2,1),
      o("Keep payments on time.","Mantener pagos a tiempo.",1,1,1),
      o("Avoid taking on new debt.","Evitar deudas nuevas.",1,1,1),
      o("Not sure / need help deciding.","No estoy seguro / necesito ayuda.",0,0,0)
    ]
  },

  // 4) Trust & Confidence (6)
  { id:"q16", kind:"choice",
    text_en:"When you talk to credit unions, banks, or other financial institutions, you feel…",
    text_es:"Cuando hablas con cooperativas, bancos u otras instituciones financieras, te sientes…",
    options:[
      o("Comfortable—they listen and explain clearly.","Cómodo—escuchan y explican claramente.",2,3,1),
      o("Cautious—it depends who it is.","Con cautela—depende de la persona.",1,1,0),
      o("Nervous or unsure what to ask.","Nervioso o sin saber qué preguntar.",0,-2,0),
      o("Judged or dismissed.","Juzgado o ignorado.",0,-3,0)
    ]
  },
  { id:"q17", kind:"choice",
    text_en:"What keeps you from asking for help with money?",
    text_es:"¿Qué te impide pedir ayuda con el dinero?",
    options:[
      o("Nothing—I ask when I need to.","Nada—pregunto cuando lo necesito.",1,2,0),
      o("I don’t want to bother anyone.","No quiero molestar a nadie.",0,-1,0),
      o("I don’t think they’ll understand my situation.","No creo que entiendan mi situación.",0,-2,0),
      o("I’m afraid of being told “no”.","Tengo miedo de que me digan “no”.",0,-2,0)
    ]
  },
  { id:"q18", kind:"choice",
    text_en:"What would make you more likely to use a financial institution?",
    text_es:"¿Qué te haría más propenso a usar una institución financiera?",
    options:[
      o("Clear, simple explanations.","Explicaciones claras y simples.",0,2,0),
      o("Fewer fees and surprises.","Menos comisiones y sorpresas.",0,1,0),
      o("Bilingual/culturally aware staff.","Personal bilingüe/consciente culturalmente.",0,2,0),
      o("Feeling truly welcomed.","Sentirme realmente bienvenido.",0,2,0)
    ]
  },
  { id:"q18a", kind:"choice",
    text_en:"If support were easy to schedule and judgment-free, you would…",
    text_es:"Si la ayuda fuera fácil de agendar y sin juicios, tú…",
    options:[
      o("Sign up.","Me anotaría.",0,2,0),
      o("Maybe—depends on timing.","Quizá—depende del horario.",0,1,0),
      o("Hesitate.","Dudaría.",0,-1,0),
      o("Decline.","Rechazaría.",0,-2,0)
    ]
  },
  { id:"q18b", kind:"choice",
    text_en:"Who do you trust most for money advice?",
    text_es:"¿En quién confías más para consejos de dinero?",
    options:[
      o("Counselor/advisor.","Consejero/asesor.",0,2,0),
      o("Family or friends.","Familia o amigos.",0,1,0),
      o("Online/social media.","En línea/redes sociales.",0,0,0),
      o("No one regularly.","Nadie con regularidad.",0,-1,0)
    ]
  },

  // 5) Future Planning & Mindset (6)
  { id:"q19", kind:"choice",
    text_en:"Do you have short-term financial goals (next 12 months)?",
    text_es:"¿Tienes metas financieras a corto plazo (próximos 12 meses)?",
    options:[
      o("Yes, written down.","Sí, por escrito.",2,2,3),
      o("Yes, in my head.","Sí, en mi mente.",1,1,2),
      o("I’ve thought about it, not clear.","Lo he pensado, no está claro.",1,0,1),
      o("Not really.","No mucho.",0,0,0)
    ]
  },
  { id:"q20", kind:"choice",
    text_en:"How often do you review your money or goals?",
    text_es:"¿Con qué frecuencia revisas tu dinero o metas?",
    options:[
      o("Monthly.","Mensualmente.",2,2,2),
      o("A few times a year.","Varias veces al año.",1,1,1),
      o("Rarely.","Rara vez.",0,0,0),
      o("Never.","Nunca.",0,-1,0)
    ]
  },
  { id:"q21", kind:"choice",
    text_en:"If you needed to make a big purchase (car, move, etc.), what’s your plan?",
    text_es:"Si necesitaras hacer una compra grande (auto, mudanza, etc.), ¿cuál es tu plan?",
    options:[
      o("Save and plan ahead.","Ahorro y planifico con anticipación.",2,1,2),
      o("Explore financing early.","Exploro financiamiento con anticipación.",1,1,1),
      o("Figure it out when needed.","Lo resuelvo cuando llegue el momento.",0,0,0),
      o("Avoid thinking about it.","Prefiero no pensarlo.",0,-1,0)
    ]
  },
  { id:"q22", kind:"choice",
    text_en:"How often do you talk about money with someone you trust?",
    text_es:"¿Con qué frecuencia hablas de dinero con alguien de confianza?",
    options:[
      o("Often—we review together.","A menudo—revisamos juntos.",1,2,1),
      o("Sometimes.","A veces.",1,1,0),
      o("Rarely.","Rara vez.",0,0,0),
      o("Never.","Nunca.",0,-1,0)
    ]
  },
  { id:"q23", kind:"choice",
    text_en:"When you imagine your finances a year from now, you feel…",
    text_es:"Al imaginar tus finanzas en un año, te sientes…",
    options:[
      o("Hopeful and motivated.","Con esperanza y motivación.",1,2,2),
      o("Cautiously optimistic.","Cautelosamente optimista.",1,1,1),
      o("Unsure.","Inseguro.",0,0,0),
      o("Hopeless.","Sin esperanza.",0,-2,-1)
    ]
  },
  { id:"q24", kind:"choice",
    text_en:"If you could change one thing right now, it would be…",
    text_es:"Si pudieras cambiar una cosa ahora mismo, sería…",
    options:[
      o("Grow savings.","Aumentar ahorros.",1,1,2),
      o("Pay down debt.","Pagar deudas.",1,1,1),
      o("Feel less stress about money.","Sentir menos estrés por el dinero.",0,2,0),
      o("Understand where my money goes.","Entender a dónde va mi dinero.",2,1,1)
    ]
  },

  // 6) Sliders (5) – 5-band scoring, left/right labels only
  { id:"q26", kind:"slider",
    text_en:"After paying bills and debt each month, how much of your income is left over?",
    text_es:"Después de pagar cuentas y deudas cada mes, ¿cuánto ingreso te queda?",
    slider:{
      leftLabel_en:"None / often short", leftLabel_es:"Nada / a veces me falta",
      rightLabel_en:"Comfortable leftover", rightLabel_es:"Sobra de forma cómoda",
      bands:[
        { habits:0, confidence:-1, stability:-2 },
        { habits:1, confidence:0,  stability:0  },
        { habits:1, confidence:0,  stability:1  },
        { habits:2, confidence:1,  stability:2  },
        { habits:2, confidence:1,  stability:3  }
      ]
    }
  },
  { id:"q27", kind:"slider",
    text_en:"How heavy does your debt feel right now?",
    text_es:"¿Qué tan pesada se siente tu deuda ahora?",
    slider:{
      leftLabel_en:"Crushing", leftLabel_es:"Aplastante",
      rightLabel_en:"Light / none", rightLabel_es:"Ligera / ninguna",
      bands:[
        { habits:0, confidence:-2, stability:-1 },
        { habits:0, confidence:-1, stability:0  },
        { habits:1, confidence:0,  stability:1  },
        { habits:2, confidence:1,  stability:1  },
        { habits:2, confidence:2,  stability:2  }
      ]
    }
  },
  { id:"q28", kind:"slider",
    text_en:"How much control do you feel over day-to-day spending?",
    text_es:"¿Qué tanto control sientes sobre el gasto diario?",
    slider:{
      leftLabel_en:"None", leftLabel_es:"Nada",
      rightLabel_en:"Total control", rightLabel_es:"Control total",
      bands:[
        { habits:0, confidence:-1, stability:0  },
        { habits:1, confidence:0,  stability:0  },
        { habits:2, confidence:1,  stability:1  },
        { habits:2, confidence:1,  stability:1  },
        { habits:3, confidence:2,  stability:1  }
      ]
    }
  },
  { id:"q29", kind:"slider",
    text_en:"How confident are you making a financial decision on your own?",
    text_es:"¿Qué tan seguro te sientes al tomar decisiones financieras por tu cuenta?",
    slider:{
      leftLabel_en:"Not confident", leftLabel_es:"Nada seguro",
      rightLabel_en:"Very confident", rightLabel_es:"Muy seguro",
      bands:[
        { habits:0, confidence:-2, stability:0  },
        { habits:1, confidence:-1, stability:0  },
        { habits:1, confidence:0,  stability:0  },
        { habits:2, confidence:1,  stability:0  },
        { habits:2, confidence:2,  stability:1  }
      ]
    }
  },
  { id:"q30", kind:"slider",
    text_en:"Most days, how calm or stressed do you feel about money?",
    text_es:"La mayoría de los días, ¿qué tan tranquilo o estresado te sientes con el dinero?",
    slider:{
      leftLabel_en:"Very stressed", leftLabel_es:"Muy estresado",
      rightLabel_en:"Very calm", rightLabel_es:"Muy tranquilo",
      bands:[
        { habits:0, confidence:-2, stability:-1 },
        { habits:1, confidence:-1, stability:0  },
        { habits:1, confidence:0,  stability:1  },
        { habits:2, confidence:1,  stability:1  },
        { habits:2, confidence:2,  stability:2  }
      ]
    }
  }
];

/* ---------- Scoring ---------- */
export type AnswerMap = Record<string, number>; // choice: option index; slider: 0..100 value

export type Score = {
  habits: number; confidence: number; stability: number;
  maxHabits: number; maxConfidence: number; maxStability: number;
  total: number; totalMax: number;
};

function perDimMax() {
  let maxH=0, maxC=0, maxS=0;
  questions.forEach(q => {
    if (q.kind === "choice") {
      let h=0,c=0,s=0;
      q.options.forEach(o => {
        h = Math.max(h, o.weights.habits ?? 0);
        c = Math.max(c, o.weights.confidence ?? 0);
        s = Math.max(s, o.weights.stability ?? 0);
      });
      maxH += h; maxC += c; maxS += s;
    } else {
      const b = q.slider.bands[4]; // rightmost = max
      maxH += b.habits ?? 0;
      maxC += b.confidence ?? 0;
      maxS += b.stability ?? 0;
    }
  });
  return { maxH, maxC, maxS };
}

function bandFromSlider(value01: number) {
  if (value01 < 0.2) return 0;
  if (value01 < 0.4) return 1;
  if (value01 <= 0.6) return 2;
  if (value01 <= 0.8) return 3;
  return 4;
}

export function scoreAnswers(ans: AnswerMap): Score {
  let h=0,c=0,s=0;
  questions.forEach(q => {
    const raw = ans[q.id];
    if (raw === undefined) return;
    if (q.kind === "choice") {
      const idx = raw;
      const w = q.options[idx]?.weights; if (!w) return;
      h += w.habits ?? 0; c += w.confidence ?? 0; s += w.stability ?? 0;
    } else {
      const v = Math.max(0, Math.min(100, raw));
      const band = bandFromSlider(v/100);
      const w = q.slider.bands[band];
      h += w.habits ?? 0; c += w.confidence ?? 0; s += w.stability ?? 0;
    }
  });
  const { maxH, maxC, maxS } = perDimMax();
  return {
    habits: h, confidence: c, stability: s,
    maxHabits: maxH, maxConfidence: maxC, maxStability: maxS,
    total: h + c + s, totalMax: maxH + maxC + maxS
  };
}

export function partialScore(ans: AnswerMap) { return scoreAnswers(ans); }

/* ---------- Five-bucket mapping ---------- */
export type Bucket5 = BucketKey5;
export function bucketize5(value: number, max: number): Bucket5 {
  const pct = (value / Math.max(1,max)) * 100;
  if (pct < 20) return "rebuilding";
  if (pct < 40) return "getting_started";
  if (pct < 60) return "progress";
  if (pct < 80) return "on_track";
  return "empowered";
}
