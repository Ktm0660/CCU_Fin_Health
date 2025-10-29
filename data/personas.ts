import type { Bucket5 } from "./assessment";

/** Order buckets from lowest to highest financial resilience. */
const rank: Record<Bucket5, number> = {
  at_risk: 1,       // legacy "rebuilding"
  vulnerable: 2,    // legacy "getting_started"
  building: 3,      // legacy "progress"
  thriving: 4,      // legacy "on_track"
};

export type PersonaKey =
  | "rebuilder"          // struggling with basics (maps to at_risk)
  | "stabilizer"         // starting to gain footing (maps to vulnerable)
  | "builder"            // building habits and buffers (maps to building)
  | "planner"            // organized, future-oriented (maps to thriving)
  | "optimizer";         // already strong, looking to optimize (maps to thriving)

export type Persona = {
  title: string;
  summary: string;
  // Which bucket(s) this persona typically represents (used for selection hints)
  matches: Bucket5[];
  tone: "warm" | "coach" | "celebrate";
  nudge: string;
};

export const personas: Record<PersonaKey, Persona> = {
  rebuilder: {
    title: "Rebuilder",
    summary:
      "You’re in a tough stretch. Let’s make it calmer fast: one safety move, one bill rule, one win this week.",
    matches: ["at_risk"],
    tone: "warm",
    nudge:
      "Start tiny and repeatable: $10 auto-save, autopay minimums, and ask for one fee waiver. Momentum beats perfection.",
  },
  stabilizer: {
    title: "Stabilizer",
    summary:
      "You’ve got pieces in place, now we’ll lock in a simple rhythm so surprises don’t derail you.",
    matches: ["vulnerable"],
    tone: "coach",
    nudge:
      "Build a $250 buffer, pick a debt snowball/avalanche, and pre-plan one weekly grocery list.",
  },
  builder: {
    title: "Builder",
    summary:
      "Habits are forming. Next step: automate the boring parts and speed up your savings.",
    matches: ["building"],
    tone: "coach",
    nudge:
      "Round-up savings, 3% 401(k) (if available), and a once-a-month ‘money hour’ to review & adjust.",
  },
  planner: {
    title: "Planner",
    summary:
      "You run your money like a project. Let’s align with 6–12 month goals and protect against surprises.",
    matches: ["thriving"],
    tone: "celebrate",
    nudge:
      "Target 1–3 months expenses in cash, automate sinking funds (auto/medical/holidays), and set a quarterly goal check.",
  },
  optimizer: {
    title: "Optimizer",
    summary:
      "Strong foundation. Now it’s about efficiency, fees, and long-term strategy for the big goals.",
    matches: ["thriving"],
    tone: "celebrate",
    nudge:
      "Refine insurance deductibles, trim account fees, and map a 3-year plan (credit score, debt-free date, savings milestones).",
  },
};

/** Helper to compare buckets by resilience. Higher is better. */
export function compareBuckets(a: Bucket5, b: Bucket5) {
  return rank[a] - rank[b];
}
