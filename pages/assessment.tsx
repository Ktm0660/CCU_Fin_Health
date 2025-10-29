import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { questions, AnswerMap } from "@/data/assessment";
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
export default function Assessment() {
  const { locale, push } = useRouter();
  const loc = (locale as "en"|"es") || "en";

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [i, setI] = useState(0); // current question index (one-at-a-time)

  const q = questions[i];
  useEffect(() => { saveAnswers(answers); }, [answers]);

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
    // Fill any unanswered with neutral defaults on submit
    const filled: AnswerMap = { ...answers };
    questions.forEach((q) => {
      if (filled[q.id] === undefined) {
        if ((q as any).kind === "slider") {
          // sliders are 0..4 buckets; middle is 2
          filled[q.id] = 2 as any;
        } else {
          // choice: pick middle option or 0 if only two
          const opts = (q as any).options || [];
          const mid = opts.length >= 3 ? Math.floor(opts.length / 2) : 0;
          filled[q.id] = mid;
        }
      }
    });

    // Persist answers for results page
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("ccu:lastAnswers", JSON.stringify(filled));
      }
    } catch {}

    push("/results");
  }

  return (
    <section className="motion-safe:animate-fade-in">
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

      {/* Navigation buttons */}
      <div className="mt-2 flex gap-2">
        <button onClick={back} disabled={i===0}
          className="px-3 py-2 rounded-lg border disabled:opacity-50 transition hover:bg-brand-50">
          {loc==="en" ? "Back" : "Atrás"}
        </button>
        {i < questions.length - 1 ? (
          <button
            onClick={() => {
              if (!q) return;
              if (answers[q.id] === undefined) return; // require an answer to proceed
              next();
            }}
            className="px-4 py-2 rounded-lg bg-brand-500 text-white disabled:bg-slate-300 shadow-soft hover:brightness-110 active:scale-[0.99] transition"
            disabled={answers[q.id] === undefined}
          >
            {loc==="en" ? "Next" : "Siguiente"}
          </button>
        ) : (
          <button
            id="see-results"
            onClick={goResults}
            className="px-4 py-2 rounded-lg bg-brand-500 text-white shadow-soft hover:brightness-110 active:scale-[0.99] transition"
          >
            {loc==="en" ? "See my results" : "Ver mis resultados"}
          </button>
        )}
      </div>
    </section>
  );
}
