import { useRouter } from "next/router";
import { useMemo } from "react";
import { scoreAnswers } from "@/data/assessment";
import { bucketize5, bucketCopy5 } from "@/data/results_copy";
import { recommend } from "@/data/recommendations";
import Link from "next/link";
import { t } from "@/lib/i18n";

type Bucket =
  | "rebuilding"
  | "getting_started"
  | "progress"
  | "on_track"
  | "empowered";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 border">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <div className="mt-2 text-sm">{children}</div>
    </div>
  );
}

export default function PlanPage() {
  const router = useRouter();
  const locale = (router.locale as "en" | "es") || "en";
  const copy = bucketCopy5(locale);

  const ans = useMemo(() => {
    try {
      return JSON.parse((router.query.a as string) || "{}");
    } catch {
      return {};
    }
  }, [router.query.a]);

  const s = scoreAnswers(ans);

  const dims = [
    { key: "habits", label: t(locale, "habits") },
    { key: "confidence", label: t(locale, "confidence") },
    { key: "stability", label: t(locale, "stability") },
  ] as const;

  const buckets = {
    habits: bucketize5(s.habits, s.maxHabits),
    confidence: bucketize5(s.confidence, s.maxConfidence),
    stability: bucketize5(s.stability, s.maxStability),
  };

  const rank: Record<Bucket, number> = {
    rebuilding: 1,
    getting_started: 2,
    progress: 3,
    on_track: 4,
    empowered: 5,
  };

  // Pick primary focus (lowest rank). Tie-break: stability -> habits -> confidence
  const ordered = [
    { k: "stability", b: buckets.stability, r: rank[buckets.stability] },
    { k: "habits", b: buckets.habits, r: rank[buckets.habits] },
    { k: "confidence", b: buckets.confidence, r: rank[buckets.confidence] },
  ].sort((a, z) => a.r - z.r);

  const primary = ordered[0]; // {k,b,r}
  const secondary = ordered[1];

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {locale === "en" ? "Your Action Path" : "Tu ruta de acción"}
      </h1>
      <p className="text-sm text-slate-700 mb-4">
        {locale === "en"
          ? "These steps are judgment-free and practical. Start where it’s easiest. Small wins reduce stress and build momentum."
          : "Estos pasos son prácticos y sin juicios. Empieza por lo más fácil. Los logros pequeños bajan el estrés y crean impulso."}
      </p>

      {/* Focus Areas */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card title={areaTitle(locale, primary.k as any, primary.b as Bucket)}>
          {stepsList(locale, primary.k as any, primary.b as Bucket)}
        </Card>
        <Card title={areaTitle(locale, secondary.k as any, secondary.b as Bucket)}>
          {stepsList(locale, secondary.k as any, secondary.b as Bucket)}
        </Card>
      </div>

      {/* Tools & resources */}
      <h2 className="text-xl font-semibold mt-8 mb-3">
        {t(locale, "helpfulNext")}
      </h2>
      <ul className="list-disc ml-6 space-y-2">
        {recommend(
          {
            habits: buckets.habits,
            confidence: buckets.confidence,
            stability: buckets.stability,
          },
          locale as "en" | "es"
        ).map((r, i) =>
          r.href.startsWith("http") ? (
            <li key={i}>
              <a
                className="no-underline"
                href={r.href}
                target="_blank"
                rel="noreferrer"
              >
                {r.title}
              </a>
            </li>
          ) : (
            <li key={i}>
              <Link className="no-underline" href={r.href}>
                {r.title}
              </Link>
            </li>
          )
        )}
      </ul>

      {/* Back to results */}
      <div className="mt-6">
        <Link
          href={{ pathname: "/results", query: { a: JSON.stringify(ans) } }}
          className="px-4 py-2 rounded-xl border no-underline"
        >
          {locale === "en" ? "Back to results" : "Volver a resultados"}
        </Link>
      </div>
    </section>
  );
}

// ---------- copy helpers for area titles & steps ----------
function areaTitle(
  locale: "en" | "es",
  area: "habits" | "confidence" | "stability",
  bucket: Bucket
) {
  const areaLabel =
    area === "habits"
      ? locale === "en"
        ? "Habits"
        : "Hábitos"
      : area === "confidence"
      ? locale === "en"
        ? "Confidence"
        : "Confianza"
      : locale === "en"
      ? "Stability"
      : "Estabilidad";

  const badge: Record<Bucket, string> = {
    rebuilding: locale === "en" ? "Rebuilding" : "Reconstruyendo",
    getting_started: locale === "en" ? "Getting Started" : "Empezando",
    progress: locale === "en" ? "Making Progress" : "Tomando ritmo",
    on_track: locale === "en" ? "On Track" : "En buen camino",
    empowered: locale === "en" ? "Empowered" : "Con control",
  };

  return `${areaLabel} · ${badge[bucket]}`;
}

