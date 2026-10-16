const {chromium} = require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');

const base = 'http://127.0.0.1:3017';
const routes = [
  '/welcome', '/onboarding/1', '/analysis/guide', '/analysis/camera', '/analysis/result',
  '/preferences/intro', '/preferences/1', '/preferences/2', '/preferences/3', '/preferences/4', '/preferences/complete',
  '/recommendation/1', '/explore', '/explore?category=designer', '/explore?category=salon', '/saved',
  '/styles/airy', '/designers/sohee', '/designers/sohee/portfolio', '/designers/sohee/reviews',
  '/salons/arvo', '/salons/arvo/designers', '/salons/arvo/reviews',
  '/reservation/sohee/service', '/my/recent', '/my/reservations', '/my/settings', '/magazine',
  '/articles/care', '/articles/issue', '/articles/popup', '/in-focus/soft-bob',
];
const widths = [430, 390, 360];
const failures = [];
const audit = [];

(async () => {
  const browser = await chromium.launch({headless:true, channel:'chrome'});
  for (const width of widths) {
    const context = await browser.newContext({viewport:{width,height:760}});
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on('pageerror', error => runtimeErrors.push(error.message));
    for (const route of routes) {
      await page.goto(base + route, {waitUntil:'networkidle'});
      const header = page.locator('.hairus-page-header').first();
      if (!await header.count()) {
        failures.push(`${width}px ${route}: shared page header missing`);
        continue;
      }
      const initial = await header.evaluate(element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const sibling = element.nextElementSibling?.getBoundingClientRect();
        return {top:rect.top,bottom:rect.bottom,height:rect.height,position:style.position,background:style.backgroundColor,siblingTop:sibling?.top ?? null};
      });
      const back = page.locator('.hairus-header-back').first();
      let backMetrics = null;
      if (await back.count()) {
        backMetrics = await back.evaluate(element => {
          const rect = element.getBoundingClientRect();
          const image = element.querySelector('img');
          const imageRect = image?.getBoundingClientRect();
          return {width:rect.width,height:rect.height,imageWidth:imageRect?.width,imageHeight:imageRect?.height,src:image?.getAttribute('src')};
        });
        if (Math.abs(backMetrics.width-44)>.1 || Math.abs(backMetrics.height-44)>.1 || Math.abs(backMetrics.imageWidth-44)>.1 || Math.abs(backMetrics.imageHeight-44)>.1 || backMetrics.src!=='/assets/figma/v1/30ced.svg') {
          failures.push(`${width}px ${route}: back control ${JSON.stringify(backMetrics)}`);
        }
      }
      if (initial.position !== 'sticky') failures.push(`${width}px ${route}: position ${initial.position}`);
      if (initial.siblingTop !== null && initial.siblingTop + .5 < initial.bottom) failures.push(`${width}px ${route}: next content overlaps header initially`);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(40);
      const scrolled = await header.evaluate(element => ({top:element.getBoundingClientRect().top, bottom:element.getBoundingClientRect().bottom}));
      const canScroll = await page.evaluate(() => document.documentElement.scrollHeight > innerHeight + 1);
      if (canScroll && Math.abs(scrolled.top) > .5) failures.push(`${width}px ${route}: sticky top ${scrolled.top}`);
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      if (horizontalOverflow) failures.push(`${width}px ${route}: horizontal overflow`);
      const saveVisible = route==='/designers/sohee' || route==='/salons/arvo' ? await header.locator('.proto-save').isVisible() : null;
      if (saveVisible === false) failures.push(`${width}px ${route}: save action hidden`);
      audit.push({width,route,initial,scrolled,canScroll,back:backMetrics,saveVisible,horizontalOverflow});
    }
    if (runtimeErrors.length) failures.push(`${width}px runtime errors: ${runtimeErrors.join(' | ')}`);
    await page.goto(base + '/articles/popup', {waitUntil:'networkidle'});
    await page.screenshot({path:path.join(__dirname, `popup-${width}.png`), fullPage:true});
    await page.goto(base + '/home', {waitUntil:'networkidle'});
    if (await page.locator('.hairus-page-header').count()) failures.push(`${width}px /home: unexpected page header added`);
    await context.close();
  }
  const interactionContext = await browser.newContext({viewport:{width:390,height:760}});
  const interactionPage = await interactionContext.newPage();
  await interactionPage.goto(base + '/home', {waitUntil:'networkidle'});
  await interactionPage.goto(base + '/designers/sohee', {waitUntil:'networkidle'});
  await interactionPage.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const save = interactionPage.locator('.hairus-page-header .proto-save');
  await save.click();
  if (!await interactionPage.locator('dialog[open]').isVisible()) failures.push('designer save action did not open SAVENOTE while header was sticky');
  await interactionPage.keyboard.press('Escape');
  await interactionPage.locator('.hairus-header-back').click();
  await interactionPage.waitForURL(base + '/home');
  await interactionPage.goto(base + '/articles/popup', {waitUntil:'networkidle'});
  await interactionPage.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await interactionPage.locator('.hairus-header-back').click();
  await interactionPage.waitForURL(base + '/home');
  await interactionContext.close();
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'audit.json'), JSON.stringify({checks:audit.length,failures,audit}, null, 2));
  console.log(JSON.stringify({checks:audit.length,failures}, null, 2));
  process.exitCode = failures.length ? 1 : 0;
})().catch(error => {console.error(error); process.exitCode=1;});
