# Airy Layered image verification

Base: `origin/codex/final-editorial-airy-discover-savenote` at `8d41b25`.
Branch: `codex/airy-layered-image-polish`.
Figma: `Ja8Ep1JwxOOFgMArfYr16T`, style01 `920:4471`.

## Original sources and delivered resolution

| Slot | Node | Original pixels | Delivered file pixels | 430px viewport slot | Action |
| --- | --- | --- | --- | --- | --- |
| FRONT | 920:4487 | 1024×1557 | 1024×1557 | 382×538 | Existing original retained |
| SIDE | 920:4489 | 2171×724 composite | 2171×724 | 382×538 | Replaced 382×538 export with original composite |
| BACK | 920:4491 | 2171×724 composite | 2171×724 | 382×538 | Replaced 382×538 export with original composite |
| OTHER SIDE | 920:4493 | 2171×724 composite | 2171×724 | 382×538 | Replaced 382×538 export with original composite |
| 샌드펌 | 920:4546 | 1024×1536 | 1024×1536 | 183×298 | Existing original retained |
| 스트레이트 레이어드 컷 | 920:4550 | 1024×1536 | 1024×1536 | 183×298 | Existing original retained |
| 허쉬컷 | 920:4554 | 983×1600 | 983×1600 | 183×298 | Original retained; Figma crop restored |

All seven slots have their original Image Fill source available. No extraction failures. No generated images or screenshots used as website assets. The composite is saved byte-for-byte, without resizing, sharpening or recompression. Each angle uses approximately 514×724 source pixels; this improves on the old 382×538 exports but does not create additional source detail for high-DPI screens.

## Figma source SHA-1 verification

- FRONT / existing `v1/5582e.png`: `34b10c03ab935330d44a6adb4879750c8924ecdd`
- Three angles / new `discover-airy/angles-original.png`: `2362176418fe7b2361369c3e0303a9bfac221f57`
- Sand / existing `v1/03042.png`: `f5f2b713061c62270ede35d7d6df2dda619d23ab`
- Straight / existing `v1/cf399.png`: `13947b5f200135ea1d109900ebbf8fa0bf6c8f2c`
- Hush / existing `v1/deb8c.png`: `ea4ed6074bad6573e33c432f631ac70ef4366e5f`

The byte hashes match the imageHash read directly from each Figma layer. FRONT, sand, straight and hush were already the correct people and hairstyles, so their asset files were not replaced.

## Crop implementation

Original normalized imageTransform `[a,0,x;0,b,y]` is represented with image width `100/a%`, height `100/b%`, left `-100*x/a%` and top `-100*y/b%`, inside a clipped image slot. No rounding to whole pixels or repeated image resampling.

| Slot | a | b | x | y |
| --- | --- | --- | --- | --- |
| SIDE | .2367880791425705 | 1 | .746972918510437 | -3.7201353109139745e-12 |
| BACK | .23675724864006042 | 1 | .5123750567436218 | -.00013220928667578846 |
| OTHER SIDE | .2367880791425705 | 1 | .2630881369113922 | .00021716451738029718 |
| Hush | .9615384340286255 | .9619784951210022 | .02099890261888504 | .03723150119185448 |

FRONT, sand and straight retain centered object-fit:cover, matching Figma FILL. Slide order remains FRONT → SIDE → BACK → OTHER SIDE. The original composite contains another front view, which is deliberately not used in place of the separate Figma FRONT image.

## Validation and limits

- `node node_modules/typescript/bin/tsc --noEmit`: passed on final source.
- `node node_modules/next/dist/bin/next build --webpack`: passed on final source, all 26 static pages generated.
- Default Turbopack build could not resolve the shared node_modules junction outside its project root. Webpack build verified without changing project configuration.
- `git diff --check`: passed.
- Production server, Chrome, 430×932 CSS pixels, DPR 1: all four images decoded; 382×538 gallery slots; 183×298 card slots; all four progress buttons; real CDP touchStart/touchMove/touchEnd swipes in both directions; progress updates; no page runtime errors. See `qa.json` and `verify.cjs`.
- Figma frame render and actual screenshots visually inspected for FRONT and visible More Styles cards. All four actual slides and Hush inspected separately. Hidden Figma slides are clipped by their parent, so their exact source and crop were verified via layer imageHash/imageTransform and generated design context rather than claiming an independent pixel-perfect screenshot comparison.
- Full-frame screenshot includes existing title/text/navigation differences from Figma. These are outside image scope and were preserved.
- At DPR 1, the delivered sources provide sufficient source pixels for their displayed areas. No claim of 2× or 3× native detail for the 724px-tall angle source.
- No real phone hardware test was performed.
- Existing slider/save/navigation logic, text, typography, margins, section sequence and other routes have no source changes. This is a source diff check, not an end-to-end regression test of every other route.

## Runtime files changed

- `public/assets/figma/discover-airy/angles-original.png`
- `src/components/prototype/airy-layered-detail.tsx`: image source/crop metadata and card image clipping wrapper only.
- `src/components/prototype/airy-layered-detail.css`: Airy image positioning/clipping rules only.

Other changed files under this report directory are verification evidence. Existing worktrees and uncommitted files were preserved.
