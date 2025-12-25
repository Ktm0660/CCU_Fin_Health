# Project Map

## Routes / Pages (`/pages`)
- `_app.tsx`: wraps all pages with `Layout` and `ErrorBoundary` for consistent chrome and error catching.
- `_document.tsx`: sets HTML shell and body styling.
- `index.tsx`: landing hero with bilingual copy, CTA to `/assessment`, and quick metric teaser.
- `assessment.tsx` (`assessment-v2.tsx` re-exports): single-question flow for 22-question assessment storing answers locally and routing to results.
- `results.tsx`: scores saved answers, bucketizes into profiles, and shows recommendations plus links to tools/glossary.
- `results-v2.tsx`: placeholder metrics that read v2 answers from `localStorage` and render simple pillar bars.
- `plan.tsx`: builds a persona-based 30-day action plan from scored answers or provided buckets.
- `learn.tsx`: filterable list of lessons by area (Habits/Confidence/Stability) with completion chips.
- `resources.tsx`: filter/searchable Tools & Resources grid (area + type chips) pulling from `data/resources`.
- `fees.tsx`: bilingual fee schedule table (placeholder amounts).
- `glossary.tsx`: inline bilingual glossary with search and tag-based hints to related tools.
- `jargon.tsx`: glossary using `data/jargon` + `TermCard`, with search filtering.
- `products.tsx`: static “Optional CU Products” tiles describing product highlights.

## Key UI Components (`/components`)
- **Layout & navigation:** `Layout` (wraps header + page container), `SiteHeader` (sticky top nav using i18n labels and LanguageToggle), `Nav` + `MobileMenu` (legacy responsive nav), `Footer` (footer nav + LanguageToggle), `LanguageToggle` (localStorage-backed lang switch).
- **Assessment & results:** `QuestionCard` (renders localized question/options), `Radar` (radar chart component), `ErrorBoundary` (protects page renders).
- **Learning/resources:** `LessonCard` (lesson summary with completion), `ResourceCard` (resource card with type badges), `TermCard` (glossary term display), `LessonCard`/`ResourceCard` rely on `lib/storage` tracking.
- **Shared UI:** `SiteHeader` metric chips/links, `MobileMenu` overlays, utility chips in cards.

## Assessment & Scoring Logic
- Questions and scoring weights live in `data/assessment.ts` (22 questions, pillars: Habits, Confidence, Stability, Trust, Resilience). Each option holds per-pillar weights; `scoreAnswers` sums weights, `perDimMax` derives maxima, and `bucketize5` maps totals to five buckets with copy in `bucketCopy`.
- `pages/assessment.tsx` drives the flow: records `AnswerMap`, saves to `localStorage`/`lib/state`, and routes to `/results` with answers in query.
- `pages/results.tsx` loads answers (query → localStorage → `lib/state` fallback), scores via `scoreAnswers`, bucketizes for profile copy, and surfaces resource recommendations via `data/recommendations`.
- `pages/plan.tsx` can accept precomputed scores/buckets or re-score answers, then maps to personas using `data/personas` and selects recommendations (limit + dims) from `data/recommendations`.
- `pages/results-v2.tsx` contains a placeholder mapper that sums stored answers and distributes totals across pillars for non-crashing beta UI.

## Bilingual / i18n Approach
- Language is inferred from `router.locale`, `lang` query param, or `localStorage` via `lib/lang.ts` (`getLangFromQueryOrStorage`, `setLang`).
- `LanguageToggle` updates `localStorage` and rewrites the current URL with `lang=` to force reload in the other language.
- `lib/i18n.ts` holds key-based string dictionaries (`t` helper); `lib/locale.ts` offers lightweight `detectLocale`, `t(en,es,loc)`, and `translateOptionLabel` for assessment options.
- Pages often use inline ternaries or the `t` helper; nav/footer/header apply `lang` to links so locale persists across navigation.

## Tools & Optional CU Products
- Tools & Resources surface in `pages/resources.tsx`, fed by `data/resources` (types: explainer/tool/download/video/product; areas: habits/confidence/stability/trust). Cards open `href` targets and expose tags for quick scanning.
- Recommendations on results/plan pages pull specific resource IDs from `data/recommendations.ts` (bucket → resource map) to populate the action plan.
- Optional CU products are showcased on `pages/products.tsx` as static tiles; also linked from nav/footer and from resource type `product` entries where applicable.
