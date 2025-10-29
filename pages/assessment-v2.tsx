import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// Very loose types so we never crash if the data module shape changes
type Weight = Partial<Record<"habits"|"confidence"|"stability"|"trust"|"resilience", number>>;
type ChoiceOpt = { text_en: string; text_es: string; weights?: Weight };
type ChoiceQ = { kind:"choice"; id:string; text_en:string; text_es:string; options: ChoiceOpt[] };
type SliderQ = { kind:"slider"; id:string; text_en:string; text_es:string; left_en:string; left_es:string; right_en:string; right_es:string; weights?: Weight };
type AnyQ = ChoiceQ | SliderQ;

function isChoice(q: AnyQ): q is ChoiceQ { return q.kind === "choice"; }

const LS_KEY = "assessmentV2Answers";

// Safe guards for browser-only features
const useIsMounted = () => {
  const [m, setM] = useState(false);
  useEffect(()=>{ setM(true); }, []);
  return m;
};

export default function AssessmentV2() {
  const mounted = useIsMounted();

  // Dynamically import questions to avoid build-time crashes if file moves/changes
  const [questions, setQuestions] = useState<AnyQ[]>([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mod = await import("@/data/assessment-v2");
        // Expect: mod.questionsV2 as AnyQ[]. Fall back gracefully.
        const arr: AnyQ[] = (mod as any).questionsV2 ?? (mod as any).questions ?? [];
        if (alive) setQuestions(Array.isArray(arr) ? arr : []);
      } catch (e) {
        console.error("Failed to import assessment-v2 data:", e);
        if (alive) setQuestions([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  // answers: record of qid -> index or slider bucket (0..4)
  const [answers, setAnswers] = useState<Record<string, number>>({});
  // Restore from localStorage AFTER mount
  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setAnswers(parsed);
      }
    } catch (e) {
      console.warn("Ignoring bad LS answers", e);
    }
  }, [mounted]);

  // Persist on change (debounced)
  const saveT = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!mounted) return;
    if (saveT.current) clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try { window.localStorage.setItem(LS_KEY, JSON.stringify(answers)); } catch {}
    }, 150);
    return () => { if (saveT.current) clearTimeout(saveT.current); };
  }, [answers, mounted]);

  const [i, setI] = useState(0);
  const q = questions[i];

  // progress %
  const pct = useMemo(() => {
    const total = Math.max(questions.length, 1);
    const answered = Object.keys(answers).length;
    return Math.min(100, Math.round((answered / total) * 100));
  }, [answers, questions.length]);

  // slider thumbs default at middle (2) for 5 buckets
  const sliderDefault = 2;
  const sliderValue = answers[q?.id ?? ""] ?? sliderDefault;

  // Handlers
  const answerChoice = (idx:number) => { if (!q) return; setAnswers(prev => ({...prev, [q.id]: idx})); };
  const answerSlider = (bucket:number) => { if (!q) return; setAnswers(prev => ({...prev, [q.id]: bucket})); };

  const canNext = q ? answers[q.id] !== undefined : false;
  const next = () => {
    if (!q) return;
    const nxt = Math.min(i + 1, questions.length - 1);
    setI(nxt);
  };
  const back = () => setI(p => Math.max(p - 1, 0));

  // Reset slider knob to middle whenever question changes AND current q is a slider
  useEffect(() => {
    if (!q) return;
    if (!isChoice(q)) {
      setAnswers(prev => (prev[q.id] === undefined ? {...prev, [q.id]: sliderDefault} : prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, q?.id]);

  return (
    <section className="p-4 max-w-3xl mx-auto">
      <div className="mb-3">
        <div className="h-2 bg-slate-200 rounded-full">
          <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: "var(--brand-500, #006a4e)" }} />
        </div>
        <div className="text-sm text-slate-600 mt-1">
          {Math.min(Object.keys(answers).length, questions.length)} / {questions.length || 0}
        </div>
      </div>

      {!q && (
        <div className="rounded-xl border p-6 bg-white">
          <h1 className="text-xl font-semibold">Loading the new checkup…</h1>
          <p className="text-slate-600 mt-2">If this hangs, the question file may be missing. Check <code>data/assessment-v2.ts</code> export.</p>
          <Link href="/" className="inline-block mt-4 px-4 py-2 rounded-lg border">Back home</Link>
        </div>
      )}

      {q && (
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-lg font-medium mb-3">{q.text_en ?? "Question"}</p>

          {isChoice(q) ? (
            <div className="grid gap-2">
              {q.options?.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => answerChoice(idx)}
                    className={`text-left px-4 py-3 rounded-xl border focus:outline-none ${selected ? "border-[var(--brand-500,#006a4e)] bg-[rgba(0,106,78,0.08)]" : "hover:bg-slate-50"}`}
                  >
                    {opt.text_en}
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
                <span>{(q as SliderQ).left_en}</span>
                <span>{(q as SliderQ).right_en}</span>
              </div>
              <input
                type="range"
                min={0}
                max={4}
                step={1}
                value={sliderValue}
                onChange={(e)=>answerSlider(parseInt(e.target.value,10))}
                className="w-full"
                aria-label="slider"
              />
            </div>
          )}

          <div className="flex gap-3 mt-5">
            <button onClick={back} disabled={i===0} className="px-4 py-2 rounded-xl border disabled:opacity-50">Back</button>
            {i < questions.length - 1 ? (
              <button onClick={next} disabled={!canNext} className="px-4 py-2 rounded-xl text-white" style={{background:"#006a4e"}}>
                Next
              </button>
            ) : (
              <Link href="/results-v2" className={`px-4 py-2 rounded-xl text-white ${!canNext ? "pointer-events-none opacity-60" : ""}`} style={{background:"#006a4e"}}>
                See my results
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
