import type { BucketKey5 } from "./assessment";

/** Lightweight catalog for tailored suggestions. */
export type RecItem = { title: string; href: string; kind: "tool" | "edu" | "product" };

/** Areas we recommend against (tie to assessment dimensions). */
export type RecArea = "habits" | "confidence" | "stability" | "access" | "knowledge";

/** What we currently have content for. Add/remove as you expand. */
export type RecCatalog = Record<RecArea, RecItem[]>;

/** Rank order for buckets (lower = needs more help) */
const rank: Record<BucketKey5, number> = {
  building: 1,
  getting_started: 2,
  progress: 3,
  on_track: 4,
  empowered: 5,
};

/** Minimal starter catalog — merge in your existing items here */
const catalog: RecCatalog = {
  habits: [
    { title: "Build a Starter Emergency Fund ($500)", href: "/lessons/emergency-fund", kind: "edu" },
    { title: "Bill Calendar Template", href: "/tools/bill-calendar", kind: "tool" },
    { title: "5-minute Spend Plan (Printable)", href: "/resources/spend-plan", kind: "tool" },
    { title: "Auto-Pay + Bill Calendar", href: "/resources/bill-calendar", kind: "tool" },
    { title: "Needs vs Wants (Quick Guide)", href: "/lessons/needs-vs-wants", kind: "edu" },
  ],
  confidence: [
    { title: "Money Mindset Reset", href: "/lessons/mindset", kind: "edu" },
    { title: "Coach Session (Free)", href: "/tools/coach", kind: "product" },
    { title: "Talk to a CU without Fear (Script + Tips)", href: "/lessons/judgment-free", kind: "edu" },
    { title: "Fee Glossary in Plain English/Spanish", href: "/glossary", kind: "edu" },
    { title: "Open an Account (Step-by-Step)", href: "/products/open-account", kind: "product" },
  ],
  stability: [
    { title: "Debt Priority Planner", href: "/tools/debt-planner", kind: "tool" },
    { title: "Income Smoothing Ideas", href: "/lessons/income-smoothing", kind: "edu" },
    { title: "Mini Emergency Fund Sprint", href: "/lessons/mini-emergency-fund", kind: "edu" },
    { title: "Round-Up Savings Setup", href: "/tools/round-up", kind: "tool" },
    { title: "Debt Snowball vs Avalanche", href: "/lessons/debt-strategies", kind: "edu" },
  ],
  access: [
    { title: "Fraud-Safe Checking", href: "/products/checking", kind: "product" },
    { title: "ITIN-Friendly Services", href: "/resources/itin", kind: "product" },
    { title: "ITIN Lending at Connections", href: "/products/itin-lending", kind: "product" },
    { title: "Mobile Branch Schedule", href: "/resources/mobile-branch", kind: "tool" },
    { title: "How Fees Work (Transparent Examples)", href: "/lessons/fees-explained", kind: "edu" },
  ],
  knowledge: [
    { title: "Jargon-Free Glossary", href: "/glossary", kind: "edu" },
    { title: "Credit Score Basics", href: "/lessons/credit-basics", kind: "edu" },
    { title: "One-Page Money Map", href: "/tools/money-map", kind: "tool" },
    { title: "Sinking Funds (Car, Medical, Holidays)", href: "/lessons/sinking-funds", kind: "edu" },
    { title: "Goal Tracker", href: "/tools/goal-tracker", kind: "tool" },
  ],
};

/** Allow passing either:
 *  A) the user's bucket-by-area map, e.g. { habits: "getting_started", confidence: "progress", ... }
 *  B) just a prioritized list of areas to show
 */
type BucketsByArea = Partial<Record<RecArea, BucketKey5>>;

function sortAreasByNeed(buckets?: BucketsByArea, focus?: RecArea[]): RecArea[] {
  const areas: RecArea[] = (focus && focus.length ? focus : (Object.keys(catalog) as RecArea[]))
    .filter(a => a in catalog);

  if (!buckets) return areas; // no scoring context — keep incoming order

  return areas.sort((a, b) => {
    const ra = rank[buckets[a] ?? "progress"];
    const rb = rank[buckets[b] ?? "progress"];
    return ra - rb; // weakest first
  });
}

/** Get up to `max` recommended items, ordered by need then catalog order. */
export function recommend(
  first: BucketsByArea | RecArea[],
  second?: RecArea[],
  max = 6
): RecItem[] {
  let buckets: BucketsByArea | undefined;
  let focus: RecArea[] | undefined;

  if (Array.isArray(first)) {
    focus = first as RecArea[];
  } else {
    buckets = first as BucketsByArea;
    focus = second;
  }

  const areas = sortAreasByNeed(buckets, focus);
  const out: RecItem[] = [];
  for (const area of areas) {
    for (const item of catalog[area]) {
      out.push(item);
      if (out.length >= max) return out;
    }
  }
  return out;
}
