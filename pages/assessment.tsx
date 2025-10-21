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

  // Persist progress locally for mobile
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ccu_assessment");
      if (raw) {
        const { a, idx } = JSON.parse(raw);
        setAnswers(a || {});
        setI(typeof idx === "number" ? idx : 0);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("ccu_assessment", JSON.stringify({ a: answers, idx: i }));
    } catch {}
  }, [answers, i]);

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

  const tr = (en: string, es: string) => (loc === "en" ? en : es);

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {tr("Connections Financial Health & Trust Assessment", "Evaluación de Salud Financiera y Confianza")}
      </h1>

      {/* Progress header only (quiet mode) */}
      <div className="mb-4 flex items-center justify-between text-sm text-slate-700">
        <span>
          {tr("Question", "Pregunta")} {i + 1} {tr("of", "de")} {questions.length}
        </span>
        <div className="w-1/2">
          <Bar value={i + 1} max={questions.length} />
        </div>
      </div>

      {/* Question-only card */}
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
        <button onClick={back} disabled={i === 0} className="px-4 py-3 rounded-xl border disabled:opacity-50">
          {tr("Back", "Atrás")}
        </button>
        {i < questions.length - 1 ? (
          <button
            onClick={() => {
              if (q && answers[q.id] === undefined) return;
              next();
            }}
            className="px-4 py-3 rounded-xl bg-brand-500 text-white disabled:bg-slate-300"
            disabled={q ? answers[q.id] === undefined : true}
          >
            {tr("Next", "Siguiente")}
          </button>
        ) : (
          <button onClick={goResults} className="px-4 py-3 rounded-xl bg-brand-500 text-white" disabled={!done}>
            {tr("See my results", "Ver mis resultados")}
          </button>
        )}
      </div>
    </section>
  );
}
