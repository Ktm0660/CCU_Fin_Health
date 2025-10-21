import { Question } from "@/data/assessment";

export default function QuestionCard({
  q, locale, onAnswer
}: { q: Question; locale: "en"|"es"; onAnswer: (idx:number)=>void }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-5">
      <p className="font-medium text-ink-900">{locale==="en" ? q.text_en : q.text_es}</p>
      <div className="mt-3 grid gap-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            className="text-left px-4 py-3 rounded-xl border hover:border-brand-400 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            {locale==="en" ? opt.text_en : opt.text_es}
          </button>
        ))}
      </div>
    </div>
  );
}
