import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { scoreAnswersV2, labelFor, personaFrom, personaCopy, AnswersV2, Pillar } from "@/data/assessment_v2";

const BUCKET_LABELS = {
  en: {
    "Needs Focus": "Needs Focus",
    "Building": "Building",
    "Solid": "Solid",
    "Strong": "Strong",
  },
  es: {
    "Needs Focus": "Necesita enfoque",
    "Building": "En desarrollo",
    "Solid": "Sólido",
    "Strong": "Fuerte",
  },
};

type BucketKey = keyof typeof BUCKET_LABELS["en"];

function Bar({ label, value, locale }: { label: string; value: number; locale: "en" | "es" }) {
  const pct = Math.max(0, Math.min(100, value));
  const bucket = labelFor(pct);
  const badge = BUCKET_LABELS[locale][bucket as BucketKey] ?? bucket;
  return (
    <div className="bg-white border rounded-2xl p-4 shadow">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold">{label}</h3>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(11,20,67,0.06)", color: "var(--ccu-blue)" }}>
          {badge}
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: "var(--ccu-green)" }} />
      </div>
    </div>
  );
}

export default function ResultsV2() {
  const { locale } = useRouter();
  const loc = (locale as "en"|"es") || "en";
  const [ans, setAns] = useState<AnswersV2>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ccu:v2:answers");
      if (stored) {
        setAns(JSON.parse(stored) as AnswersV2);
      }
    } catch {}
  }, []);

  const scored = useMemo(() => scoreAnswersV2(ans), [ans]);
  const persona = personaFrom(scored.norm);
  const p = personaCopy[persona];
  const pillarLabels: Record<Pillar, string> = {
    habits: loc === "es" ? "Hábitos" : "Habits",
    confidence: loc === "es" ? "Confianza" : "Confidence",
    resilience: loc === "es" ? "Resiliencia" : "Resilience",
    inclusion: loc === "es" ? "Inclusión" : "Inclusion",
  };

  return (
    <section className="max-w-3xl mx-auto p-4">
      <div className="bg-white border rounded-2xl shadow p-5 mb-5">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--ccu-blue)" }}>
          {loc==="en" ? "Your Snapshot" : "Tu panorama"}
        </h1>
        <p className="text-sm text-slate-700 mb-2">
          {loc==="en" ? p.title_en : p.title_es}
        </p>
        <p className="text-base">
          {loc==="en" ? p.blurb_en : p.blurb_es}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Bar label={pillarLabels.habits} value={scored.norm.habits} locale={loc} />
        <Bar label={pillarLabels.confidence} value={scored.norm.confidence} locale={loc} />
        <Bar label={pillarLabels.resilience} value={scored.norm.resilience} locale={loc} />
        <Bar label={pillarLabels.inclusion} value={scored.norm.inclusion} locale={loc} />
      </div>

      <div className="bg-white border rounded-2xl shadow p-5 mt-6">
        <h2 className="font-semibold text-ink-900 text-lg mb-2">{loc==="en"?"This week’s easy wins":"Pequeñas victorias de esta semana"}</h2>
        <ul className="list-disc ml-5 space-y-2 text-sm">
          <li>{loc==="en"?"Turn on low-balance alerts and autopay minimum for one bill.":"Activa alertas de saldo bajo y pago automático mínimo para una cuenta."}</li>
          <li>{loc==="en"?"Move $10 to an emergency sub-account.":"Mueve $10 a una subcuenta de emergencias."}</li>
          <li>{loc==="en"?"Pick a monthly ‘money hour’—no judgment, just check-in.":"Elige una ‘hora de dinero’ mensual—sin juicios, solo revisión."}</li>
        </ul>
      </div>
    </section>
  );
}
