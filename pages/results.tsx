import { useEffect, useMemo, useState } from "react";
import {
  getRandomizedQuestions,
  scoreAnswers,
  normalize0to100,
  type Pillar
} from "@/data/assessment";

function Stat({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / Math.max(1, max)) * 100);
  return (
    <div className="bg-white rounded-2xl shadow p-4 border">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold text-ink-900">{label}</h3>
        <span className="text-sm text-slate-600">{value} / {max} ({pct}%)</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Results() {
  const [payload, setPayload] = useState<{ order: any[]; answers: Record<string, number> } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ccu_assessment_payload");
      if (raw) setPayload(JSON.parse(raw));
    } catch {}
  }, []);

  const randomized = useMemo(() => {
    // We can't reconstruct the exact question/option order perfectly here without heavier persistence;
    // results use ids and weights, so order doesn't matter for scoring.
    return getRandomizedQuestions();
  }, []);

  const s = useMemo(() => {
    if (!payload) {
      return scoreAnswers(randomized, {}); // empty state
    }
    return scoreAnswers(randomized, payload.answers);
  }, [payload, randomized]);

  const labels: Record<Pillar, string> = {
    habits: "Habits",
    confidence: "Confidence",
    stability: "Stability",
    trust: "Trust & Access",
    resilience: "Resilience"
  };

  const overallPct = normalize0to100(s.total, s.totalMax);

  return (
    <section>
      <div className="bg-brand-50 border rounded-2xl p-5 mb-5">
        <h1 className="text-2xl font-semibold text-ink-900">Your Financial Health Snapshot</h1>
        <p className="mt-2 text-slate-700">
          This is a friendly snapshot of where you’re strong and where small changes could help most.
        </p>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall</span>
            <span className="text-sm text-slate-700">{s.total} / {s.totalMax} ({overallPct}%)</span>
          </div>
          <div className="mt-2 h-3 rounded-full bg-slate-200">
            <div className="h-3 rounded-full bg-brand-600" style={{ width: `${overallPct}%` }} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(labels) as Pillar[]).map(p => (
          <Stat key={p} label={labels[p]} value={s.byPillar[p]} max={s.maxByPillar[p]} />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-5 border mt-6">
        <h2 className="text-xl font-semibold text-ink-900">What to do next</h2>
        <p className="text-slate-700 mt-2">
          Pick one area below and take a small step this week. We’ll soon tailor lessons, tools, and products to your pattern.
        </p>
        <ul className="list-disc ml-6 space-y-2 mt-3">
          <li>Start a tiny emergency buffer ($50–$200) by auto-moving money on payday.</li>
          <li>Schedule bills and minimums; choose one “pay-down day” monthly.</li>
          <li>Use a simple spending list: needs first, then goals, then wants.</li>
        </ul>
      </div>
    </section>
  );
}
