# HAIRUS reservation review — 2026-10-18

## Scope and baseline

- Branch: `codex/reservation-one-page-1018`.
- Fetched `origin/main`: `e91d58ecf922fd7ff247b659efd65b9464c514ce`.
- `origin/codex/hairus-final-integration-1016` has no commits outside current main. Other branches, worktrees and pre-existing untracked files were preserved.
- Existing `BookingFlow` and `/reservation/[designerId]/[step]` route were retained. All four legacy step URLs display the same continuous reservation page and enter at the relevant section.

## Verified Figma sources

File: https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T?node-id=1110-2658

| Node | Use |
| --- | --- |
| `1110:2658` | Full reservation structure and screenshot |
| `1119:3148` | Header, 64 × 86 designer identity, navigation |
| `1119:3149` | MENU names and prices |
| `1110:2681` | Calendar, time states and visit preview |
| `1118:3013`, `1118:2985` | Document card, editable hair/history/style, request |
| `1113:2856` | Minimal reservation summary |

Original designer image, back icon and common save artwork are reused from local assets. The original 10 × 10 edit chevron was downloaded from Figma. No temporary asset URLs are used at runtime. Inspected node IDs and source URLs are in code comments.

## Result and intentional differences

- SERVICE → DATE → HAIR NOTE → MY RESERVATION appear on one page. Header/profile/navigation stack at 0/64/150px; section headings align at 222px. Manual scrolling updates the active tab. Choices do not advance sections.
- SERVICE uses six category chips and 22 single-select services. Five cut options follow the user's revised names/prices; the remaining menu follows the inspected Figma prices. Descriptions and approximate timings extend the unfinished menu interactions.
- Existing `cut`, `perm`, `color` IDs and prices remain compatible. All service metadata lives in `catalog.ts`. Existing designer/salon preview lists still show their three featured services through references to this catalog.
- Cut/clinic/other: up to 60 minutes, last start 20:00. Bangs: 30 minutes, 10,000 won. Thermal perm: existing 150-minute estimate retained, last start 18:00. Color: 120 minutes, last start 18:00.
- Bleach: user confirmed last start 18:00; duration stays unspecified and is shown as consultation guidance. No duration is invented.
- Bangs shampoo is explanation only: no control or added charge.
- Calendar uses actual dates and Monday-first columns; holidays follow existing Arvo data. Stable occupancy supplies full dates and unavailable slots. Known service durations are checked against occupied intervals. Service changes clear incompatible times with a notice; date changes clear time.
- Notes use existing profile, preferences and personalized advice. Each field opens the common BottomSheet, and all sheet text chips use SelectionChip. Changes apply on Save; cancellation preserves the original. Request edits save immediately.
- The existing SAVENOTE Glass toggle is extracted into a shared controlled component without changing its artwork/CSS. Booking delivery uses separate `draft.shareNote`, leaving `state.saveNoteEnabled` unchanged. OFF preserves content and permits an empty note. Completion respects delivery status.
- Existing local-storage version and required booking fields are retained. Optional delivery and price/name snapshots are additive. Previously saved bookings still render; new booking summaries, completion and MY use matching prices.
- The bottom action is the existing shared Primary Button: 61px, with its existing finish. This follows the user's explicit preference over page-specific Figma sizing. Global CTA and tracking styles were not modified.
- No reservation API, payment flow, DB or new prototype-disclaimer copy was added.

## Validation

- `npm run typecheck`: PASS.
- `npm test`: 65/65 PASS (existing suites plus reservation regressions).
- `npm run build`: PASS, Next.js 16.4.0.
- Actual Chrome, production build, 430/390/360px: 115 checks PASS. Coverage: layout, sticky/anchor/spy, selection, compatible/incompatible times, full dates, three sheet editors, shared chip dimensions, note toggles, reload, summary, completion and MY persistence.
- Additional edge coverage: 16 checks PASS. Coverage: designer CTA, initial service query, keyboard toggle, Escape/cancel, bleach cutoff, OFF plus empty note, old step entry offsets and unknown designer recovery.
- Browser scripts and JSON results are in `work/reservation-one-page-1018/`. Screenshots are named `service-WIDTH.png`, `date-WIDTH.png`, `hair-note-WIDTH.png`, `review-WIDTH.png`.

## Release boundary

Only the feature branch is committed/pushed for Preview review. No main merge, force push or Production deployment is performed.
