# Articles POPUP & ISSUE UX/UI verification

Base: `97a9b8794273da963aa60fb4c4d4733b5cf9b220`, branch `codex/hair-profile-flow`.

Remote and local heads matched before editing. The working tree was clean. Other branches and worktrees were left untouched.

## Changes

- POPUP: the existing 64px header is sticky at the top; its original home link, icon and layout remain intact. Sticky positioning keeps the header in normal document flow.
- SAVE: verified Figma node `920:4037` and its exact uploaded asset. The current `save.png` is already the same asset (SHA256 `D0316914FE461E291427C2C8987F1AC8DE368ADD287C783EEB8924964D70AF96`), so no image files were replaced.
- Restored the Figma image frame of 212 × 208 at 430px, proportional at narrower widths. Source size is 139% × 113.93%, with left/top offsets -19.45% / -6.73%. The local global `object-fit: cover` had been introducing an additional crop inside that box; SAVE now uses Figma's default fill rendering with those confirmed dimensions and offsets. Both cards and their surrounding margins match the reference. DISCOVER, TRY and TOUCH image sizes/sources are unchanged.
- BENEFIT: reused the existing `Button` component and shared primary CTA CSS (61px height, 16px type, 4px radius, 20px 24px padding). Removed the duplicate benefit button styles and inline blur. Original labels, arrows and coupon/session dialog actions remain.
- POPUP Korean text, including dialog text, uses Pretendard, 130% line height and -1.2px tracking. English editorial fonts remain unchanged. Benefit headings are 24px.
- Removed the POPUP main's 15px bottom padding; the final footer ends at the page bottom without an extra gap.
- ISSUE: sticky original 64px header and 76px EPILOGUE margin. These changes use an issue-only class because the component is shared with `/articles/care`; care retains its original static header and 52px margin.

Figma reference: https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T/?node-id=920-4037

## Validation

- TypeScript: `npm run typecheck` PASS.
- Existing tests: `npm test` PASS, 42/42.
- Production build: `npm run build` PASS, Next.js 16.4.0 / Turbopack.
- Browser regression: `node outputs/articles-popup-issue/verify.cjs` PASS, 109 checks, zero runtime/hydration errors.
- Widths 430 / 390 / 360 at height 875: original header dimensions and initial hero positions; header pinned and back control accessible at 600px and page end; working back navigation; complete images; no horizontal overflow or clipped experience/benefit/footer text.
- Verified both benefit dialogs open with the original text and close through their existing confirmation buttons.
- Verified computed button styles, all Korean text nodes, SAVE source transforms/frame ratio, actual 76px ISSUE epilogue gap and zero trailing POPUP gap.
- `/articles/care` rendered main markup, header behavior and epilogue spacing match the recorded baseline at all three widths.
- Inspected SAVE and BENEFIT captures against the reference and sticky ISSUE capture. The directory contains before/after full-page and focused screenshots, baseline data and QA measurements.

## Changed source files

1. `src/components/prototype/popup-detail.tsx`
2. `src/components/prototype/popup-detail.css`
3. `src/components/prototype/article-homecare.tsx`
4. `src/components/prototype/article-homecare.css`
5. `src/app/articles/[id]/page.tsx`

Verification artifacts: `outputs/articles-popup-issue/`.

No unresolved implementation conflicts. No shared button CSS, image asset, unrelated page, main branch or production deployment was modified.
