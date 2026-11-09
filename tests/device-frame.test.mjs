import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const [layout, globals, frame, frameCss, saved, styleExplore, peopleExplore] = await Promise.all([
  readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../src/components/device-frame.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/styles/device-frame.css", import.meta.url), "utf8"),
  readFile(new URL("../src/components/prototype/saved.module.css", import.meta.url), "utf8"),
  readFile(new URL("../src/components/prototype/style-explore.module.css", import.meta.url), "utf8"),
  readFile(new URL("../src/components/prototype/people-explore.module.css", import.meta.url), "utf8"),
]);

test("desktop host page shows the app inside an iPhone mockup instead of rendering it twice", () => {
  assert.match(layout, /import "\.\.\/styles\/device-frame\.css"/);
  assert.match(layout, /<DeviceGate><div className="mobile-shell">[^]*<\/div><\/DeviceGate>/);
  assert.match(layout, /window\.top!==window\.self\)root\.classList\.add\('device-screen'\)/);
  assert.match(layout, /matchMedia\('\(min-width: 431px\)'\)\.matches\)root\.classList\.add\('device-host'\)/);
  assert.match(frame, /return host \? <DeviceFrame\/> : children/);
  assert.match(frameCss, /\.device-host \.mobile-shell,\.device-host \.skip-link\{display:none\}/);
});

test("the app runs in a fixed 430 × 874 phone viewport scaled uniformly to the window", () => {
  assert.match(frame, /screenWidth: 430, appHeight: 874/);
  assert.match(frame, /<iframe ref=\{frame\} className="device__app"/);
  assert.match(frame, /Math\.min\(1, \(viewportWidth - deviceSize\.margin\) \/ deviceSize\.width, \(viewportHeight - deviceSize\.margin\) \/ deviceSize\.height\)/);
  assert.match(frameCss, /\.device\{[^}]*width:458px;height:960px[^}]*transform:translate\(-50%,-50%\) scale\(var\(--device-scale,1\)\)/);
  assert.match(frameCss, /\.device__screen\{[^}]*width:430px;height:932px/);
  assert.match(frameCss, /\.device__status\{[^}]*height:58px/);
  assert.match(frameCss, /\.device__app\{[^}]*width:430px;height:874px/);
  assert.match(frameCss, /\.device__island\{/);
  assert.match(frameCss, /\.device__home\{/);
});

test("screens that fit the viewport do not scroll", () => {
  assert.match(globals, /\.mobile-shell\{[^}]*padding-bottom:0\}\.mobile-shell:has\(nav\.bottom-nav:not\(\[hidden\]\)\)\{padding-bottom:calc\(100px \+ env\(safe-area-inset-bottom\)\)\}/);
  assert.match(frameCss, /html\.device-screen\{overscroll-behavior:none\}/);
  for (const css of [saved, styleExplore, peopleExplore]) {
    assert.match(css, /^\.page\{min-height:calc\(100dvh - 100px - env\(safe-area-inset-bottom\)\);/);
  }
});
