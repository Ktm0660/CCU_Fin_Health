import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  questionsBase,
  AnswerMap,
} from "@/data/assessment";
import QuestionCard from "@/components/QuestionCard";
import { getLangFromQueryOrStorage } from "@/lib/lang";
import { saveAnswers } from "@/lib/state";

function Bar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1, max)) * 100)));
  return (
    <div className="h-2 rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Assessment() {
  const { push } = useRouter();
  const lang = typeof window !== "undefined" ? getLangFromQueryOrStorage() : "en";
  const loc = (lang === "es" ? "es" : "en") as "en" | "es";

  const questions = useMemo(() => questionsBase, []);
  const total = questions.length;

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [i, setI] = useState(0);

  const q = questions[i];
  const done = Object.keys(answers).length === total;

  function selectAnswer(idx: number) {
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: idx }));
  }

  function next() {
    setI(prev => Math.min(prev + 1, total - 1));
  }
  function back() {
    setI(prev => Math.max(prev - 1, 0));
  }

  function goResults() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("lastAnswers", JSON.stringify(answers));
        saveAnswers({ answers });
      } catch {}
    }
    push({ pathname: "/results", query: { lang, a: JSON.stringify(answers) } });
  }

  const selectedIndex = q ? (answers[q.id] as number | undefined) : undefined;

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {loc === "en"
          ? "Connections Financial Health & Trust Assessment"
          : "Evaluación de Salud Financiera y Confianza"}
      </h1>

      {/* Progress header */}
      <div className="mb-4 flex items-center justify-between text-sm text-slate-700">
        <span>{loc === "en" ? "Progress" : "Progreso"}: {i + 1} / {total}</span>
        <div className="w-1/2">
          <Bar value={i + 1} max={total} />
        </div>
      </div>

      {/* One-at-a-time question card */}
      {q && (
        <QuestionCard
          q={q}
          locale={loc}
          selectedIndex={selectedIndex}
          onAnswer={selectAnswer}
        />
      )}

      {/* Nav buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={back}
          disabled={i === 0}
          className="px-4 py-2 rounded-xl border disabled:opacity-50"
        >
          {loc === "en" ? "Back" : "Atrás"}
        </button>

        {i < total - 1 ? (
          <button
            onClick={() => {
              if (selectedIndex === undefined) return;
              next();
            }}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white disabled:bg-slate-300"
            disabled={selectedIndex === undefined}
          >
            {loc === "en" ? "Next" : "Siguiente"}
          </button>
        ) : (
          <button
            onClick={goResults}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white"
            disabled={!done}
          >
            {loc === "en" ? "See my results" : "Ver mis resultados"}
          </button>
        )}
      </div>

      {/* Friendly nudge */}
      <p className="text-xs text-slate-600 mt-3">
        {loc === "en"
          ? "No judgment—this is just a quick snapshot to guide next steps."
          : "Sin juicios—esto es una guía rápida para los próximos pasos."}
      </p>
    </section>
  );
}
