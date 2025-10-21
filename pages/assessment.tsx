import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { questions, AnswerMap, partialScore, guidance } from "@/data/assessment";
import QuestionCard from "@/components/QuestionCard";

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
  const [i, setI] = useState(0); // current question index (one-at-a-time)

  const q = questions[i];
  const done = Object.keys(answers).length === questions.length;

  const s = useMemo(() => partialScore(answers), [answers]);

  // Tip after each answer: pick the strongest-weighted dimension of the chosen option
  const chosenIdx = answers[q?.id ?? ""] as number | undefined;
  const tip = useMemo(() => {
    if (q && chosenIdx !== undefined) {
      const w = q.options[chosenIdx].weights;
      const pairs = [
        ["habits", w.habits ?? 0],
        ["confidence", w.confidence ?? 0],
        ["stability", w.stability ?? 0],
      ] as const;
      const best = pairs.sort((a,b)=>b[1]-a[1])[0][0] as "habits"|"confidence"|"stability";
      return guidance(best, (s as any)[best]);
    }
    return "";
  }, [q, chosenIdx, s]);

  function selectAnswer(idx:number) {
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: idx }));
  }

  function next() {
    setI(prev => Math.min(prev + 1, questions.length - 1));
  }
  function back() {
    setI(prev => Math.max(prev - 1, 0));
  }

  function goResults() {
    push({ pathname:"/results", query:{ a: JSON.stringify(answers) } });
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {loc==="en" ? "Connections Financial Health & Trust Assessment" : "Evaluación de Salud Financiera y Confianza"}
      </h1>

      {/* Progress header */}
      <div className="mb-4 flex items-center justify-between text-sm text-slate-700">
        <span>{loc==="en" ? "Progress" : "Progreso"}: {i+1} / {questions.length}</span>
        <div className="w-1/2">
          <Bar value={i+1} max={questions.length} />
        </div>
      </div>

      {/* Live snapshot */}
      <div className="bg-white rounded-2xl shadow p-4 border mb-5">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Habits</span>
              <span>{s.habits} / {s.maxHabits}</span>
            </div>
            <Bar value={s.habits} max={s.maxHabits} />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Confidence</span>
              <span>{s.confidence} / {s.maxConfidence}</span>
            </div>
            <Bar value={s.confidence} max={s.maxConfidence} />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Stability</span>
              <span>{s.stability} / {s.maxStability}</span>
            </div>
            <Bar value={s.stability} max={s.maxStability} />
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-700">
          {loc==="en"
            ? "Scores update as you go. No judgment—this is a quick snapshot to guide next steps."
            : "Los puntajes se actualizan mientras avanzas. Sin juicios—es una guía para los próximos pasos."}
        </p>
      </div>

      {/* One-at-a-time question card */}
      {q && (
        <QuestionCard q={q} locale={loc} onAnswer={selectAnswer} />
      )}

      {/* Tip after choosing an option */}
      {chosenIdx !== undefined && (
        <div className="bg-brand-50 border rounded-2xl p-4 text-sm text-slate-800 mb-4">
          <b>{loc==="en" ? "Why this matters:" : "Por qué importa:"}</b> {tip}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <button onClick={back} disabled={i===0}
          className="px-4 py-2 rounded-xl border disabled:opacity-50">
          {loc==="en" ? "Back" : "Atrás"}
        </button>
        {i < questions.length - 1 ? (
          <button
            onClick={() => {
              if (answers[q.id] === undefined) return; // require an answer to proceed
              next();
            }}
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
