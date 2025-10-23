import { SliderQuestion } from "@/data/assessment";

export default function SliderQuestionCard({
  q, locale, value, onChange
}: {
  q: SliderQuestion;
  locale: "en"|"es";
  value?: number; // 0..100
  onChange: (v:number)=>void;
}) {
  const L = (en:string, es:string)=> locale==="en" ? en : es;
  const left = L(q.slider.leftLabel_en, q.slider.leftLabel_es);
  const right = L(q.slider.rightLabel_en, q.slider.rightLabel_es);

  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-5 border">
      <p className="font-medium text-ink-900 text-lg">{L(q.text_en, q.text_es)}</p>
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
          <span>{left}</span>
          <span>{right}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value ?? 50}
          onChange={(e)=> onChange(Number(e.target.value))}
          className="w-full accent-brand-500"
          aria-label={L(q.text_en, q.text_es)}
        />
      </div>
    </div>
  );
}
