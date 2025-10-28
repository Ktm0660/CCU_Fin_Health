import { useEffect, useState } from "react";

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
  // Resolve text fields safely
  const text_en = (q?.text_en as string) ?? "";
  const text_es = (q?.text_es as string) ?? "";
  const prompt = locale === "en" ? text_en : text_es;

  const [sliderValue, setSliderValue] = useState(50);

  useEffect(() => {
    setSliderValue(50);
  }, [q]);

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

  if (isSlider(q)) {
    return (
      <div className="bg-white rounded-2xl shadow p-5 mb-3 md:mb-4">
        <p className="font-medium text-ink-900">{prompt}</p>

        {/* Left/Right labels only */}
        <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
          <span>{locale === "en" ? left_en : left_es}</span>
          <span>{locale === "en" ? right_en : right_es}</span>
        </div>

        {/* Single clean track, free drag, larger thumb */}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={sliderValue}
          onChange={(e) => {
            const val = Number(e.target.value);
            setSliderValue(val);
            const bucket = Math.min(4, Math.max(0, Math.floor(val / 20)));
            onAnswer(bucket);
          }}
          className="mt-3 w-full appearance-none rounded-full"
          aria-label={locale==="en" ? "Select your position" : "Selecciona tu posición"}
        />
      </div>
    );
  }

  if (isChoice(q)) {
    return (
      <div className="bg-white rounded-2xl shadow p-5 mb-3 md:mb-4">
        <p className="font-medium text-ink-900">{prompt}</p>
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
      </div>
    );
  }

  return null;
}
