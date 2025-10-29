import type { BucketKey5 } from "./assessment";

/** Lightweight catalog for tailored suggestions. href can be external or internal. */
export type RecItem = { title: string; href: string; kind: "tool" | "edu" | "product" };

export type RecCatalog = {
  habits: RecItem[];
  confidence: RecItem[];
  stability: RecItem[];
  planning: RecItem[];
  access_trust: RecItem[];
};

// Minimal starter set; expand later.
const CATALOG: RecCatalog = {
  habits: [
    { title: "5-minute Spend Plan (Printable)", href: "/resources/spend-plan", kind: "tool" },
    { title: "Auto-Pay + Bill Calendar", href: "/resources/bill-calendar", kind: "tool" },
    { title: "Needs vs Wants (Quick Guide)", href: "/lessons/needs-vs-wants", kind: "edu" },
  ],
  confidence: [
    { title: "Talk to a CU without Fear (Script + Tips)", href: "/lessons/judgment-free", kind: "edu" },
    { title: "Fee Glossary in Plain English/Spanish", href: "/glossary", kind: "edu" },
    { title: "Open an Account (Step-by-Step)", href: "/products/open-account", kind: "product" },
  ],
  stability: [
    { title: "Mini Emergency Fund Sprint", href: "/lessons/mini-emergency-fund", kind: "edu" },
    { title: "Round-Up Savings Setup", href: "/tools/round-up", kind: "tool" },
    { title: "Debt Snowball vs Avalanche", href: "/lessons/debt-strategies", kind: "edu" },
  ],
  planning: [
    { title: "One-Page Money Map", href: "/tools/money-map", kind: "tool" },
    { title: "Sinking Funds (Car, Medical, Holidays)", href: "/lessons/sinking-funds", kind: "edu" },
    { title: "Goal Tracker", href: "/tools/goal-tracker", kind: "tool" },
  ],
  access_trust: [
    { title: "ITIN Lending at Connections", href: "/products/itin-lending", kind: "product" },
    { title: "Mobile Branch Schedule", href: "/resources/mobile-branch", kind: "tool" },
    { title: "How Fees Work (Transparent Examples)", href: "/lessons/fees-explained", kind: "edu" },
  ],
};

/** Rank helper for choosing weakest/strongest dims and bucket tone. */
const rank: Record<BucketKey5, number> = {
  at_risk: 1,
  vulnerable: 2,
  building: 3,
  thriving: 4,
};

export type DimKey = keyof RecCatalog;

/**
 * Recommend items based on:
 * - primary: weakest dimension first (give 2 items)
 * - secondary: second-weakest dimension (give 1 item)
 * - bucket: if at_risk/vulnerable, prefer "tool"/"product" with immediate help; if thriving, add “edu” depth
 */
export function recommend(
  dimsSortedWeakToStrong: DimKey[],
  bucket: BucketKey5
): RecItem[] {
  // Safety rails
  const dims = dimsSortedWeakToStrong.filter(d => d in CATALOG) as DimKey[];
  const primary = dims[0] ?? "habits";
  const secondary = dims[1] ?? "stability";

  const preferImmediate = rank[bucket] <= 2; // at_risk or vulnerable
  const pick = (dim: DimKey, n: number) => {
    const pool = CATALOG[dim];
    if (!pool) return [];
    // For earlier buckets, bias to tools/products first; for stronger, bias to edu first.
    const bias = preferImmediate
      ? (i: RecItem) => (i.kind === "tool" || i.kind === "product" ? 0 : 1)
      : (i: RecItem) => (i.kind === "edu" ? 0 : 1);
    return [...pool].sort((a, b) => bias(a) - bias(b)).slice(0, n);
  };

  const recs: RecItem[] = [];
  recs.push(...pick(primary, 2));
  if (secondary !== primary) recs.push(...pick(secondary, 1));
  // Deduplicate by href
  const seen = new Set<string>();
  return recs.filter(r => (seen.has(r.href) ? false : (seen.add(r.href), true)));
}
