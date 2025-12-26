import { type AnswerMap, type Pillar, type Score } from "@/data/assessment";
import { loadAnswers } from "@/lib/state";
import { computePillarMetrics, type PillarMetric } from "@/lib/resultsShared";

export type AnswerRead = { answers: AnswerMap; sourceKey: string };

function safeParse(raw: string | null): AnswerMap | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as AnswerMap;
  } catch {}
  return undefined;
}

export function readAnswersWithSource(
  queryA: string | string[] | undefined,
  storageKeys: string[] = ["assessmentV2Answers", "lastAnswers"],
  fallbackKey = "ccu_answers_v1"
): AnswerRead {
  if (typeof window === "undefined") return { answers: {}, sourceKey: "none" };

  if (typeof queryA === "string" && queryA.trim().startsWith("{")) {
    const parsed = safeParse(queryA);
    if (parsed) return { answers: parsed, sourceKey: "query" };
  }

  for (const key of storageKeys) {
    const parsed = safeParse(localStorage.getItem(key));
    if (parsed) return { answers: parsed, sourceKey: key };
  }

  const last = loadAnswers();
  if (last && typeof last === "object") {
    if ("answers" in (last as any)) return { answers: ((last as any).answers ?? {}) as AnswerMap, sourceKey: fallbackKey };
    return { answers: last as AnswerMap, sourceKey: fallbackKey };
  }

  return { answers: {}, sourceKey: "none" };
}

export function shouldShowDebug(debugParam: string | string[] | undefined): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const val = Array.isArray(debugParam) ? debugParam[0] : debugParam;
  return val === "1";
}

export function pillarDebug(score: Score): Partial<Record<Pillar, PillarMetric>> {
  return computePillarMetrics(score);
}
