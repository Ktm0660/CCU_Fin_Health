import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { pick, type GuideAnswers } from "@/data/guide";
import { questionsForAnswers, scoreGuideAnswers } from "@/lib/guideScoring";
import { saveDraftAnswers, saveLocalPlan } from "@/lib/localPlanStorage";
import { getLangFromQueryOrStorage, type Lang } from "@/lib/lang";

export default function Assessment() {
  const { push } = useRouter();
  const lang = (typeof window !== "undefined" ? getLangFromQueryOrStorage() : "en") as Lang;
  const T = (en: string, es: string) => lang === "es" ? es : en;
  const [answers, setAnswers] = useState<GuideAnswers>({});
  const [i, setI] = useState(0);
  const questions = useMemo(() => questionsForAnswers(answers), [answers]);
  const q = questions[i] ?? questions[0];
  const value = q ? answers[q.id] : undefined;

  function setAnswer(next: string | string[]) { setAnswers(prev => ({ ...prev, [q.id]: next })); }
  function toggleMulti(id: string) {
    const current = Array.isArray(value) ? value : [];
    const exists = current.includes(id);
    const next = exists ? current.filter(x => x !== id) : [...current, id].slice(0, q.maxSelections ?? 99);
    setAnswer(next);
  }
  function hasAnswer() { return q.inputType === "text" || (Array.isArray(value) ? value.length > 0 : Boolean(value)); }
  function next() { setI(prev => Math.min(prev + 1, questions.length - 1)); }
  function back() { setI(prev => Math.max(prev - 1, 0)); }
  function finish() { const result = scoreGuideAnswers(answers); saveDraftAnswers(answers); saveLocalPlan(result); push({ pathname: "/results", query: { lang } }); }
  const isLast = i >= questions.length - 1;
  const stageLabel = q?.stage === "profile" ? T("Personalize your plan", "Personaliza tu plan") : T("Money check-in", "Revisión de dinero");

  return (
    <section className="py-6">
      <div className="rounded-3xl border bg-white p-5 shadow md:p-7">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{stageLabel}</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink-900">{T("Start with what matters most right now.", "Empieza con lo que más importa ahora.")}</h1>
        <p className="mt-3 text-slate-700">{T("Your answers help personalize your plan. You are in control of what you share, and you can update your plan as life changes.", "Tus respuestas ayudan a personalizar tu plan. Tú controlas lo que compartes y puedes actualizar tu plan cuando cambie la vida.")}</p>
        <div className="mt-5 text-sm font-medium text-slate-700">{T("Step", "Paso")} {i + 1}</div>
      </div>

      {q && <div className="mt-5 rounded-3xl border bg-white p-5 shadow md:p-7">
        <h2 className="text-2xl font-semibold leading-tight text-ink-900">{pick(q.prompt, lang)}</h2>
        {q.helper && <p className="mt-2 text-sm text-slate-600">{pick(q.helper, lang)}</p>}
        {q.inputType === "text" ? (
          <input value={typeof value === "string" ? value : ""} onChange={e => setAnswer(e.target.value)} className="mt-5 w-full rounded-2xl border px-4 py-3" placeholder={T("Preferred name", "Nombre preferido")} />
        ) : (
          <div className="mt-5 grid gap-3">
            {q.options.map(option => {
              const selected = Array.isArray(value) ? value.includes(option.id) : value === option.id;
              return <button key={option.id} onClick={() => q.inputType === "multi" ? toggleMulti(option.id) : setAnswer(option.id)} className={`rounded-2xl border p-4 text-left transition ${selected ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200" : "bg-white hover:bg-slate-50"}`}>{pick(option.label, lang)}</button>;
            })}
          </div>
        )}
        {q.inputType === "multi" && <p className="mt-3 text-sm text-slate-600">{q.maxSelections ? T(`Choose up to ${q.maxSelections}.`, `Elige hasta ${q.maxSelections}.`) : T("Choose any that apply.", "Elige las que apliquen.")}</p>}
      </div>}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button onClick={back} disabled={i === 0} className="rounded-xl border px-4 py-3 font-semibold disabled:opacity-50">{T("Back", "Atrás")}</button>
        {!isLast ? <button onClick={next} disabled={!hasAnswer()} className="rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white disabled:bg-slate-300">{T("Next", "Siguiente")}</button> : <button onClick={finish} disabled={!hasAnswer()} className="rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white disabled:bg-slate-300">{T("See my action plan", "Ver mi plan de acción")}</button>}
      </div>
    </section>
  );
}
