# HAIRUS shared page headers

## Applied

- Added shared `hairus-page-header` sticky behavior for existing top navigation headers.
- Added one shared `HeaderBackIcon` and `hairus-header-back` geometry based on `.hc-header` (44 × 44 px control and artwork).
- Preserved each header's existing height, title, save/right action, and navigation handler.
- Kept HOME without a page header and excluded semantic content headers such as section headings and login copy.
- Replaced only vertical-blocking page overflow with `overflow-x: clip` on long editorial and preference screens so sticky positioning works.

## Covered routes

- Entry and analysis: `/welcome`, `/onboarding/[step]`, `/analysis/*`
- Preferences and recommendation: `/preferences/intro`, `/preferences/1`–`4`, `/preferences/complete`, `/recommendation/[step]`
- Explore and archive: `/explore`, designer/salon explore variants, `/saved`
- Details and booking: style, designer, salon, portfolio/review, reservation, and MY subpages
- Editorial: magazine, article care/issue/popup, and IN FOCUS detail

## Verification

- TypeScript: pass
- Tests: 42/42 pass
- Production build: pass (Next.js 16.4.0)
- Browser audit: 96 route/viewport combinations at 430, 390, and 360 px; 0 failures
  - sticky header top position after scrolling
  - 44 × 44 px shared back control and icon
  - no initial content overlap or horizontal overflow
  - designer/salon save action remains visible
  - SAVENOTE opens from the sticky header
  - back navigation and POPUP home navigation work
  - HOME has no newly introduced page header

Raw results are in `audit.json`; full-page POPUP captures are included for all three viewport widths.
