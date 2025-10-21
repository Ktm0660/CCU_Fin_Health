import { useRouter } from "next/router";
import { useState } from "react";
import { questions, AnswerMap } from "@/data/assessment";
import QuestionCard from "@/components/QuestionCard";

export default function Assessment() {
  const { locale, push } = useRouter();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const loc = (locale as "en"|"es") || "en";

  function setAnswer(id:string, idx:number) {
    setAnswers(prev => ({ ...prev, [id]: idx }));
  }
  const done = Object.keys(answers).length === questions.length;

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-4">
        {loc==="en" ? "Connections Financial Health & Trust Assessment" : "Evaluación de Salud Financiera y Confianza"}
      </h1>
      {questions.map(q => (
        <QuestionCard key={q.id} q={q} locale={loc} onAnswer={(i)=>setAnswer(q.id,i)} />
      ))}
      <button
        disabled={!done}
        onClick={()=>push({ pathname:"/results", query:{ a: JSON.stringify(answers) } })}
        className="mt-4 px-5 py-3 rounded-xl bg-brand-500 text-white disabled:bg-slate-300"
      >
        {loc==="en" ? "See my results" : "Ver mis resultados"}
      </button>
    </section>
  );
}
