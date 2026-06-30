import { adaptiveQuestions, coreQuestions, educationResources, glossaryTerms, guideQuestions, pathways, profileQuestions, supportQuestion, type ContextTag, type DomainId, type GuideAnswers, type GuideQuestion, type PathwayId, type SupportStyle } from "@/data/guide";

export type ImpactLevel = "highest" | "also" | "watch";
export type ImpactArea = { pathwayId: PathwayId; level: ImpactLevel; score: number };

export type GuideResult = {
  answers: GuideAnswers;
  preferredName?: string;
  contextTags: ContextTag[];
  domainScores: Record<DomainId, number>;
  pathwayScores: Record<PathwayId, number>;
  primaryPathway: PathwayId;
  secondaryPathway: PathwayId;
  impactAreas: ImpactArea[];
  supportStyles: SupportStyle[];
  recommendedToolId: string;
  recommendedToolIds: string[];
  recommendedResourceIds: string[];
  recommendedTermIds: string[];
  actionCard: { title: string; today: string; sevenDay: string[] };
  createdAt: string;
};

const pathwayDomains: Record<PathwayId, DomainId[]> = {
  stabilize_bills: ["bill_stability", "cash_flow_control"], make_a_paycheck_plan: ["cash_flow_control", "income_stability"], stop_money_leaks: ["money_leakage", "cash_flow_control"], build_a_safety_buffer: ["emergency_buffer", "savings_consistency"], reduce_debt_pressure: ["debt_pressure"], build_or_repair_credit: ["credit_health_understanding"], understand_financial_basics: ["financial_term_fluency", "product_system_understanding"], borrow_safely: ["borrowing_safety", "comparison_shopping_ability"], work_toward_a_goal: ["goal_clarity", "savings_consistency"], prepare_for_the_future: ["future_planning_readiness", "goal_clarity"], strengthen_self_employment_business_finances: ["business_personal_separation", "income_stability"], talk_this_through: ["trust_access_barrier", "confidence_self_efficacy", "life_complexity"],
};
const urgencyOrder: PathwayId[] = ["stabilize_bills", "reduce_debt_pressure", "make_a_paycheck_plan", "stop_money_leaks", "build_a_safety_buffer", "build_or_repair_credit", "work_toward_a_goal", "prepare_for_the_future", "borrow_safely", "understand_financial_basics", "strengthen_self_employment_business_finances", "talk_this_through"];

function answerIds(value: string | string[] | undefined) { return Array.isArray(value) ? value : value ? [value] : []; }
function selectedOptions(answers: GuideAnswers) {
  return guideQuestions.flatMap(q => answerIds(answers[q.id]).map(id => ({ q, option: q.options.find(o => o.id === id) })).filter((x): x is { q: GuideQuestion; option: NonNullable<typeof x.option> } => Boolean(x.option)));
}
function pathwayFromAttention(id: string): PathwayId | null {
  return ({ bills: "stabilize_bills", payday: "make_a_paycheck_plan", leaks: "stop_money_leaks", debt: "reduce_debt_pressure", credit: "build_or_repair_credit", emergency: "build_a_safety_buffer", goal: "work_toward_a_goal", terms: "understand_financial_basics", future: "prepare_for_the_future", business: "strengthen_self_employment_business_finances" } as Record<string, PathwayId>)[id] ?? null;
}

