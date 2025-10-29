import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Pillar = "habits"|"confidence"|"stability"|"trust"|"resilience";
type Weight = Partial<Record<Pillar, number>>;

const LS_KEY = "assessmentV2Answers";

function sum(obj: Record<string, number>) { return Object.values(obj).reduce((a,b)=>a+(typeof b==="number"?b:0),0); }

export default function ResultsV2() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [metrics, setMetrics] = useState<Weight>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === "object") setAnswers(parsed);
    } catch {}
  }, []);

  // Compute simple placeholder metrics so page never crashes even if data module changes.
  const total = useMemo(() => sum(answers), [answers]);
  useEffect(() => {
    // Map the raw total into pseudo buckets across pillars so UI has content
    // (Your real scoring logic can be wired here; this prevents runtime crashes.)
    const base = Math.max(0, total);
    const m: Weight = {
      habits: Math.round(base * 0.25),
      confidence: Math.round(base * 0.22),
      stability: Math.round(base * 0.22),
      trust: Math.round(base * 0.16),
      resilience: Math.round(base * 0.15),
    };
    setMetrics(m);
  }, [total]);

  return (
    <section className="p-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">Your snapshot</h1>
        <p className="text-slate-700 mt-2">
          Here’s a quick read on your money picture. This isn’t a judgment—just a map for next steps.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-5">
          {Object.entries(metrics).map(([k,v])=> (
            <div key={k} className="rounded-xl border p-4 bg-slate-50">
              <div className="flex items-center justify-between">
                <b className="capitalize">{k}</b>
                <span className="text-sm text-slate-600">{v}</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full mt-2">
                <div className="h-2 rounded-full" style={{width:`${Math.min(100, v)}%`, background:"#006a4e"}} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/tools" className="px-4 py-2 rounded-xl border">Tools & resources</Link>
          <Link href="/" className="px-4 py-2 rounded-xl text-white" style={{background:"#006a4e"}}>Home</Link>
        </div>
      </div>
    </section>
  );
}
