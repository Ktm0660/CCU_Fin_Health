import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  questions_v2, QV2, AnswersV2, shuffle
} from "@/data/assessment_v2";

function hasOptions(q: QV2): q is Extract<QV2,{kind:"choice"}> {
  return q.kind === "choice";
}

export default function AssessmentV2() {
  const { locale, push } = useRouter();
  const loc = (locale as "en"|"es") || "en";

  // Shuffle questions and options once per mount
  const [order, setOrder] = useState<QV2[]>([]);
  useEffect(() => {
    const randomized = shuffle(questions_v2).map((qu) =>
      qu.kind === "choice"
        ? { ...qu, options: shuffle(qu.options) }
        : qu
    );
    setOrder(randomized);
  }, []);

  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<AnswersV2>({});

  const q = order[i];
  const total = order.length;

  const shouldSkip = (qq: QV2) => {
    if (!qq.skipIf) return false;
    const v = answers[qq.skipIf.key];
    return v === qq.skipIf.equals;
  };

  const requiredTotal = order.filter(item => !shouldSkip(item)).length || total || 0;
  function selectChoice(idx: number) {
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: idx }));
  }
  function selectSlider(bucket: number) {
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: bucket }));
  }

  function next() {
    setI(prev => Math.min(prev + 1, total - 1));
  }
  function back() {
    setI(prev => Math.max(prev - 1, 0));
  }

  function submit() {
    try { localStorage.setItem("ccu:v2:answers", JSON.stringify(answers)); } catch {}
    push("/results-v2");
  }

  if (!q) return <div className="p-6">{loc==="en"?"Loading…":"Cargando…"}</div>;

  // If current question should be skipped, auto-advance
  useEffect(() => {
    if (q && shouldSkip(q)) {
      setTimeout(() => next(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q?.id]);

  useEffect(() => {
    if (q && q.kind === "slider" && answers[q.id] === undefined && !shouldSkip(q)) {
      setAnswers(prev => ({ ...prev, [q.id]: 2 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q?.id]);

  return (
    <section className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-700">
          {loc==="en"?"Progress":"Progreso"}: {i+1} / {total}
        </span>
        <div className="w-1/2 h-2 rounded-full bg-slate-200">
          <div className="h-2 rounded-full" style={{ width: `${Math.round(((i+1)/Math.max(1,total))*100)}%`, background: "var(--ccu-green)" }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow p-4">
        <p className="font-medium">
          {loc==="en" ? q.text_en : q.text_es}
        </p>

        {hasOptions(q) ? (
          <div className="mt-3 grid gap-2">
            {q.options.map((opt, idx) => (
              <button key={idx}
                onClick={() => selectChoice(idx)}
                className={`text-left px-4 py-3 rounded-xl border hover:bg-brand-50 ${answers[q.id]===idx ? "border-brand-500" : ""}`}>
                {loc==="en" ? opt.text_en : opt.text_es}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
              <span>{loc==="en" ? q.left_en : q.left_es}</span>
              <span>{loc==="en" ? q.right_en : q.right_es}</span>
            </div>
            <input
              type="range" min={0} max={4} step={1}
              value={answers[q.id] ?? 2}
              onChange={e => selectSlider(parseInt(e.target.value))}
              className="w-full h-3 rounded-lg accent-[var(--ccu-green)]"
            />
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <button onClick={back} disabled={i===0} className="px-4 py-2 rounded-xl border disabled:opacity-50">
            {loc==="en"?"Back":"Atrás"}
          </button>
          {i < total - 1 ? (
            <button
              onClick={() => {
                // require an answer to move on
                if (answers[q.id] === undefined) return;
                next();
              }}
              className="px-4 py-2 rounded-xl text-white"
              style={{ background: "var(--ccu-green)" }}
              disabled={answers[q.id] === undefined}
            >
              {loc==="en"?"Next":"Siguiente"}
            </button>
          ) : (
            <button
              onClick={submit}
              className="px-4 py-2 rounded-xl text-white"
              style={{ background: "var(--ccu-green)" }}
              disabled={Object.keys(answers).length < requiredTotal}
            >
              {loc==="en"?"See my results":"Ver mis resultados"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
