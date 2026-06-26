import { adaptiveQuestions, contextQuestions, coreQuestions, educationResources, glossaryTerms, guideQuestions, pathways, supportQuestion, type ContextTag, type DomainId, type GuideAnswers, type GuideQuestion, type PathwayId, type SupportStyle } from "@/data/guide";

export type GuideResult = {
  answers: GuideAnswers;
  contextTags: ContextTag[];
  domainScores: Record<DomainId, number>;
  pathwayScores: Record<PathwayId, number>;
  primaryPathway: PathwayId;
  secondaryPathway: PathwayId;
  supportStyles: SupportStyle[];
  recommendedToolId: string;
  recommendedResourceIds: string[];
  recommendedTermIds: string[];
  actionCard: { title: string; today: string; sevenDay: string[] };
  createdAt: string;
};

const pathwayDomains: Record<PathwayId, DomainId[]> = {
  stabilize_bills: ["bill_stability", "cash_flow_control"],
  make_a_paycheck_plan: ["cash_flow_control", "income_stability"],
  stop_money_leaks: ["money_leakage", "cash_flow_control"],
  build_a_safety_buffer: ["emergency_buffer", "savings_consistency"],
  reduce_debt_pressure: ["debt_pressure"],
  build_or_repair_credit: ["credit_health_understanding"],
  understand_financial_basics: ["financial_term_fluency", "product_system_understanding"],
  borrow_safely: ["borrowing_safety", "comparison_shopping_ability"],
  work_toward_a_goal: ["goal_clarity", "savings_consistency"],
  prepare_for_the_future: ["future_planning_readiness", "goal_clarity"],
  strengthen_self_employment_business_finances: ["business_personal_separation", "income_stability"],
  talk_this_through: ["trust_access_barrier", "confidence_self_efficacy", "life_complexity"],
};

const urgencyOrder: PathwayId[] = ["stabilize_bills", "reduce_debt_pressure", "make_a_paycheck_plan", "stop_money_leaks", "build_a_safety_buffer", "build_or_repair_credit", "work_toward_a_goal", "prepare_for_the_future", "borrow_safely", "understand_financial_basics", "strengthen_self_employment_business_finances", "talk_this_through"];

function selectedOptions(answers: GuideAnswers) {
  return guideQuestions.flatMap(q => {
    const option = q.options.find(o => o.id === answers[q.id]);
    return option ? [{ q, option }] : [];
  });
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

  Object.entries(pathwayDomains).forEach(([pathway, domains]) => {
    pathwayScores[pathway as PathwayId] += domains.reduce((sum, d) => sum + (domainScores[d] ?? 0), 0);
  });

  if (contextTags.has("self_employed") || contextTags.has("small_business_owner")) {
    pathwayScores.strengthen_self_employment_business_finances += 4;
  }
  if (contextTags.has("spanish_preferred")) supportStyles.add("spanish_first");
  if (contextTags.has("plain_language_preferred")) supportStyles.add("needs_plain_language");
  if (contextTags.has("wants_human_help") || (domainScores.trust_access_barrier ?? 0) >= 3) supportStyles.add("wants_human_conversation");
  if ((domainScores.cash_flow_control ?? 0) >= 3 || (domainScores.bill_stability ?? 0) >= 3 || (domainScores.debt_pressure ?? 0) >= 3) supportStyles.add("needs_step_by_step");

  const sorted = (Object.keys(pathways) as PathwayId[]).sort((a, b) => {
    const diff = pathwayScores[b] - pathwayScores[a];
    if (diff !== 0) return diff;
    return urgencyOrder.indexOf(a) - urgencyOrder.indexOf(b);
  });
  const primaryPathway = sorted[0] ?? "talk_this_through";
  const secondaryPathway = sorted.find(id => id !== primaryPathway) ?? "understand_financial_basics";
  const primary = pathways[primaryPathway];
  const resourceIds = Array.from(new Set([...primary.resourceIds, ...pathways[secondaryPathway].resourceIds])).slice(0, 4);
  const termIds = Array.from(new Set([...primary.termIds, ...pathways[secondaryPathway].termIds])).slice(0, 8);

  return {
    answers,
    contextTags: Array.from(contextTags),
    domainScores,
    pathwayScores,
    primaryPathway,
    secondaryPathway,
    supportStyles: Array.from(supportStyles),
    recommendedToolId: primary.toolId,
    recommendedResourceIds: resourceIds,
    recommendedTermIds: termIds,
    actionCard: { title: primary.name.en, today: primary.today.en, sevenDay: primary.sevenDay.map(s => s.en) },
    createdAt: new Date().toISOString(),
  };
}

export function questionsForAnswers(answers: GuideAnswers): GuideQuestion[] {
  const base = [...contextQuestions, ...coreQuestions];
  const preliminary = scoreGuideAnswers(answers);
  const module = preliminary.primaryPathway;
  const adaptive = adaptiveQuestions.filter(q => q.module === module).slice(0, 3);
  const fallback = adaptive.length ? adaptive : adaptiveQuestions.filter(q => q.module === "talk_this_through").slice(0, 3);
  return [...base, ...fallback, supportQuestion].slice(0, 16);
}

export function getResourceById(id: string) {
  return educationResources.find(r => r.id === id);
}

export function getTermById(id: string) {
  return glossaryTerms.find(t => t.id === id);
}
