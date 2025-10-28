import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import { questions, AnswerMap, partialScore, guidance } from "@/data/assessment";
import QuestionCard from "@/components/QuestionCard";
import { saveAnswers } from "@/lib/state";

function Bar({ value, max }: { value:number; max:number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1,max)) * 100)));
  return (
    <div className="h-2 rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

// Narrow type guard to detect multiple-choice questions
function hasOptions(q: any): q is { options: Array<{ weights: Partial<Record<"habits"|"confidence"|"stability", number>> }> } {
  return q && Array.isArray((q as any).options);
}

export default function Assessment() {
  const { locale, push } = useRouter();
  const loc = (locale as "en"|"es") || "en";

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [i, setI] = useState(0); // current question index (one-at-a-time)

  const q = questions[i];
  const done = Object.keys(answers).length === questions.length;

  const s = useMemo(() => partialScore(answers), [answers]);

  useEffect(() => { saveAnswers(answers); }, [answers]);

  const chosenIdx = (q ? (answers[q.id] as number | undefined) : undefined);

  // Tip logic:
  // - If multiple-choice: use the chosen option's strongest weight to select a tip
  // - If slider (no options): show a tip for the currently weakest dimension overall
  const tip = useMemo(() => {
    if (!q) return "";

    if (hasOptions(q) && chosenIdx !== undefined) {
      const w = q.options[chosenIdx]?.weights ?? {};
      const pairs = [
        ["habits", w.habits ?? 0],
        ["confidence", w.confidence ?? 0],
        ["stability", w.stability ?? 0],
      ] as [ "habits"|"confidence"|"stability", number ][];
      const best = [...pairs].sort((a,b)=>b[1]-a[1])[0][0];
      return guidance(best, (s as any)[best] ?? 0);
    }

    // Slider (or unanswered): nudge on weakest dimension so far
    const dims = [
      ["habits", s.maxHabits ? s.habits / s.maxHabits : 0],
      ["confidence", s.maxConfidence ? s.confidence / s.maxConfidence : 0],
      ["stability", s.maxStability ? s.stability / s.maxStability : 0],
    ] as [ "habits"|"confidence"|"stability", number ][];
    const weakest = [...dims].sort((a,b)=>a[1]-b[1])[0][0];
    return guidance(weakest, (s as any)[weakest] ?? 0);
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
    push("/results");
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

      {/* One-at-a-time question card */}
      {q && (
        <QuestionCard q={q} locale={loc as "en"|"es"} onAnswer={selectAnswer} />
      )}

      {/* Tip after choosing an option (or general nudge for sliders) */}
      {(chosenIdx !== undefined || !hasOptions(q)) && (
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
              if (!q) return;
              if (answers[q.id] === undefined) return; // require an answer to proceed
              next();
            }}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white disabled:bg-slate-300"
            disabled={!q || answers[q.id] === undefined}
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
