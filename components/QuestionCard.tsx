import { useState, useEffect } from "react";

// Minimal runtime guards; works even if types differ.
type AnyQ = Record<string, any>;
type Locale = "en" | "es";

function isChoice(q: AnyQ): boolean {
  return Array.isArray(q?.options);
}
function isSlider(q: AnyQ): boolean {
  return q?.kind === "slider" || (!isChoice(q) && typeof q === "object");
}

type Props = {
  q: AnyQ;
  locale: Locale;
  onAnswer: (idx: number) => void; // for sliders, 0..4 bucket
};

export default function QuestionCard({ q, locale, onAnswer }: Props) {
  const [sliderVal, setSliderVal] = useState<number>(2); // center default

  useEffect(() => {
    if (isSlider(q)) setSliderVal(2);
  }, [q]);

  // Resolve text fields safely
  const text_en = (q?.text_en as string) ?? "";
  const text_es = (q?.text_es as string) ?? "";
  const prompt = locale === "en" ? text_en : text_es;

  // Resolve slider labels with robust fallbacks
  const left_en =
    (q?.left_en as string) ??
    (q?.leftLabel_en as string) ??
    "Uncomfortable";
  const left_es =
    (q?.left_es as string) ??
    (q?.leftLabel_es as string) ??
    "Incómodo";
  const right_en =
    (q?.right_en as string) ??
    (q?.rightLabel_en as string) ??
    "Very comfortable";
  const right_es =
    (q?.right_es as string) ??
    (q?.rightLabel_es as string) ??
    "Muy cómodo";

  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-5">
      <p className="font-medium text-ink-900">{prompt}</p>

      {isChoice(q) ? (
        <div className="mt-3 grid gap-2">
          {q.options.map((opt: AnyQ, i: number) => (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              className="text-left px-4 py-3 rounded-xl border hover:border-brand-400 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              {locale === "en" ? (opt?.text_en ?? "") : (opt?.text_es ?? "")}
            </button>
          ))}
        </div>
      ) : isSlider(q) ? (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
            <span>{locale === "en" ? left_en : left_es}</span>
            <span>{locale === "en" ? right_en : right_es}</span>
          </div>
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={sliderVal}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSliderVal(v);
              onAnswer(v);
            }}
            className="w-full accent-brand-500"
            aria-label={prompt}
          />
          <div className="mt-2 h-1.5 rounded-full bg-slate-200">
            <div
              className="h-1.5 rounded-full bg-brand-200"
              style={{ width: `${(sliderVal / 4) * 100}%` }}
              aria-hidden
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
