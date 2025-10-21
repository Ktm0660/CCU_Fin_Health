import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import { questions, AnswerMap, partialScore, guidance } from "@/data/assessment";
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
  const s = useMemo(() => partialScore(answers), [answers]);

  // On question change, scroll to top so users always see the question & progress
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [i]);

  const chosenIdx = q ? (answers[q.id] as number | undefined) : undefined;

  const tip = useMemo(() => {
    if (q && chosenIdx !== undefined) {
      const w = q.options[chosenIdx].weights;
      const scores = {
        habits: w.habits ?? 0,
        confidence: w.confidence ?? 0,
        stability: w.stability ?? 0,
      } as const;

      let best: "habits" | "confidence" | "stability" = "habits";
      if (scores.confidence > scores[best]) best = "confidence";
      if (scores.stability > scores[best]) best = "stability";

      return guidance(best, (s as any)[best]);
    }
    return "";
  }, [q, chosenIdx, s]);

  function setAnswer(id: string, idx: number) {
    setAnswers((prev) => ({ ...prev, [id]: idx }));
  }

  function next() {
    setI((prev) => Math.min(prev + 1, questions.length - 1));
  }
  function back() {
    setI((prev) => Math.max(prev - 1, 0));
  }
  function goResults() {
    push({ pathname: "/results", query: { a: JSON.stringify(answers) } });
  }

  const t = (en: string, es: string) => (loc === "en" ? en : es);

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {t("Connections Financial Health & Trust Assessment", "Evaluación de Salud Financiera y Confianza")}
      </h1>

      {/* Progress header */}
      <div className="mb-4 flex items-center justify-between text-sm text-slate-700">
        <span>
          {t("Question", "Pregunta")} {i + 1} {t("of", "de")} {questions.length}
        </span>
        <div className="w-1/2">
          <Bar value={i + 1} max={questions.length} />
        </div>
      </div>

      {/* Live snapshot */}
      <div className="bg-white rounded-2xl shadow p-4 border mb-5">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Habits</span>
              <span>
                {s.habits} / {s.maxHabits}
              </span>
            </div>
            <Bar value={s.habits} max={s.maxHabits} />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Confidence</span>
              <span>
                {s.confidence} / {s.maxConfidence}
              </span>
            </div>
            <Bar value={s.confidence} max={s.maxConfidence} />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Stability</span>
              <span>
                {s.stability} / {s.maxStability}
              </span>
            </div>
            <Bar value={s.stability} max={s.maxStability} />
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-700">
          {t(
            "Scores update as you go. No judgment—this is a quick snapshot to guide next steps.",
            "Los puntajes se actualizan mientras avanzas. Sin juicios—es una guía para los próximos pasos."
          )}
        </p>
      </div>

      {/* One-at-a-time question card */}
      {q && (
        <QuestionCard
          q={q}
          locale={loc}
          selectedIdx={chosenIdx}
          onAnswer={(idx) => setAnswer(q.id, idx)}
        />
      )}

      {/* Show the currently selected answer (if any) */}
      {chosenIdx !== undefined && q && (
        <div className="bg-brand-50 border rounded-2xl p-4 text-sm text-slate-800 mb-4">
          <b>{t("Selected:", "Seleccionado:")}</b>{" "}
          {loc === "en" ? q.options[chosenIdx].text_en : q.options[chosenIdx].text_es}
          <div className="mt-2 text-slate-700">
            <b>{t("Why this matters:", "Por qué importa:")}</b> {tip}
          </div>
        </div>
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