export function scoreGuideAnswers(answers: GuideAnswers): GuideResult {
  const contextTags = new Set<ContextTag>();
  const supportStyles = new Set<SupportStyle>();
  const domainScores = {} as Record<DomainId, number>;
  const pathwayScores = Object.keys(pathways).reduce((acc, id) => ({ ...acc, [id]: 0 }), {} as Record<PathwayId, number>);

  for (const { option } of selectedOptions(answers)) {
    option.tags?.forEach(t => contextTags.add(t));
    option.supportStyles?.forEach(s => supportStyles.add(s));
    Object.entries(option.domainPoints ?? {}).forEach(([k, v]) => { domainScores[k as DomainId] = (domainScores[k as DomainId] ?? 0) + (v ?? 0); });
    Object.entries(option.pathwayPoints ?? {}).forEach(([k, v]) => { pathwayScores[k as PathwayId] = (pathwayScores[k as PathwayId] ?? 0) + (v ?? 0); });
  }

  const biggest = typeof answers.biggest_difference === "string" ? pathwayFromAttention(answers.biggest_difference) : null;
  if (biggest) pathwayScores[biggest] += 8;

  Object.entries(pathwayDomains).forEach(([pathway, domains]) => { pathwayScores[pathway as PathwayId] += domains.reduce((sum, d) => sum + (domainScores[d] ?? 0), 0); });
  if (contextTags.has("self_employed") || contextTags.has("small_business_owner")) pathwayScores.strengthen_self_employment_business_finances += 4;
  if (contextTags.has("spanish_preferred")) supportStyles.add("spanish_first");
  if (contextTags.has("plain_language_preferred")) supportStyles.add("needs_plain_language");
  if (contextTags.has("wants_human_help") || (domainScores.trust_access_barrier ?? 0) >= 3) supportStyles.add("wants_human_conversation");
  if ((domainScores.cash_flow_control ?? 0) >= 3 || (domainScores.bill_stability ?? 0) >= 3 || (domainScores.debt_pressure ?? 0) >= 3) supportStyles.add("needs_step_by_step");

  const sorted = (Object.keys(pathways) as PathwayId[]).sort((a, b) => pathwayScores[b] - pathwayScores[a] || urgencyOrder.indexOf(a) - urgencyOrder.indexOf(b));
  const primaryPathway = sorted[0] ?? "talk_this_through";
  const secondaryPathway = sorted.find(id => id !== primaryPathway) ?? "understand_financial_basics";
  const impactAreas = sorted.slice(0, 5).map((pathwayId, index) => ({ pathwayId, score: pathwayScores[pathwayId], level: index < 2 ? "highest" : index < 4 ? "also" : "watch" as ImpactLevel }));
  const tools = Array.from(new Set(sorted.slice(0, 4).map(id => pathways[id].toolId)));
  const resourceIds = Array.from(new Set(sorted.slice(0, 3).flatMap(id => pathways[id].resourceIds))).slice(0, 5);
  const termIds = Array.from(new Set(sorted.slice(0, 3).flatMap(id => pathways[id].termIds))).slice(0, 8);
  const primary = pathways[primaryPathway];
  const preferred = typeof answers.preferred_name === "string" ? answers.preferred_name.trim().split(/\s+/)[0] : "";

  return { answers, preferredName: preferred || undefined, contextTags: Array.from(contextTags), domainScores, pathwayScores, primaryPathway, secondaryPathway, impactAreas, supportStyles: Array.from(supportStyles), recommendedToolId: tools[0] ?? primary.toolId, recommendedToolIds: tools, recommendedResourceIds: resourceIds, recommendedTermIds: termIds, actionCard: { title: primary.name.en, today: primary.today.en, sevenDay: primary.sevenDay.map(s => s.en) }, createdAt: new Date().toISOString() };
}

export function questionsForAnswers(answers: GuideAnswers): GuideQuestion[] {
  const profileDone = profileQuestions.every(q => q.inputType === "text" || answerIds(answers[q.id]).length > 0);
  if (!profileDone) return profileQuestions;
  const baseCore = coreQuestions.filter(q => q.id !== "support_preference");
  const preliminary = scoreGuideAnswers(answers);
  const attention = answerIds(answers.attention_areas);
  const biggestOptions = attention.length ? attention : ["bills", "payday", "leaks", "debt", "credit", "emergency", "goal", "terms", "future", "business"];
  const biggestQuestion: GuideQuestion = { ...baseCore[1], options: biggestOptions.map(id => coreQuestions[0].options.find(o => o.id === id)).filter(Boolean) as any[] };
  const focusedCore = [baseCore[0], biggestQuestion, ...baseCore.slice(2).filter(q => {
    const p = preliminary.primaryPathway;
    if (["stabilize_bills", "make_a_paycheck_plan"].includes(p)) return ["bills_known", "tight_cause"].includes(q.id);
    if (p === "stop_money_leaks") return ["money_leaks", "tight_cause"].includes(q.id);
    if (p === "reduce_debt_pressure") return ["debt_help", "tight_cause"].includes(q.id);
    if (p === "build_or_repair_credit") return ["credit_help"].includes(q.id);
    return ["tight_cause"].includes(q.id);
  }).slice(0, 2)];
  const adaptive = adaptiveQuestions.filter(q => q.module === preliminary.primaryPathway).slice(0, 2);
  return [...profileQuestions, ...focusedCore, ...adaptive, supportQuestion].slice(0, 14);
}
export function getResourceById(id: string) { return educationResources.find(r => r.id === id); }
export function getTermById(id: string) { return glossaryTerms.find(t => t.id === id); }
