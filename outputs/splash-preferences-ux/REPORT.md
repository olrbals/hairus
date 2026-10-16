# Splash ~ Preferences UX/UI verification

- Base: `codex/hair-profile-flow`, `a9f0f88d9e9abc2fe9c0e37df00704f5f94a0c2c`.
- Remote was fetched before editing; the clean local branch was fast-forwarded to the requested base. Other worktrees were left untouched.
- Figma reference: https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=1060-2668 (section and text node `1060:2671` inspected).

## Implemented

- Black splash with a centered white Cormorant Garamond Bold wordmark: 60px, 78px line height, -1.2px letter spacing. Six reserved letter slots appear in H/A/I/R/U/S order, with 360ms opacity/4px movement and 120ms stagger. The 2400ms hold starts after all animations actually finish, followed by a 180ms fade. Font readiness, unmount cleanup, reduced motion, and existing entry routing are preserved.
- Shared nickname formatting and SSR-safe subscription through `useSyncExternalStore`. Blank, missing, or invalid nicknames fall back to 사용자. Existing entry storage/schema and login state are preserved; same-tab writes and cross-tab storage events refresh consumers. No 민서 strings remain in `src`. Designer identities and booking data were not changed.
- Over-limit preference attempts preserve selected answers and restart a 280ms horizontal hint animation. Hint copy and layout stay unchanged. Reduced motion uses a static underline/color cue and the existing live region announces every attempt. Single selection and the exclusive concern option retain their behavior.
- One shared preference action group across questions 1–4 and completion: 56px primary/secondary, 8px gap, 24px side insets, 41px bottom inset plus safe area. Step navigation and completion/restart state handling remain intact. Scoped specificity resolves the existing global 61px CTA override.
- Completion card content and imagery preserved. Existing invalid narrow-screen scale calculation was replaced with a proportional 0.9 scale below 380px to avoid edge clipping; intro width is constrained at mobile sizes. No other page design was changed.

## Validation

- `npm run typecheck`: PASS.
- `npm test`: PASS, 42 tests (39 existing + 3 nickname regressions).
- `npm run build`: PASS, Next.js 16.4.0 / Turbopack, all routes compiled.
- `node outputs/splash-preferences-ux/verify.cjs`: PASS, 83 browser assertions on the production build, zero runtime/hydration errors.
- Widths 430 / 390 / 360 at height 875: all 15 survey/completion screens have matching action geometry, no choice/card overlap or horizontal clipping, and loaded existing image assets. Screenshots are saved alongside this report.
- Splash normal/reduced motion, geometry stability, letter delays, full-word hold, initial onboarding route, demo welcome route, completed-onboarding login route, and early exit checked. Measured animation-completion → destination: 2640ms, including the 180ms fade and route processing; the code starts the fade after the 2400ms hold.
- Repeated selection limits on questions 2/3/4, single-choice replacement, exclusive concern selection, previous/next persistence, survey → loading → complete → home, restart persistence, saved/blank nicknames, reload, MY, analysis result, and cross-tab nickname updates checked.
- Built-in prototype login was exercised through its existing provider sheet. Existing booking and analysis regression tests pass. Real authentication remains the existing demo implementation.
- Local build and browser verification required normal execution permissions because the restricted environment stalled Turbopack and blocked localhost connectivity.

## Changed files

1. `src/components/entry/splash.tsx`
2. `src/styles/entry.css`
3. `src/lib/entry-state.ts`
4. `src/lib/use-nickname.ts` (new)
5. `src/app/(entry)/welcome/page.tsx`
6. `src/app/analysis/result/page.tsx`
7. `src/components/prototype/my.tsx`
8. `src/components/prototype/designer-detail.tsx`
9. `src/components/prototype/preference-transition.tsx`
10. `src/components/prototype/surveys.tsx`
11. `src/components/prototype/preference-actions.tsx` (new)
12. `src/styles/preference-transition.css`
13. `tests/entry-state.test.mjs`
14. `outputs/splash-preferences-ux/` (report, browser regression script, QA measurements, 19 screenshots)

No unresolved implementation conflicts. Main/production deployment are outside this change.
