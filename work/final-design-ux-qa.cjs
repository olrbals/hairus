// Run with HAIRUS_PLAYWRIGHT_MODULE pointing to an installed Playwright module.
// HAIRUS_QA_URL defaults to the local production build; baseline is optional.
const {chromium}=require(process.env.HAIRUS_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=process.env.HAIRUS_QA_URL||'http://127.0.0.1:3023';
const baseline=process.env.HAIRUS_BASELINE_URL;
const output=process.env.HAIRUS_QA_OUTPUT||'/private/tmp/hairus-qa-1016';
fs.mkdirSync(output,{recursive:true});
const checks=[],metrics=[],errors=[];
function check(value,label){assert.ok(value,label);checks.push(label);}
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({viewport:{width:430,height:874},deviceScaleFactor:1});
 await context.addInitScript(()=>sessionStorage.setItem('hairus.popup.seen','1'));
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 const go=async(route,url=base)=>{const response=await page.goto(url+route);check(response.status()===200,`${route} HTTP 200`);await page.evaluate(()=>document.fonts.ready);await page.locator('main').waitFor();};
 const shot=async name=>{await page.addStyleTag({content:'nextjs-portal{display:none!important}'});await page.screenshot({path:path.join(output,name+'.png'),fullPage:true});};
 const settle=async expected=>page.waitForFunction(expected=>Math.abs(Number(document.querySelector('.magazine-track').dataset.carouselPosition)-expected)<.000001,expected);
 try{
  // Entry spacing and the exact two-line legal text; every provider keeps demo entry.
  for(const index of [0,1,2,3]){
   await go('/login');
   check(await page.locator('.bottom-sheet').count()===0,'Login has no BottomSheet DOM');
   check(await page.locator('.login-methods').evaluate(el=>getComputedStyle(el).marginTop)==='200px','Login methods margin 200px');
   check(await page.locator('.login-legal').innerText()==='계속하면 서비스 이용약관과\n개인정보 처리방침에 동의하게 됩니다.','Login legal exact line break');
   await page.locator('.login-methods button').nth(index).click();await page.waitForURL('**/welcome');
   check(await page.locator('.bottom-sheet[open]').count()===0,`Login method ${index+1} enters Welcome without sheet`);
  }
  // Existing 5c2ffcd CTA geometry, including short screens that must scroll.
  const ctaMetrics=async()=>page.evaluate(()=>{const main=document.querySelector('.bottom-cta-screen'),cta=document.querySelector('.bottom-cta-actions');const r=main.getBoundingClientRect(),c=cta.getBoundingClientRect();const previous=cta.previousElementSibling.getBoundingClientRect();return {bottom:r.bottom-c.bottom,overlap:previous.bottom>c.top+.01,mainHeight:r.height,ctaHeight:c.height,documentWidth:document.documentElement.scrollWidth,viewport:innerWidth};});
  for(const width of [430,390,360])for(const height of [932,874,740,640]){
   await page.setViewportSize({width,height});
   for(const route of ['/welcome','/analysis/guide','/analysis/captured']){
    const url=route==='/analysis/captured'?'/analysis/guide':route;
    await go(url);
    if(route.endsWith('captured')){await page.getByRole('button',{name:'샘플 사진으로 체험'}).click();await page.waitForURL('**/analysis/captured');await page.locator('.captured-photo').waitFor();}
    const current=await ctaMetrics();
    check(Math.abs(current.bottom-40)<.1,`${route} ${width}x${height} CTA bottom 40px`);
    check(!current.overlap,`${route} ${width}x${height} content/CTA do not overlap`);
    check(current.documentWidth<=width,`${route} ${width}x${height} no horizontal overflow`);
    if(route==='/welcome'){
     check(await page.locator('.name-field').evaluate(el=>getComputedStyle(el).marginTop)==='120px',`Welcome ${width}px name margin 120px`);
     const input=page.locator('#display-name');await input.fill('검수');await input.focus();await input.evaluate(el=>el.scrollIntoView({block:'center'}));
     check(await input.isVisible(),'Welcome input remains reachable');
    }
    if(baseline){await go(url,baseline);if(route.endsWith('captured')){await page.getByRole('button',{name:'샘플 사진으로 체험'}).click();await page.waitForURL('**/analysis/captured');await page.locator('.captured-photo').waitFor();}const original=await ctaMetrics();check(Math.abs(current.ctaHeight-original.ctaHeight)<.1,`${route} ${width}x${height} approved CTA size preserved`);if(route!='/welcome')check(Math.abs(current.mainHeight-original.mainHeight)<.1,`${route} ${width}x${height} original height preserved`);}
    metrics.push({route,width,height,...current});
   }
  }
  // Complete the actual sample analysis once, then confirm result edit/persistence.
  await page.setViewportSize({width:430,height:874});await go('/analysis/guide');
  await page.getByRole('button',{name:'샘플 사진으로 체험'}).click();await page.waitForURL('**/analysis/captured');
  await page.getByRole('button',{name:'이 사진으로 분석'}).click();await page.waitForURL('**/analysis/result',{timeout:20000});
  await page.locator('.profile-summary').waitFor();
  for(const width of [430,390,360]){
   await page.setViewportSize({width,height:874});
   const summary=await page.locator('.profile-summary').evaluate(el=>{const photo=el.firstElementChild.getBoundingClientRect();return {gap:getComputedStyle(el).gap,overflow:el.scrollWidth>el.clientWidth,photoWidth:photo.width,photoHeight:photo.height};});
   check(summary.gap==='16px'&&!summary.overflow&&summary.photoWidth===(width<=400?120:139)&&summary.photoHeight===194,`Result ${width}px gap/photo/overflow`);
   await shot(`result-${width}`);
  }
  await page.locator('.profile-field button').first().click();check(await page.locator('dialog[open]').count()===1,'Result editor opens');await page.keyboard.press('Escape');
  // Home and Magazine list contain zero save controls, keeping linked imagery.
  for(const width of [430,390,360]){
   await page.setViewportSize({width,height:874});
   await go('/home');await page.locator('.home-discover img').first().waitFor();
   check(await page.locator('main button[aria-pressed],main .proto-save,main .save-heart-icon').count()===0,`Home ${width}px zero save buttons`);
   check(await page.locator('.home-discover .proto-card img').count()>0,`Home ${width}px Discover images preserved`);
   check(await page.locator('.home-discover a[href="/styles/airy"]').count()===1,'Discover detail link preserved');
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Home ${width}px no overflow`);
   await page.locator('.home-magazine').scrollIntoViewIfNeeded();await page.locator('.home-magazine').screenshot({path:path.join(output,`carousel-${width}.png`)});
   await go('/magazine');
   check(await page.locator('main button[aria-pressed],main .proto-save,main .save-heart-icon').count()===0,`Magazine ${width}px zero save buttons`);
   check(await page.locator('main a[href^="/articles/"]').count()===4,'Magazine four existing detail links');
   check(await page.locator('main img:not(.hairus-header-back img)').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0)),'Magazine all real assets loaded');
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Magazine ${width}px no overflow`);
   await shot(`magazine-${width}`);
  }
  // Existing generic and editorial storage remain separate; all hearts share the UX.
  await page.setViewportSize({width:430,height:874});
  const targets=[['/styles/airy','.airy-header .proto-save'],['/designers/yoona','.hairus-page-header .proto-save'],['/designers/sohee','.hairus-page-header .proto-save'],['/salons/arvo','.hairus-page-header .proto-save'],['/articles/issue','.hc-header .proto-save'],['/articles/story','main button[aria-pressed]'],['/in-focus/soft-bob','.hairus-page-header .proto-save']];
  for(const [route,selector] of targets){
   await go(route);const heart=page.locator(selector).first();await heart.waitFor({state:'visible'});await page.waitForFunction(selector=>!document.querySelector(selector).disabled,selector);
   if(await heart.getAttribute('aria-pressed')==='true')await heart.click();
   await heart.click();check(await page.locator('dialog[open]').count()===1,`${route} unsaved opens SAVENOTE`);
   const dialog=page.locator('dialog[open]');
   await dialog.locator('button[aria-pressed]').first().click();await dialog.getByRole('textbox',{name:'나만의 메모'}).fill('검수 메모');
   await dialog.getByRole('button',{name:'적용하기',exact:true}).click();
   check(await heart.getAttribute('aria-pressed')==='true',`${route} apply activates Glass Heart`);
   check(await heart.locator('img.is-saved').count()===1,'Glass Heart asset preserved');
   if(route==='/articles/issue'){
    check(await page.locator('main button:has(>img.save-heart-icon)').count()===1,'Issue article save button is unique');
    const headerBefore=await page.locator('.hc-header').boundingBox();await page.evaluate(()=>scrollTo(0,700));const headerAfter=await page.locator('.hc-header').boundingBox();check(headerBefore.height===64&&headerAfter.y===0,'Issue article header stays sticky at 64px');
    check(await page.locator('.hc-header .proto-save').evaluate(el=>{const h=el.closest('header').getBoundingClientRect(),b=el.getBoundingClientRect();return Math.abs(h.right-24-b.right)<.1;}),'Issue article heart right aligned');await shot('article-issue-saved');
   }
   await heart.click();
   check(await heart.getAttribute('aria-pressed')==='false'&&await page.locator('dialog[open]').count()===0,`${route} saved click instantly unsaves without modal`);
   await heart.click();check(await page.locator('dialog[open]').count()===1,`${route} resave reopens SAVENOTE`);
   check(await page.locator('dialog[open] textarea').inputValue()==='',`${route} previous cancelled note is not reused`);
   await page.locator('dialog[open]').getByRole('button',{name:'적용하기',exact:true}).click();
  }
  // Saved list reflects immediate removal and preserves chip-based editing.
  await go('/saved');const savedHeart=page.locator('main .proto-save').first();await savedHeart.waitFor();
  const beforeCount=await page.locator('main .proto-save').count();await savedHeart.click();
  check(await page.locator('main .proto-save').count()===beforeCount-1&&await page.locator('dialog[open]').count()===0,'SAVED removal updates list immediately');
  await page.getByRole('tab',{name:'매거진',exact:true}).click();const bookmarkCount=await page.locator('main button:has(>img.save-heart-icon)').count();check(bookmarkCount>=3,'Article/IN FOCUS bookmarks appear in SAVED');await page.locator('main button:has(>img.save-heart-icon)').first().click();check(await page.locator('main button:has(>img.save-heart-icon)').count()===bookmarkCount-1,'SAVED editorial removal updates immediately');
  // Legacy OFF preference cannot bypass required SAVENOTE for a new save/resave.
  await go('/styles/airy');let heart=page.locator('.airy-header .proto-save');if(await heart.getAttribute('aria-pressed')==='true')await heart.click();
  await heart.click();const toggle=page.getByRole('switch',{name:'저장할 때 SAVENOTE 자동 열기'});if(await toggle.getAttribute('aria-checked')==='true')await toggle.click();await page.locator('dialog[open]').getByRole('button',{name:'적용하기',exact:true}).click();await heart.click();await heart.click();check(await page.locator('dialog[open]').count()===1,'Resave opens SAVENOTE even with legacy OFF preference');await page.keyboard.press('Escape');
  // Continuously sample actual rendered frames through two full loops.
  await go('/home');await page.locator('.home-magazine').scrollIntoViewIfNeeded();
  const collect=()=>page.evaluate(()=>new Promise(resolve=>{const frames=[];let start=performance.now();function tick(now){const track=document.querySelector('.magazine-track'),r=track.getBoundingClientRect();const cards=[...track.querySelectorAll('.magazine-card')].map(el=>{const b=el.getBoundingClientRect();return {slot:+el.dataset.slot,s:+el.dataset.emphasis,x:b.x-r.x,width:b.width,height:b.height};}).filter(c=>c.x+c.width>0&&c.x<r.width).sort((a,b)=>a.x-b.x);frames.push({time:now,position:+track.dataset.carouselPosition,cards});if(now-start<700)requestAnimationFrame(tick);else resolve(frames);}requestAnimationFrame(tick);}));
  const allFrames=[];
  for(let i=1;i<=9;i++){
   const recording=collect();await page.getByRole('button',{name:'다음 배너'}).click();const frames=await recording;await settle(i);allFrames.push(...frames);
   check(frames.some(f=>f.cards.some(c=>c.s>.05&&c.s<.95)),`Carousel transition ${i} scales during movement`);
   for(const frame of frames)for(let c=1;c<frame.cards.length;c++)check(Math.abs(frame.cards[c].x-frame.cards[c-1].x-frame.cards[c-1].width-8)<.15,`Carousel frame gap remains 8px`);
   if(i===4||i===8)await page.locator('.home-magazine').screenshot({path:path.join(output,`carousel-loop-${i}.png`)});
  }
  fs.writeFileSync(path.join(output,'carousel-frames.json'),JSON.stringify(allFrames));
  await page.getByRole('button',{name:'이전 배너'}).click();await settle(8);check(true,'Carousel reverse loop works');
  await page.getByRole('button',{name:'다음 배너'}).click({clickCount:3,delay:30});await settle(11);check(true,'Carousel rapid triple next input is queued');
  await page.getByRole('button',{name:'이전 배너'}).click();await page.getByRole('button',{name:'다음 배너'}).click();await settle(11);check(true,'Carousel rapid direction reversal stays consistent');
  const track=await page.locator('.magazine-track').boundingBox();
  await page.mouse.move(track.x+250,track.y+180);await page.mouse.down();await page.mouse.move(track.x+70,track.y+182,{steps:8});await page.mouse.up();await settle(12);
  check(page.url().endsWith('/home'),'Carousel drag prevents accidental link navigation');
  await page.locator('.magazine-card[data-slot="0"]').click({position:{x:100,y:100}});await page.waitForURL('**/articles/care');check(true,'Carousel normal card click opens original detail');
  await go('/home');await page.locator('.home-magazine').scrollIntoViewIfNeeded();
  // Real touch events through Chromium's mobile emulation.
  const touchContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await touchContext.addInitScript(()=>sessionStorage.setItem('hairus.popup.seen','1'));
  const touchPage=await touchContext.newPage();await touchPage.goto(base+'/home');await touchPage.locator('.home-magazine').scrollIntoViewIfNeeded();const tr=await touchPage.locator('.magazine-track').boundingBox();const cdp=await touchContext.newCDPSession(touchPage);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:tr.x+250,y:tr.y+180}]});for(let step=1;step<=8;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:tr.x+250-step*22,y:tr.y+180}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await touchPage.waitForFunction(()=>Math.abs(+document.querySelector('.magazine-track').dataset.carouselPosition-1)<.000001);check(touchPage.url().endsWith('/home'),'Carousel real touch swipe advances without opening link');await touchContext.close();
  await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'이전 배너'}).click();check(+await page.locator('.magazine-track').getAttribute('data-carousel-position')===-1,'Reduced-motion updates without an animated intermediate state');await settle(-1);await page.getByRole('button',{name:'다음 배너'}).click();await settle(0);check(true,'Carousel reduced-motion retains previous/next');
  // Focused input stays reachable when the visible viewport shrinks for a keyboard.
  await page.setViewportSize({width:390,height:844});await go('/welcome');await page.locator('#display-name').focus();await page.setViewportSize({width:390,height:360});await page.locator('#display-name').evaluate(el=>el.scrollIntoView({block:'center'}));
  check(await page.locator('#display-name').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'Welcome input reachable in a 360px-high keyboard-sized viewport');
  // Existing SAVED reason-chip editing retains data, order and reload behavior.
  await page.setViewportSize({width:430,height:874});
  for(const [id,memo] of [['airy','검수 보존 메모1'],['tassel','검수 보존 메모2']]){
   await go('/styles/'+id);const button=page.locator('main button:has(>img.save-heart-icon)').first();await button.waitFor();await page.waitForFunction(()=>!document.querySelector('main button:has(>img.save-heart-icon)').disabled);if(await button.getAttribute('aria-pressed')==='true')await button.click();await button.click();await page.locator('dialog[open] textarea').fill(memo);await page.locator('dialog[open]').getByRole('button',{name:'적용하기',exact:true}).click();
  }
  await go('/saved');const order=await page.locator('main a[href^="/styles/"]').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
  await page.getByRole('button',{name:'에어리 레이어드 저장 메모 수정: 검수 보존 메모1',exact:true}).click();check(await page.locator('dialog[open] textarea').inputValue()==='검수 보존 메모1','SAVED reason-chip editing restores the existing memo');await page.locator('dialog[open] textarea').fill('수정한 검수 메모');await page.locator('dialog[open]').getByRole('button',{name:'적용하기',exact:true}).click();
  check(JSON.stringify(order)===JSON.stringify(await page.locator('main a[href^="/styles/"]').evaluateAll(links=>links.map(link=>link.getAttribute('href')))),'Editing SAVENOTE preserves Archive item order');
  await page.reload();await page.getByRole('button',{name:'에어리 레이어드 저장 메모 수정: 수정한 검수 메모',exact:true}).waitFor();check(true,'Edited SAVENOTE persists through reload');
  check(errors.length===0,'No browser runtime errors');
  fs.writeFileSync(path.join(output,'FINAL_QA.json'),JSON.stringify({passed:checks.length,checks,metrics,errors},null,2));
  console.log(`PASS: ${checks.length} browser assertions; ${metrics.length} responsive CTA samples; no runtime errors.`);
 }catch(error){await page.screenshot({path:path.join(output,'qa-failure.png'),fullPage:true});fs.writeFileSync(path.join(output,'FINAL_QA_FAILURE.json'),JSON.stringify({checks,metrics,errors,error:String(error)},null,2));throw error;}
 finally{await browser.close();}
})();
