import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import { questions, AnswerMap, partialScore, guidance } from "@/data/assessment";
import QuestionCard from "@/components/QuestionCard";
import SliderQuestionCard from "@/components/SliderQuestion";
import { saveAnswers } from "@/lib/state";

function Bar({ value, max }: { value:number; max:number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1,max)) * 100)));
  return (
    <div className="h-2 rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Assessment() {
  const { locale, push } = useRouter();
  const loc = (locale as "en"|"es") || "en";

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [i, setI] = useState(0);
  const q = questions[i];
  const done = Object.keys(answers).length === questions.length;
  const s = useMemo(() => partialScore(answers), [answers]);

  useEffect(() => { saveAnswers(answers); }, [answers]);

  const chosenIdx = q && q.kind === "choice" ? (answers[q.id] as number | undefined) : undefined;
  const sliderVal = q && q.kind === "slider" ? (answers[q.id] as number | undefined) : undefined;
  const tip = useMemo(() => {
    if (q && chosenIdx !== undefined) {
      const w = q.options[chosenIdx].weights;
      const pairs = [
        ["habits", w.habits ?? 0],
        ["confidence", w.confidence ?? 0],
        ["stability", w.stability ?? 0],
      ] as [ "habits"|"confidence"|"stability", number ][];
      const best = [...pairs].sort((a,b)=>b[1]-a[1])[0][0];
      const g = guidance(best, (s as any)[best]);
      return g?.[loc] ?? "";
    }
    return "";
  }, [q, chosenIdx, s, loc]);

  function selectAnswer(idx:number) {
    if (!q || q.kind !== "choice") return;
    setAnswers(prev => ({ ...prev, [q.id]: idx }));
  }
  function setSlider(val:number) {
    if (!q || q.kind !== "slider") return;
    setAnswers(prev => ({ ...prev, [q.id]: val }));
  }
  function next() { setI(p => Math.min(p + 1, questions.length - 1)); }
  function back() { setI(p => Math.max(p - 1, 0)); }
  function goResults() { push("/results"); }

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {loc==="en" ? "Connections Financial Health & Trust Assessment" : "Evaluación de Salud Financiera y Confianza"}
      </h1>

      <div className="mb-4 flex items-center justify-between text-sm text-slate-700">
        <span>{loc==="en" ? "Progress" : "Progreso"}: {i+1} / {questions.length}</span>
        <div className="w-1/2">
          <Bar value={i+1} max={questions.length} />
        </div>
      </div>

      {q && q.kind === "choice" && (
        <QuestionCard q={q} locale={loc} selectedIdx={chosenIdx} onAnswer={selectAnswer} />
      )}
      {q && q.kind === "slider" && (
        <SliderQuestionCard
          q={q}
          locale={loc}
          value={sliderVal ?? 50}
          onChange={setSlider}
        />
      )}

      {chosenIdx !== undefined && (
        <div className="bg-brand-50 border rounded-2xl p-4 text-sm text-slate-800 mb-4">
          <b>{loc==="en" ? "Why this matters:" : "Por qué importa:"}</b> {tip}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={back} disabled={i===0} className="px-4 py-2 rounded-xl border disabled:opacity-50">
          {loc==="en" ? "Back" : "Atrás"}
        </button>
        {i < questions.length - 1 ? (
          <button
            onClick={() => { if (answers[q.id] === undefined) return; next(); }}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white disabled:bg-slate-300"
            disabled={answers[q.id] === undefined}
          >
            {loc==="en" ? "Next" : "Siguiente"}
          </button>
        ) : (
          <button
            onClick={goResults}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white"
            disabled={!done}
          >
            {loc==="en" ? "See my results" : "Ver mis resultados"}
          </button>
        )}
      </div>
    </section>
  );
}
