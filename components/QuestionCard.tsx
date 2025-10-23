import { ChoiceQuestion } from "@/data/assessment";
import clsx from "clsx";

export default function QuestionCard({
  q,
  locale,
  selectedIdx,
  onAnswer
}: {
  q: ChoiceQuestion;
  locale: "en" | "es";
  selectedIdx?: number;
  onAnswer: (idx: number) => void;
}) {
  const t = (en: string, es: string) => (locale === "en" ? en : es);
  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-5 border">
      <p className="font-medium text-ink-900 text-lg">{t(q.text_en, q.text_es)}</p>
      <div className="mt-3 grid gap-2">
        {q.options.map((opt, i) => {
          const isSelected = selectedIdx === i;
          return (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              aria-pressed={isSelected}
              className={clsx(
                "text-left px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-colors",
                "text-base",
                isSelected
                  ? "border-brand-500 bg-brand-50 focus:ring-brand-400"
                  : "hover:border-brand-400 hover:bg-brand-50 focus:ring-brand-300"
              )}
            >
              {t(opt.text_en, opt.text_es)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
