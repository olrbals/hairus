import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const [layout, globals, bottomNav, topButton, booking, appScroll, designerDetail] = await Promise.all([
  readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../src/components/bottom-nav.css", import.meta.url), "utf8"),
  readFile(new URL("../src/components/glass-top-button.css", import.meta.url), "utf8"),
  readFile(new URL("../src/components/prototype/booking.module.css", import.meta.url), "utf8"),
  readFile(new URL("../src/lib/app-scroll.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/components/prototype/designer-detail.tsx", import.meta.url), "utf8"),
]);

test("desktop shell adds the requested HAIRUS branding outside the mobile app", () => {
  const brandIndex = layout.indexOf('className="desktop-brand"');
  const shellIndex = layout.indexOf('className="mobile-shell"');

  assert.ok(brandIndex >= 0);
  assert.ok(shellIndex > brandIndex);
  assert.match(layout, />HAIRUS<\/p>/);
  assert.match(layout, />탐색부터 예약까지, 한 번에\.<\/p>/);
});

test("desktop shell uses a black outer background without changing the mobile shell", () => {
  assert.match(globals, /body\{[^}]*background:#111/);
  assert.match(globals, /\.mobile-shell\{[^}]*max-width:var\(--mobile-width\)[^}]*margin:auto[^}]*background:white/);
  assert.match(globals, /@media\(max-width:430px\)\{body\{background:#fff\}\}/);
  assert.match(globals, /@media\(min-width:1160px\)\{\.desktop-brand\{/);
  assert.match(globals, /\.desktop-brand__logo\{font-size:72px/);
  assert.match(globals, /\.desktop-brand__copy\{margin-top:12px/);
});

test("desktop frame has a bounded viewport with an independent content scroller", () => {
  assert.match(layout, /className="mobile-shell"[^]*className="mobile-scroll"/);
  assert.match(globals, /--desktop-frame-height:min\(932px,100dvh\)/);
  assert.match(globals, /top:var\(--desktop-frame-offset\);left:calc\(50% - 215px\)/);
  assert.doesNotMatch(globals, /\.mobile-shell\{[^}]*transform:translate\(-50%,-50%\)/);
  assert.match(globals, /\.mobile-shell\{[^}]*height:var\(--desktop-frame-height\)[^}]*overflow:hidden[^}]*border-radius/);
  assert.match(globals, /\.mobile-scroll\{[^}]*height:100%[^}]*overflow-y:auto[^}]*overscroll-behavior:contain/);
  assert.match(globals, /\.mobile-scroll\{display:contents\}/);
});

test("desktop headers and viewport CTAs stay pinned to the phone frame", () => {
  assert.match(globals, /\.mobile-scroll \.hairus-page-header\{position:sticky;top:0;z-index:30\}/);
  assert.match(globals, /\.mobile-scroll \.bottom-cta-screen>\.bottom-cta-actions\{position:fixed/);
  assert.match(globals, /bottom:var\(--desktop-frame-offset\)/);
});

test("desktop fixed controls use the frame while mobile keeps viewport behavior", () => {
  assert.match(bottomNav, /@media\(min-width:431px\)[^]*position:absolute[^]*bottom:0/);
  assert.match(topButton, /@media\(min-width:431px\)[^]*position:absolute[^]*right:22px/);
  assert.match(booking, /@media\(min-width:431px\)\{\.footer\{bottom:var\(--desktop-frame-offset\)/);
  assert.match(appScroll, /document\.querySelector<HTMLElement>\('\.mobile-scroll'\)/);
  assert.match(appScroll, /else window\.scrollTo\(options\)/);
});

test("designer section links target the app scroller with the sticky stack offset", () => {
  assert.match(designerDetail, /appScrollToElement\(section,stickyNavigationOffset/);
  assert.match(designerDetail, /onClick=\{event=>goToSection\(event,'works'\)\}/);
  assert.match(designerDetail, /window\.history\.replaceState\(window\.history\.state,'',`#\$\{sectionId\}`\)/);
});
