import { useState, useEffect } from "react";
// Import union types if they exist; otherwise this still works at runtime.
import type { 
  // These names come from data/assessment; if they differ, adjust accordingly.
  ChoiceQuestion, 
  SliderQuestion 
} from "@/data/assessment";

type Props = {
  q: ChoiceQuestion | SliderQuestion;
  locale: "en" | "es";
  onAnswer: (idx: number) => void; // For sliders, idx is 0..4 bucket
};

// Type guards
function isChoice(q: ChoiceQuestion | SliderQuestion): q is ChoiceQuestion {
  return (q as any).kind === "choice" && Array.isArray((q as any).options);
}
function isSlider(q: ChoiceQuestion | SliderQuestion): q is SliderQuestion {
  return (q as any).kind === "slider";
}

export default function QuestionCard({ q, locale, onAnswer }: Props) {
  // Local slider value so the thumb reflects user drag before parent advances.
  const [sliderVal, setSliderVal] = useState<number>(2); // center by default

  useEffect(() => {
    // Reset slider to center whenever we get a new slider question
    if (isSlider(q)) setSliderVal(2);
  }, [q]);

  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-5">
      <p className="font-medium text-ink-900">
        {locale === "en" ? (q as any).text_en : (q as any).text_es}
      </p>

      {isChoice(q) ? (
        <div className="mt-3 grid gap-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              className="text-left px-4 py-3 rounded-xl border hover:border-brand-400 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              {locale === "en" ? opt.text_en : opt.text_es}
            </button>
          ))}
        </div>
      ) : isSlider(q) ? (
        <div className="mt-4">
          {/* Left/Right labels only, no ticks or numeric marks */}
          <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
            <span>{locale === "en" ? q.left_en : q.left_es}</span>
            <span>{locale === "en" ? q.right_en : q.right_es}</span>
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
              onAnswer(v); // 0..4 bucket
            }}
            className="w-full accent-brand-500"
            aria-label={locale === "en" ? (q as any).text_en : (q as any).text_es}
          />
          {/* Subtle rail */}
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
