import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { detectLocale, t } from '@/lib/locale';
import { loadAnswers } from '@/lib/state';
import { scoreAnswers, questionsBase } from '@/data/assessment';
import { pickPersona, personaCopy, pick, type AreaKey, type Bucket } from '@/data/personas';
import { recommend, type BucketsArg } from '@/data/recommendations';

type Buck = Bucket;
type Score = ReturnType<typeof scoreAnswers>;

type BucketsLike = Record<AreaKey, Buck>;

type ScoreShape = {
  habits?: number;
  maxHabits?: number;
  confidence?: number;
  maxConfidence?: number;
  stability?: number;
  maxStability?: number;
  access?: number;
  maxAccess?: number;
  trust?: number;
  maxTrust?: number;
  resilience?: number;
  maxResilience?: number;
  byPillar?: Partial<Record<'habits' | 'confidence' | 'stability' | 'trust' | 'access' | 'resilience', number>>;
  maxByPillar?: Partial<Record<'habits' | 'confidence' | 'stability' | 'trust' | 'access' | 'resilience', number>>;
};

function toBucketsFromScores(score: ScoreShape): BucketsArg {
  // Expect s like {habits:number, maxHabits:number, ...}. Fall back safely.
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const make = (val: number, max: number): Buck => {
    if (max <= 0 || Number.isNaN(val)) return 'getting_started';
    const pct = clamp(val / max, 0, 1);
    if (pct < 0.25) return 'getting_started';
    if (pct < 0.5) return 'building';
    if (pct < 0.75) return 'progress';
    if (pct < 0.95) return 'on_track';
    return 'empowered';
  };

  const habitsVal = Number(score.habits ?? score.byPillar?.habits ?? 0);
  const habitsMax = Number(score.maxHabits ?? score.maxByPillar?.habits ?? 0);
  const confidenceVal = Number(score.confidence ?? score.byPillar?.confidence ?? 0);
  const confidenceMax = Number(score.maxConfidence ?? score.maxByPillar?.confidence ?? 0);
  const stabilityVal = Number(score.stability ?? score.byPillar?.stability ?? 0);
  const stabilityMax = Number(score.maxStability ?? score.maxByPillar?.stability ?? 0);
  const accessVal = Number(
    score.access ?? score.trust ?? score.byPillar?.access ?? score.byPillar?.trust ?? 0
  );
  const accessMax = Number(
    score.maxAccess ?? score.maxTrust ?? score.maxByPillar?.access ?? score.maxByPillar?.trust ?? 0
  );
  const resilienceVal = Number(score.resilience ?? score.byPillar?.resilience ?? 0);
  const resilienceMax = Number(score.maxResilience ?? score.maxByPillar?.resilience ?? 0);

  return {
    habits: make(habitsVal, habitsMax),
    confidence: make(confidenceVal, confidenceMax),
    stability: make(stabilityVal, stabilityMax),
    access: make(accessVal, accessMax),
    resilience: make(resilienceVal, resilienceMax),
  };
}

export default function PlanPage(props: any) {
  const router = useRouter();
  const locale = detectLocale(router.asPath, router.locale);

  const payload = useMemo(() => {
    try {
      if (router.query.a) return JSON.parse(router.query.a as string);
      return loadAnswers();
    } catch {
      return loadAnswers();
    }
  }, [router.query.a]);

  const baseScore = useMemo<Score>(() => {
    if (payload && typeof payload === 'object' && 'byPillar' in (payload as any) && 'maxByPillar' in (payload as any)) {
      return payload as Score;
    }

    const answers: Record<string, number> =
      payload && typeof payload === 'object' && 'answers' in (payload as any)
        ? ((payload as { answers?: Record<string, number> }).answers ?? {})
        : ((payload as Record<string, number>) ?? {});

    return scoreAnswers(questionsBase, answers);
  }, [payload]);

  const providedScore = (props as any)?.score as ScoreShape | undefined;
  const providedBuckets = (props as any)?.buckets as BucketsLike | undefined;

  const buckets: BucketsArg = providedBuckets ?? toBucketsFromScores(providedScore ?? baseScore);

  const persona = pickPersona(buckets);
  const P = personaCopy[persona];

  const title = `${P.icon} ${pick(locale, P.title)}`;
  const subtitle = pick(locale, P.subtitle);
  const about = pick(locale, P.about);
  const focus = pick(locale, P.focus);
  const plan30 = pick(locale, P.plan30);

  const recs = recommend(buckets, locale, { limit: 3, includeDims: ['habits', 'stability', 'confidence'] });

  return (
    <div className="pb-16">
      {/* Friendly intro */}
      <section className="mt-6 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
        <h1 className="text-xl font-semibold text-slate-900">
          {t('Your Financial Health Snapshot', 'Tu panorama financiero', locale)}
        </h1>
        <p className="text-slate-700">
          {t(
            'This is a friendly snapshot of where you’re strong and where small changes could help most.',
            'Un panorama amable de tus fortalezas y dónde pequeños cambios ayudarán más.',
            locale
          )}
        </p>
      </section>

      {/* Keep your existing score bars below this comment (do not remove) */}

      {/* New: Profile card */}
      <section className="mt-6 rounded-xl border bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-slate-700">{subtitle}</p>
        <p className="mt-2 text-slate-700">{about}</p>

        <div className="mt-4">
          <h3 className="font-medium text-slate-900">
            {t('Primary focus areas', 'Áreas de enfoque principales', locale)}
          </h3>
          <ul className="mt-1 list-disc pl-5 text-slate-700">
            {focus.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="font-medium text-slate-900">
            {t('First 30 days', 'Primeros 30 días', locale)}
          </h3>
          <ul className="mt-1 list-disc pl-5 text-slate-700">
            {plan30.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="font-medium text-slate-900">
            {t('What to do next', 'Qué hacer ahora', locale)}
          </h3>
          <ul className="mt-1 list-disc pl-5 text-slate-700">
            {recs.map((r) => (
              <li key={r.id}>
                {r.href ? (
                  <a href={r.href} className="hover:underline" target={r.href.startsWith('http') ? '_blank' : undefined} rel={r.href.startsWith('http') ? 'noreferrer' : undefined}>
                    {r.title}
                  </a>
                ) : (
                  r.title
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
