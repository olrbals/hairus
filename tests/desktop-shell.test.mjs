import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const [layout, globals] = await Promise.all([
  readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/globals.css", import.meta.url), "utf8"),
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
