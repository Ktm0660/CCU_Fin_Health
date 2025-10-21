import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { questions, AnswerMap } from "@/data/assessment";
import QuestionCard from "@/components/QuestionCard";

function Bar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1, max)) * 100)));
  return (
    <div className="h-2 rounded-full bg-slate-200" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Assessment() {
  const { locale, push } = useRouter();
  const loc = (locale as "en" | "es") || "en";

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [i, setI] = useState(0); // current question index
  const q = questions[i];
  const done = Object.keys(answers).length === questions.length;

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [i]);

  const chosenIdx = q ? (answers[q.id] as number | undefined) : undefined;

  function setAnswer(id: string, idx: number) {
    setAnswers((prev) => ({ ...prev, [id]: idx }));
  }
  function next() { setI((prev) => Math.min(prev + 1, questions.length - 1)); }
  function back() { setI((prev) => Math.max(prev - 1, 0)); }
  function goResults() { push({ pathname: "/results", query: { a: JSON.stringify(answers) } }); }

  const t = (en: string, es: string) => (loc === "en" ? en : es);

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {t("Connections Financial Health & Trust Assessment", "Evaluación de Salud Financiera y Confianza")}
      </h1>

      {/* Progress header only (no scores) */}
      <div className="mb-4 flex items-center justify-between text-sm text-slate-700">
        <span>
          {t("Question", "Pregunta")} {i + 1} {t("of", "de")} {questions.length}
        </span>
        <div className="w-1/2">
          <Bar value={i + 1} max={questions.length} />
        </div>
      </div>

      {/* Question-only card (quiet mode) */}
      {q && (
        <QuestionCard
          q={q}
          locale={loc}
          selectedIdx={chosenIdx}
          onAnswer={(idx) => setAnswer(q.id, idx)}
        />
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <button onClick={back} disabled={i === 0} className="px-4 py-2 rounded-xl border disabled:opacity-50">
          {t("Back", "Atrás")}
        </button>
        {i < questions.length - 1 ? (
          <button
            onClick={() => {
              if (q && answers[q.id] === undefined) return;
              next();
            }}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white disabled:bg-slate-300"
            disabled={q ? answers[q.id] === undefined : true}
          >
            {t("Next", "Siguiente")}
          </button>
        ) : (
          <button onClick={goResults} className="px-4 py-2 rounded-xl bg-brand-500 text-white" disabled={!done}>
            {t("See my results", "Ver mis resultados")}
          </button>
        )}
      </div>
    </section>
  );
}
