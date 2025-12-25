# Next Steps (Prioritized)

1) Harden mobile nav & import hygiene: fix missing `useState` import in `MobileMenu` and prune unused nav variant to avoid runtime errors and reduce bundle weight.
2) Centralize layout: standardize on either `SiteHeader` or `Nav`/`Footer` across pages to eliminate duplicate chrome and improve consistency.
3) Strengthen assessment-v2: replace placeholder metric mapper with real scoring and shared data structures to align beta UI with core assessment logic.
4) Persist language across links: ensure all CTAs append `lang=` consistently (home hero buttons, resources cards) so bilingual experience doesn’t reset.
5) Expand Spanish content: complete `text_es` fields in `data/assessment` options and resources to make i18n coverage symmetrical.
6) Add tests for scoring: unit-test `scoreAnswers`, `bucketize5`, and persona selection to prevent regressions when editing questions/weights.
7) Normalize storage keys: converge `assessmentV2Answers` and `ccu_answers_v1` into one versioned schema with migrations to simplify state handling.
8) Wire tools/products analytics: track clicks on tools/resources and optional products to learn what members use most.
9) Improve fees page: populate real fee schedule and add accordions for disclosures to make compliance-ready.
10) Accessibility sweep: add aria labels/roles to interactive chips/cards and ensure focus states are visible across components.