function stepsList(
  locale: "en" | "es",
  area: "habits" | "confidence" | "stability",
  bucket: Bucket
) {
  const L = (en: string, es: string) => (locale === "en" ? en : es);

  // Three horizons: This Week, Next Few Months, Keep Growing
  const groups: { title: string; items: string[] }[] = [];

  if (area === "stability") {
    if (bucket === "rebuilding" || bucket === "getting_started") {
      groups.push({
        title: L("This week", "Esta semana"),
        items: [
          L("Open a separate ‘rainy day’ space (even $10).", "Abre un espacio de ahorro (aunque sea $10)."),
          L("Set one small automatic transfer to savings.", "Activa una transferencia automática pequeña."),
        ],
      });
      groups.push({
        title: L("Next few months", "Próximos meses"),
        items: [
          L("Build a $100–$300 mini emergency fund.", "Crea un fondo de emergencia de $100–$300."),
          L("Plan for car/home maintenance with tiny monthly set-asides.", "Planea mantenimiento de auto/hogar con apartados pequeños."),
        ],
      });
    } else if (bucket === "progress" || bucket === "on_track") {
      groups.push({
        title: L("This week", "Esta semana"),
        items: [
          L("Name your savings goals in the app (emergency, car, move).", "Nombra metas de ahorro en la app (emergencia, auto, mudanza)."),
        ],
      });
      groups.push({
        title: L("Next few months", "Próximos meses"),
        items: [
          L("Automate increases when income rises (tax refund, bonus).", "Aumenta el ahorro cuando suba el ingreso (reembolso, bono)."),
        ],
      });
    } else {
      groups.push({
        title: L("Keep growing", "Sigue creciendo"),
        items: [
          L("Consider a 3–6 month buffer and goal-based sub-accounts.", "Considera un colchón de 3–6 meses y subcuentas por objetivo."),
        ],
      });
    }
  }

  if (area === "habits") {
    if (bucket === "rebuilding" || bucket === "getting_started") {
      groups.push({
        title: L("This week", "Esta semana"),
        items: [
          L("Use a 1-page spending list: Needs → Bills → Wants.", "Usa una lista de 1 página: Necesidades → Cuentas → Gustos."),
          L("Set one bill to autopay (minimum).", "Activa pago automático en una cuenta (mínimo)."),
        ],
      });
      groups.push({
        title: L("Next few months", "Próximos meses"),
        items: [
          L("Create a simple grocery plan to cut impulse buys.", "Haz un plan simple de compras para reducir impulsos."),
        ],
      });
    } else if (bucket === "progress" || bucket === "on_track") {
      groups.push({
        title: L("This week", "Esta semana"),
        items: [
          L("Turn on low-balance and large-purchase alerts.", "Activa alertas de saldo bajo y compras grandes."),
        ],
      });
      groups.push({
        title: L("Next few months", "Próximos meses"),
        items: [
          L("Schedule a monthly 15-minute money check-in.", "Agenda una revisión mensual de 15 minutos."),
        ],
      });
    } else {
      groups.push({
        title: L("Keep growing", "Sigue creciendo"),
        items: [
          L("Optimize recurring expenses once per quarter.", "Optimiza gastos recurrentes una vez por trimestre."),
        ],
      });
    }
  }

  if (area === "confidence") {
    if (bucket === "rebuilding" || bucket === "getting_started") {
      groups.push({
        title: L("This week", "Esta semana"),
        items: [
          L("Write down 3 questions to ask a counselor.", "Anota 3 preguntas para un consejero."),
          L("Pull your free credit report.", "Descarga tu reporte de crédito gratis."),
        ],
      });
      groups.push({
        title: L("Next few months", "Próximos meses"),
        items: [
          L("Compare two loan offers side-by-side when needed.", "Compara dos ofertas de préstamo cuando lo necesites."),
        ],
      });
    } else if (bucket === "progress" || bucket === "on_track") {
      groups.push({
        title: L("This week", "Esta semana"),
        items: [
          L("Practice a ‘money story’—how you explain your goals.", "Practica tu ‘historia de dinero’—cómo explicas tus metas."),
        ],
      });
      groups.push({
        title: L("Next few months", "Próximos meses"),
        items: [
          L("Attend a workshop or 1:1 session to plan your next move.", "Asiste a un taller o sesión 1:1 para tu próximo paso."),
        ],
      });
    } else {
      groups.push({
        title: L("Keep growing", "Sigue creciendo"),
        items: [
          L("Mentor someone or share what’s worked for you.", "Apoya a alguien o comparte lo que te funcionó."),
        ],
      });
    }
  }

  return (
    <div className="space-y-3">
      {groups.map((g, i) => (
        <div key={i}>
          <p className="font-medium text-ink-900">{g.title}</p>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            {g.items.map((it, j) => (
              <li key={j}>{it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
