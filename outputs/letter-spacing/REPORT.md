# Global letter spacing

Base: f53aabd, branch codex/hair-profile-flow.

Removed 232 local CSS tracking declarations and applied one zero-specificity global rule: -0.02em. Each element calculates its own -2% value rather than inheriting the parent's computed pixel spacing. Placeholder and generated text are included; SVG artwork is excluded. No !important added. AGENTS.md records the shared design-system rule for future changes.

Verified all CSS diffs contain only letter-spacing changes. Font families, sizes, weights, line heights, colors, spacing and interaction code are unchanged.

Validation: TypeScript PASS; all 42 tests PASS; Production build PASS. Browser audit: 50 routes × 3 widths (430/390/360) = 150 screens, 4594 text elements, zero tracking mismatches, zero horizontal overflow, zero runtime errors. Popup dialog checked separately. Representative full-page captures visually inspected. Stateful routes may show their existing empty/entry state when no profile or booking is saved. No exhaustive comparison of all user-generated content states is claimed.

Changed files:

- AGENTS.md
- src/app/globals.css
- src/components/prototype/airy-layered-detail.css
- src/components/prototype/article-homecare.css
- src/components/prototype/booking.module.css
- src/components/prototype/designer-detail.module.css
- src/components/prototype/hair-note-editorial.module.css
- src/components/prototype/in-focus-editorial.css
- src/components/prototype/matching-survey.module.css
- src/components/prototype/people-explore.module.css
- src/components/prototype/popup-detail.css
- src/components/prototype/reviews.module.css
- src/components/prototype/salon-detail.module.css
- src/components/prototype/saved.module.css
- src/components/prototype/savenote.module.css
- src/components/prototype/style-explore.module.css
- src/styles/analysis.css
- src/styles/entry.css
- src/styles/home-popup.css
- src/styles/my.css
- src/styles/preference-transition.css
- src/styles/primary-cta.css
- src/styles/prototype.css

Verification artifacts: outputs/letter-spacing/ (script, QA measurements, screenshots, report).
