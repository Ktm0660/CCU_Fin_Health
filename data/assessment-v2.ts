export type Weight = Partial<Record<"habits"|"confidence"|"stability"|"trust"|"resilience", number>>;
const w = (h=0,c=0,s=0,t=0,r=0): Weight => ({habits:h, confidence:c, stability:s, trust:t, resilience:r});

export type ChoiceOpt = { text_en:string; text_es:string; weights?: Weight };
export type ChoiceQ = { kind:"choice"; id:string; text_en:string; text_es:string; options: ChoiceOpt[] };
export type SliderQ = { kind:"slider"; id:string; text_en:string; text_es:string; left_en:string; left_es:string; right_en:string; right_es:string; weights?: Weight };
export type AnyQ = ChoiceQ | SliderQ;

export const questionsV2: AnyQ[] = [
  { kind:"choice", id:"q1", text_en:"Do you know where most of your money goes each month?", text_es:"¿Sabes a dónde va tu dinero cada mes?",
    options:[
      {text_en:"Yes, I track it closely", text_es:"Sí, lo registro de cerca", weights:w(3,1,1,0,0)},
      {text_en:"I have a general idea", text_es:"Tengo una idea general", weights:w(2,0,0,0,0)},
      {text_en:"Not really", text_es:"No mucho", weights:w(0,-1,-1,0,0)}
    ]},
  { kind:"slider", id:"q2", text_en:"How comfortable do you feel talking to a credit union about your money?",
    text_es:"¿Qué tan cómodo te sientes al hablar con una cooperativa sobre tu dinero?",
    left_en:"Uncomfortable", left_es:"Incómodo", right_en:"Very comfortable", right_es:"Muy cómodo", weights:w(0,2,0,2,0) }
];
