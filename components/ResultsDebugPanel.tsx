import { useState } from "react";

import { type Pillar } from "@/data/assessment";
import { type Lang, type LangSource } from "@/lib/lang";
import { type PillarMetric } from "@/lib/resultsShared";

interface ResultsDebugPanelProps {
  show: boolean;
  answers: Record<string, any>;
  sourceKey: string;
  langMeta: { lang: Lang; source: LangSource };
  metrics?: Partial<Record<Pillar, PillarMetric>>;
}

export function ResultsDebugPanel({ show, answers, sourceKey, langMeta, metrics = {} }: ResultsDebugPanelProps) {
  const [expanded, setExpanded] = useState(false);
  if (!show) return null;

  return (
    <div className="mt-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-800">Debug info</div>
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className="text-xs underline"
        >
          {expanded ? "Hide" : "Show"}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="font-semibold">Answer source</div>
            <p className="text-slate-800">{sourceKey || "none"}</p>
          </div>

          <div>
            <div className="font-semibold">Language</div>
            <p className="text-slate-800">
              {langMeta.lang} ({langMeta.source})
            </p>
          </div>

          <div>
            <div className="font-semibold">Answers</div>
            <pre className="bg-white border rounded p-2 overflow-x-auto text-xs leading-snug">
              {JSON.stringify(answers || {}, null, 2)}
            </pre>
          </div>

          <div>
            <div className="font-semibold">Pillar metrics</div>
            <div className="grid md:grid-cols-2 gap-3">
              {(Object.keys(metrics) as Pillar[]).map(pillar => {
                const m = metrics[pillar];
                if (!m) return null;
                return (
                  <div key={pillar} className="rounded border bg-white p-2">
                    <div className="uppercase text-xs text-slate-600">{pillar}</div>
                    <div className="text-slate-800 text-sm">raw: {m.raw} / {m.max}</div>
                    <div className="text-slate-800 text-sm">pct: {m.pct}%</div>
                    <div className="text-slate-800 text-sm">bucket: {m.bucket}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
