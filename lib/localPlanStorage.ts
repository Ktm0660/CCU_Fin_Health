import type { GuideAnswers } from "@/data/guide";
import type { GuideResult } from "@/lib/guideScoring";

export const LOCAL_PLAN_KEY = "ccu_money_plan_v1";
export const FUTURE_SAVE_HOOK = "optional_email_or_save_code_can_attach_here";

export type LocalMoneyPlan = GuideResult & { savedOnlyOnDevice: true; version: 1 };

export function saveLocalPlan(result: GuideResult): LocalMoneyPlan | null {
  if (typeof window === "undefined") return null;
  const plan: LocalMoneyPlan = { ...result, savedOnlyOnDevice: true, version: 1 };
  try {
    localStorage.setItem(LOCAL_PLAN_KEY, JSON.stringify(plan));
    return plan;
  } catch {
    return null;
  }
}

export function loadLocalPlan(): LocalMoneyPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_PLAN_KEY);
    return raw ? JSON.parse(raw) as LocalMoneyPlan : null;
  } catch {
    return null;
  }
}

export function clearLocalPlan() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCAL_PLAN_KEY);
    localStorage.removeItem("lastAnswers");
    localStorage.removeItem("assessmentAnswers");
    localStorage.removeItem("assessmentV2Answers");
  } catch {}
}

export function saveDraftAnswers(answers: GuideAnswers) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("lastAnswers", JSON.stringify(answers));
  } catch {}
}
