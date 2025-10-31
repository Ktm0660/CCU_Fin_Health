import { Question } from "@/data/assessment";
import { translateOptionLabel, type Locale } from "@/lib/locale";

export default function QuestionCard({
  q, locale, selectedIndex, onAnswer
}: {
  q: Question;
  locale: Locale;
  selectedIndex: number | undefined;
  onAnswer: (idx: number) => void;
}) {
  const t = (en: string, es: string) => (locale === "es" ? es || en : en);

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="font-medium text-ink-900">{t(q.text_en, q.text_es)}</p>

      <div className="mt-3 grid gap-2">
        {q.options.map((opt, i) => {
          const active = selectedIndex === i;
          const baseLabel = t(opt.text_en, opt.text_es);
          const label = translateOptionLabel(baseLabel, locale);
          return (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              className={[
                "text-left px-4 py-3 rounded-xl border transition",
                "hover:border-brand-400 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-400",
                active ? "border-brand-600 bg-brand-50" : "border-slate-300 bg-white"
              ].join(" ")}
              aria-pressed={active}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
