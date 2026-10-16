<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## HAIRUS typography

All text uses `letter-spacing: -0.02em` (Figma -2%). Keep this shared rule in `src/app/globals.css`; do not add page-specific tracking overrides unless explicitly requested. This is a relative value, never `-2px`. Preserve SVG/icon artwork.

## HAIRUS bottom-sheet selection chips

Use `SelectionChip` from `src/components/selection-chip.tsx` for every text-selection chip inside a `BottomSheet`, including new screens. Figma nodes `1074:2674` and `1074:2681` are the source of truth: content-hugging width/height (not a fixed or minimum 48px height), 16px horizontal / 12px vertical padding, 20px radius, Pretendard 14px / 130% line height / -0.02em tracking, selected black and unselected subtle gray. Do not restyle these buttons in individual page stylesheets. Preserve each sheet's option labels, selection logic and chip-group spacing. Exclude image cards, swatches, dropdowns and toggles.
