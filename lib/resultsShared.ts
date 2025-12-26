import { bucketize5, normalize0to100, rankOrder5, type BucketKey5, type Pillar, type Score } from "@/data/assessment";

export type PillarMetric = {
  raw: number;
  max: number;
  pct: number;
  bucket: BucketKey5;
  rank: number;
};

export function computePillarMetrics(score: Score): Record<Pillar, PillarMetric> {
  const pillars = Object.keys(score.byPillar) as Pillar[];
  return pillars.reduce((acc, pillar) => {
    const raw = score.byPillar[pillar] ?? 0;
    const max = score.maxByPillar[pillar] ?? 0;
    const pct = normalize0to100(raw, Math.max(1, max));
    const bucket = bucketize5(max > 0 ? raw / max : 0);
    acc[pillar] = { raw, max, pct, bucket, rank: rankOrder5[bucket] };
    return acc;
  }, {} as Record<Pillar, PillarMetric>);
}

export function sortPillarsByNeed(metrics: Partial<Record<Pillar, PillarMetric>>): Pillar[] {
  const order: Pillar[] = ["stability", "habits", "confidence", "trust", "resilience"];
  return [...order].sort((a, b) => {
    const ma = metrics[a];
    const mb = metrics[b];
    if (!ma && !mb) return 0;
    if (!ma) return 1;
    if (!mb) return -1;
    if (ma.rank !== mb.rank) return ma.rank - mb.rank;
    return ma.pct - mb.pct;
  });
}
