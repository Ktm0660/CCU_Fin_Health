import { useRouter } from "next/router";
import { useMemo } from "react";
import { scoreAnswers, bucketize5, type BucketKey5, questionsBase } from "@/data/assessment";
import { pickLessons, Area, Level } from "@/data/lessons";
import LessonCard from "@/components/LessonCard";
import { personaCopy, getPersona, type PersonaKey } from "@/data/personas";
import { recommend } from "@/data/recommendations";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { loadAnswers } from "@/lib/state";

type Locale = "en" | "es";
type Localized<T> = { en: T; es: T };
const pick = <T,>(loc: Locale, v: Localized<T>): T => v[loc];
type Score = ReturnType<typeof scoreAnswers>;
type AreaKey = "habits" | "confidence" | "stability" | "access" | "knowledge";

const bucketRank: Record<BucketKey5, number> = {
  building: 0,
  getting_started: 1,
  progress: 2,
  on_track: 3,
  empowered: 4
};

type Bucket = BucketKey5;

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

  const payload = useMemo(() => {
    try {
      if (router.query.a) return JSON.parse(router.query.a as string);
      return loadAnswers();
    } catch {
      return loadAnswers();
    }
  }, [router.query.a]);

  const score = useMemo<Score>(() => {
    if (payload && typeof payload === "object" && "byPillar" in payload && "maxByPillar" in payload) {
      return payload as Score;
    }

    const answers: Record<string, number> =
      payload && typeof payload === "object" && "answers" in payload
        ? ((payload as { answers?: Record<string, number> }).answers ?? {})
        : ((payload as Record<string, number>) ?? {});

    return scoreAnswers(questionsBase, answers);
  }, [payload]);

  const locale = (router.locale as Locale) || "en";

  const dims: AreaKey[] = ["habits", "confidence", "stability", "access", "knowledge"];
  const pillarMap: Record<AreaKey, keyof Score["byPillar"]> = {
    habits: "habits",
    confidence: "confidence",
    stability: "stability",
    access: "trust",
    knowledge: "resilience"
  };

  const buckets = dims.reduce((acc, key) => {
    const pillar = pillarMap[key];
    const val = score.byPillar[pillar] ?? 0;
    const max = score.maxByPillar[pillar] ?? 0;
    const pct = max > 0 ? val / max : 0;
    acc[key] = bucketize5(pct);
    return acc;
  }, {} as Record<AreaKey, BucketKey5>);

  // Persona engine
  const persona = getPersona(buckets);
  const P = personaCopy[persona];

  const personaTitle = pick(locale, P.title);
  const personaSubtitle = pick(locale, P.subtitle);
  const personaAbout = pick(locale, P.about);
  const focusList = pick(locale, P.focus);
  const plan30 = pick(locale, P.plan30day);

  const priorityAreas = ["habits", "confidence", "stability"] as const;
  type FocusArea = (typeof priorityAreas)[number];
  const ordered = [...priorityAreas].sort((a, b) => bucketRank[buckets[a]] - bucketRank[buckets[b]]) as FocusArea[];
  const primary = ordered[0] ?? "habits";
  const secondary = ordered[1] ?? "confidence";

  // Map persona to a starting lesson level
  const personaLevelMap: Record<PersonaKey, Level> = {
    rebuilder: "discover",
    getting_started: "stabilize",
    progress: "grow",
    on_track: "grow",
    empowered: "thrive",
  };
  const startLevel = personaLevelMap[persona];

  // Pick lessons for primary focus area
  const recLessons = pickLessons(primary as Area, startLevel, locale, 3);

  // Recommendations (prioritize habits, confidence, stability, then access, knowledge)
  const recs = recommend(
    {
      habits: buckets.habits,
      confidence: buckets.confidence,
      stability: buckets.stability,
      access: (buckets as any).access,
      knowledge: (buckets as any).knowledge
    },
    ["habits", "confidence", "stability", "access", "knowledge"],
    6
  );

  const L = (en: string, es: string) => (locale === "en" ? en : es);

  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">
        {L("Your Action Path", "Tu ruta de acción")}
      </h1>
      <p className="text-sm text-slate-700 mb-4">
        {L(
          "Judgment-free, practical steps. Start where it’s easiest—small wins reduce stress and build momentum.",
          "Pasos prácticos y sin juicios. Empieza por lo más fácil—los logros pequeños bajan el estrés y crean impulso."
        )}
      </p>

      {/* Persona header */}
      <div className="bg-white rounded-2xl shadow p-4 border mb-5">
        <h2 className="text-xl font-semibold text-ink-900">{personaTitle}</h2>
        <p className="mt-1 text-slate-700">{personaSubtitle}</p>
      </div>

      <div className="mt-4 rounded-xl border p-4 bg-white/60">
        <h3 className="font-semibold">
          {locale === "en" ? "About this profile" : "Sobre este perfil"}
        </h3>
        <p className="mt-1 text-slate-700">{personaAbout}</p>
      </div>

      <div className="mt-4 rounded-xl border p-4 bg-white/60">
        <h3 className="font-semibold">{locale === "en" ? "Focus areas" : "Áreas de enfoque"}</h3>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          {focusList.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-xl border p-4 bg-white/60">
        <h3 className="font-semibold">{locale === "en" ? "Next 30 days" : "Próximos 30 días"}</h3>
        <ol className="mt-2 list-decimal pl-5 space-y-1">
          {plan30.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      </div>

      {/* Persona-driven steps */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card title={areaTitle(locale, primary, buckets[primary] as Bucket)}>
          {stepsByArea(locale, primary, buckets[primary] as Bucket)}
        </Card>

        <Card title={areaTitle(locale, secondary, buckets[secondary] as Bucket)}>
          {stepsByArea(locale, secondary, buckets[secondary] as Bucket)}
        </Card>
      </div>

      {/* NEW: Recommended lessons inside the Action Path */}
      <h2 className="text-xl font-semibold mt-8 mb-3">
        {L("Recommended lessons for you", "Lecciones recomendadas para ti")}
      </h2>
      <p className="text-sm text-slate-700 mb-3">
        {L(
          "Short, plain-language lessons matched to your current focus.",
          "Lecciones cortas y claras según tu enfoque actual."
        )}
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {recLessons.map(lsn => (
          <LessonCard key={lsn.id} lesson={lsn} locale={locale} />
        ))}
      </div>

      {/* Tailored resources */}
      <h2 className="text-xl font-semibold mt-8 mb-3">{t(locale, "helpfulNext")}</h2>
      <ul className="list-disc ml-6 space-y-2">
        {recs.map((r, i) =>
          r.href.startsWith("http") ? (
            <li key={i}><a className="no-underline" href={r.href} target="_blank" rel="noreferrer">{r.title}</a></li>
          ) : (
            <li key={i}><Link className="no-underline" href={r.href}>{r.title}</Link></li>
          )
        )}
      </ul>

      {/* Back to results */}
      <div className="mt-6">
        <Link
          href={{ pathname: "/results", query: { a: JSON.stringify(payload ?? {}) } }}
          className="px-4 py-2 rounded-xl border no-underline"
        >
          {L("Back to results", "Volver a resultados")}
        </Link>
      </div>
    </section>
  );
}

function areaTitle(locale: Locale, area: "habits" | "confidence" | "stability", bucket: Bucket) {
  const areaLabel =
    area === "habits"
      ? locale === "en" ? "Habits" : "Hábitos"
      : area === "confidence"
      ? locale === "en" ? "Confidence" : "Confianza"
      : locale === "en" ? "Stability" : "Estabilidad";

  const badge: Record<Bucket, string> = {
    building: locale === "en" ? "Building" : "Construyendo",
    getting_started: locale === "en" ? "Getting Started" : "Empezando",
    progress: locale === "en" ? "Making Progress" : "Tomando ritmo",
    on_track: locale === "en" ? "On Track" : "En buen camino",
    empowered: locale === "en" ? "Empowered" : "Con control",
  };
  return `${areaLabel} · ${badge[bucket]}`;
}

function stepsByArea(locale: Locale, area: "habits" | "confidence" | "stability", bucket: Bucket) {
  const L = (en: string, es: string) => (locale === "en" ? en : es);
  const groups: { title: string; items: string[] }[] = [];

  if (area === "stability") {
    if (bucket === "building" || bucket === "getting_started") {
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
          L("Plan for repairs with tiny monthly set-asides.", "Planifica reparaciones con apartados pequeños."),
        ],
      });
    } else if (bucket === "progress" || bucket === "on_track") {
      groups.push({
        title: L("This week", "Esta semana"),
        items: [
          L("Name savings goals (emergency, car, move).", "Nombra metas de ahorro (emergencia, auto, mudanza)."),
        ],
      });
      groups.push({
        title: L("Next few months", "Próximos meses"),
        items: [
          L("Increase autosave when income rises.", "Aumenta el ahorro cuando suba el ingreso."),
        ],
      });
    } else {
      groups.push({
        title: L("Keep growing", "Sigue creciendo"),
        items: [
          L("Build a 3–6 month buffer; use goal-based sub-accounts.", "Crea un colchón de 3–6 meses; usa subcuentas por meta."),
        ],
      });
    }
  }

  if (area === "habits") {
    if (bucket === "building" || bucket === "getting_started") {
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
          L("Plan groceries to cut impulse buys.", "Planifica el súper para reducir impulsos."),
        ],
      });
    } else if (bucket === "progress" || bucket === "on_track") {
      groups.push({
        title: L("This week", "Esta semana"),
        items: [L("Turn on balance and large-purchase alerts.", "Activa alertas de saldo y compras grandes.")],
      });
      groups.push({
        title: L("Next few months", "Próximos meses"),
        items: [L("Schedule a monthly 15-minute money check-in.", "Agenda una revisión mensual de 15 minutos.")],
      });
    } else {
      groups.push({
        title: L("Keep growing", "Sigue creciendo"),
        items: [L("Optimize recurring expenses once per quarter.", "Optimiza gastos recurrentes cada trimestre.")],
      });
    }
  }

  if (area === "confidence") {
    if (bucket === "building" || bucket === "getting_started") {
      groups.push({
        title: L("This week", "Esta semana"),
        items: [
          L("Write 3 questions to ask a counselor.", "Escribe 3 preguntas para un consejero."),
          L("Pull your free credit report.", "Descarga tu reporte de crédito gratis."),
        ],
      });
      groups.push({
        title: L("Next few months", "Próximos meses"),
        items: [L("Compare two loan offers side-by-side when needed.", "Compara dos ofertas de préstamo cuando lo necesites.")],
      });
    } else if (bucket === "progress" || bucket === "on_track") {
      groups.push({
        title: L("This week", "Esta semana"),
        items: [L("Practice your ‘money story’—how you explain your goals.", "Practica tu ‘historia de dinero’—cómo explicas tus metas.")],
      });
      groups.push({
        title: L("Next few months", "Próximos meses"),
        items: [L("Attend a workshop or 1:1 session.", "Asiste a un taller o sesión 1:1.")],
      });
    } else {
      groups.push({
        title: L("Keep growing", "Sigue creciendo"),
        items: [L("Mentor someone or share what’s worked.", "Mentorea a alguien o comparte lo que te funcionó.")],
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
