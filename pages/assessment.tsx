import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  getRandomizedQuestions,
  AnswerMap
} from "@/data/assessment";
import QuestionCard from "@/components/QuestionCard";
import { detectLocale } from "@/lib/locale";

function Bar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1, max)) * 100)));
  return (
    <div className="h-2 rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Assessment() {
  const router = useRouter();
  const locale = detectLocale(router.asPath, router.locale);

  // Freeze randomized questions for this session render
  const randomized = useMemo(() => getRandomizedQuestions(), []);
  const total = randomized.length;

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [i, setI] = useState(0);

  const q = randomized[i];
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
    // Persist both answers and the randomized question order so results can score correctly
    const payload = {
      order: randomized.map(qq => ({ id: qq.id, options: qq.options.map(o => o.text_en) })), // lightweight fingerprint
      answers
    };
    try {
      localStorage.setItem("ccu_assessment_payload", JSON.stringify(payload));
    } catch {}
    router.push("/results");
  }

  const selectedIndex = q ? (answers[q.id] as number | undefined) : undefined;

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {locale === "en"
          ? "Connections Financial Health & Trust Assessment"
          : "Evaluación de Salud Financiera y Confianza"}
      </h1>

      {/* Progress header */}
      <div className="mb-4 flex items-center justify-between text-sm text-slate-700">
        <span>{locale === "en" ? "Progress" : "Progreso"}: {i + 1} / {total}</span>
        <div className="w-1/2">
          <Bar value={i + 1} max={total} />
        </div>
      </div>

      {/* One-at-a-time question card */}
      {q && (
        <QuestionCard
          q={q}
          locale={locale}
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
          {locale === "en" ? "Back" : "Atrás"}
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
            {locale === "en" ? "Next" : "Siguiente"}
          </button>
        ) : (
          <button
            onClick={goResults}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white"
            disabled={!done}
          >
            {locale === "en" ? "See my results" : "Ver mis resultados"}
          </button>
        )}
      </div>

      {/* Friendly nudge */}
      <p className="text-xs text-slate-600 mt-3">
        {locale === "en"
          ? "No judgment—this is just a quick snapshot to guide next steps."
          : "Sin juicios—esto es una guía rápida para los próximos pasos."}
      </p>
    </section>
  );
}
