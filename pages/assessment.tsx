import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { guideQuestions, pick, type GuideAnswers } from "@/data/guide";
import { questionsForAnswers, scoreGuideAnswers } from "@/lib/guideScoring";
import { saveDraftAnswers, saveLocalPlan } from "@/lib/localPlanStorage";
import { getLangFromQueryOrStorage, type Lang } from "@/lib/lang";

function Bar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1, max)) * 100)));
  return <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} /></div>;
}

export default function Assessment() {
  const { push } = useRouter();
  const lang = (typeof window !== "undefined" ? getLangFromQueryOrStorage() : "en") as Lang;
  const T = (en: string, es: string) => lang === "es" ? es : en;
  const [answers, setAnswers] = useState<GuideAnswers>({});
  const [i, setI] = useState(0);
  const questions = useMemo(() => questionsForAnswers(answers), [answers]);
  const q = questions[i] ?? questions[0];
  const selected = q ? answers[q.id] : undefined;
  const total = questions.length;

  function selectAnswer(optionId: string) {
    setAnswers(prev => ({ ...prev, [q.id]: optionId }));
  }

  function next() {
    setI(prev => Math.min(prev + 1, total - 1));
  }

  function back() {
    setI(prev => Math.max(prev - 1, 0));
  }

  function finish() {
    const result = scoreGuideAnswers(answers);
    saveDraftAnswers(answers);
    saveLocalPlan(result);
    push({ pathname: "/results", query: { lang } });
  }

  return (
    <section className="py-6">
      <div className="rounded-3xl border bg-white p-5 shadow md:p-7">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{T("Money check-in", "Revisión de dinero")}</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink-900">{T("Answer a few questions. Get a practical next step.", "Responde unas preguntas. Obtén un próximo paso práctico.")}</h1>
        <p className="mt-3 text-slate-700">{T("This is anonymous and saved only on this device/browser so you can come back later.", "Esto es anónimo y se guarda solo en este dispositivo/navegador para que puedas volver después.")}</p>
        <div className="mt-5 flex items-center justify-between gap-4 text-sm text-slate-700">
          <span>{T("Progress", "Progreso")}: {i + 1} / {total}</span>
          <div className="w-1/2"><Bar value={i + 1} max={total} /></div>
        </div>
      </div>

      {q && <div className="mt-5 rounded-3xl border bg-white p-5 shadow md:p-7">
        <h2 className="text-2xl font-semibold leading-tight text-ink-900">{pick(q.prompt, lang)}</h2>
        <div className="mt-5 grid gap-3">
          {q.options.map(option => (
            <button key={option.id} onClick={() => selectAnswer(option.id)} className={`rounded-2xl border p-4 text-left transition ${selected === option.id ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200" : "bg-white hover:bg-slate-50"}`}>
              {pick(option.label, lang)}
            </button>
          ))}
        </div>
      </div>}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button onClick={back} disabled={i === 0} className="rounded-xl border px-4 py-3 font-semibold disabled:opacity-50">{T("Back", "Atrás")}</button>
        {i < total - 1 ? (
          <button onClick={next} disabled={!selected} className="rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white disabled:bg-slate-300">{T("Next", "Siguiente")}</button>
        ) : (
          <button onClick={finish} disabled={!selected} className="rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white disabled:bg-slate-300">{T("See my money plan", "Ver mi plan")}</button>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-600">{T("You will answer no more than 16 questions. Do not enter account numbers, Social Security numbers, or other sensitive information.", "Responderás no más de 16 preguntas. No ingreses números de cuenta, Seguro Social u otra información sensible.")}</p>
    </section>
  );
}
