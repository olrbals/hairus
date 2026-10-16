const {chromium}=require(process.env.HAIRUS_PLAYWRIGHT||'C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.HAIRUS_QA_URL||'http://localhost:3017';
const out='outputs/splash-preferences-ux';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const checks=[],errors=[],geometry=[];
 const check=(value,label)=>{assert.ok(value,label);checks.push(label);};
 try{
 const context=await browser.newContext({viewport:{width:430,height:875},isMobile:true,hasTouch:true});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(base+'/');
 await page.locator('.splash[data-ready=true]').waitFor();
 const splash=await page.evaluate(async()=>{
  const heading=document.querySelector('.splash h1');
  const rect=()=>{const r=heading.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
  const before=rect();const letters=[...document.querySelectorAll('[data-splash-letter]')];
  const animations=letters.map(el=>el.getAnimations()[0]);
  const timing=animations.map(a=>({delay:a.effect.getTiming().delay,duration:a.effect.getTiming().duration}));
  await Promise.all(animations.map(a=>a.finished));
  window.splashFinished=performance.now();
  const css=getComputedStyle(heading);
  return {before,after:rect(),timing,font:css.fontFamily,size:css.fontSize,lineHeight:css.lineHeight,spacing:css.letterSpacing,background:getComputedStyle(document.querySelector('.splash')).backgroundColor};
 });
 check(JSON.stringify(splash.before)===JSON.stringify(splash.after),'Splash wordmark geometry remains fixed');
 check(splash.timing.every((t,i)=>t.delay===i*120&&t.duration===360),'H → S stagger timing');
 check(splash.size==='60px'&&splash.lineHeight==='78px'&&splash.spacing==='-1.2px'&&splash.background==='rgb(0, 0, 0)','Figma splash typography and background');
 check(Math.abs(splash.after.x+splash.after.width/2-215)<1&&Math.abs(splash.after.y+39-437.5)<1,'Figma splash centered at 430 × 875');
 await page.screenshot({path:out+'/splash-430.png'});
 await page.waitForURL('**/onboarding/1');
 const held=await page.evaluate(()=>performance.now()-window.splashFinished);
 check(held>=2400&&held<3300,`Complete wordmark held 2400ms before transition (${Math.round(held)}ms including fade)`);
 for(const width of [430,390,360]){
  await page.setViewportSize({width,height:875});
  for(const step of [1,2,3,4,'complete']){
   await page.goto(base+'/preferences/'+step);
   await page.locator('.preference-actions').waitFor();await page.evaluate(()=>document.fonts.ready);
   const g=await page.evaluate(()=>{
    const root=document.querySelector('main');const group=root.querySelector('.preference-actions');
    const primary=group.firstElementChild,secondary=group.lastElementChild;
    const p=primary.getBoundingClientRect(),s=secondary.getBoundingClientRect(),r=root.getBoundingClientRect();
    const card=root.querySelector('.preference-complete__card');const cardRect=card?.getBoundingClientRect();
    const choices=root.querySelector('.preference-first-step__choices,.preference-survey-step__chips,.preference-survey-step__images,.preference-complete__card');
    const css=getComputedStyle(primary);
    return {mainHeight:r.height,x:p.x,width:p.width,primaryY:p.y,primaryHeight:p.height,secondaryHeight:s.height,gap:s.top-p.bottom,bottom:r.bottom-s.bottom,radius:css.borderRadius,fontSize:css.fontSize,overlap:choices.getBoundingClientRect().bottom>p.top,overflow:document.documentElement.scrollWidth>innerWidth||(cardRect&&(cardRect.left<0||cardRect.right>innerWidth))};
   });geometry.push({viewportWidth:width,step,...g});
   check(g.x===24&&g.width===width-48&&g.primaryHeight===61&&g.secondaryHeight===56&&g.gap===8&&Math.abs(g.bottom-41)<1&&g.radius==='4px'&&g.fontSize==='16px',`${width}px step ${step}: shared action geometry`);
   check(!g.overlap&&!g.overflow,`${width}px step ${step}: no clipping or overlap`);
   check(await page.locator('img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0)),`${width}px step ${step}: existing image assets loaded`);
   await page.screenshot({path:`${out}/preferences-${step}-${width}.png`,fullPage:true});
  }
 }
 await page.setViewportSize({width:430,height:875});
 await page.goto(base+'/preferences/1');
 const first=page.locator('.preference-first-step__choices button');
 await first.nth(0).click();await first.nth(1).click();check(await first.nth(1).getAttribute('aria-pressed')==='true'&&await page.locator('.preference-first-step__choices [aria-pressed=true]').count()===1,'Single choice replaces prior selection');
 await page.getByRole('button',{name:'다음',exact:true}).click();await page.waitForURL('**/preferences/2');
 for(const step of [2,3,4]){
  const buttons=page.locator('[role=group] button');const max=step===3?2:3;
  for(let i=0;i<max;i++)await buttons.nth(i).click();
  const old=await page.locator('[role=group] [aria-pressed=true]').allTextContents();
  const hint=page.locator('.preference-survey-step__question p');const text=await hint.textContent();
  for(let attempt=1;attempt<=2;attempt++){
   await buttons.nth(max).click();
   check(JSON.stringify(await page.locator('[role=group] [aria-pressed=true]').allTextContents())===JSON.stringify(old),`Step ${step} over-limit ${attempt}: selections preserved`);
   check(await hint.textContent()===text&&await hint.evaluate(el=>el.getAnimations().some(a=>a.animationName==='preference-limit-shake')),`Step ${step} over-limit ${attempt}: unchanged hint shakes again`);
   await page.waitForTimeout(300);
  }
  const next=page.locator('.preference-actions button');await next.click();
  if(step<4){await page.waitForURL(`**/preferences/${step+1}`);await page.getByRole('link',{name:'이전 단계',exact:true}).click();await page.waitForURL(`**/preferences/${step}`);check(await page.locator('[role=group] [aria-pressed=true]').count()===max,`Step ${step} previous navigation preserves answers`);await page.locator('.preference-actions button').click();await page.waitForURL(`**/preferences/${step+1}`);}
 }
 await page.waitForURL('**/preferences/loading');await page.waitForURL('**/preferences/complete');
 check(await page.locator('h1').textContent()==='사용자님의 헤어 프로필이완성됐어요 !','Missing nickname uses 사용자');
 const stored=await page.evaluate(()=>localStorage.getItem('hairus.prototype.v1'));
 await page.getByRole('link',{name:'다시 하기',exact:true}).click();await page.waitForURL('**/preferences/1');
 check(await page.evaluate(()=>localStorage.getItem('hairus.prototype.v1'))===stored,'Restart preserves existing survey state');
 await page.goto(base+'/welcome');await page.locator('input').fill(' 규민 ');await page.locator('input').blur();
 await page.goto(base+'/preferences/complete');check((await page.locator('h1').textContent()).startsWith('규민님'),'Saved nickname is trimmed across navigation');
 await page.reload();check((await page.locator('h1').textContent()).startsWith('규민님'),'Nickname persists after reload');
 await page.getByRole('button',{name:'홈으로 가기',exact:true}).click();await page.waitForURL('**/home');
 await page.goto(base+'/my');check(await page.getByRole('heading',{name:'규민',exact:true}).count()===1,'MY uses shared nickname');
 const other=await context.newPage();await other.goto(base+'/welcome');await other.locator('input').fill('서연');await other.locator('input').blur();
 await page.getByRole('heading',{name:'서연',exact:true}).waitFor();check(true,'Nickname changes update an already open page through storage events');await other.close();
 await page.evaluate(()=>{const entry=JSON.parse(localStorage.getItem('hairus.entry.v1'));entry.name='   ';localStorage.setItem('hairus.entry.v1',JSON.stringify(entry));window.dispatchEvent(new Event('hairus:entry-changed'));});
 await page.getByRole('heading',{name:'사용자',exact:true}).waitFor();check(true,'Same-tab nickname notification updates blank fallback immediately');
 await page.goto(base+'/analysis/result');check((await page.locator('h1').textContent()).includes('사용자님'),'Analysis result uses common fallback');
 // Preserve the special exclusive concern option behavior.
 await page.goto(base+'/preferences/2');await page.locator('[aria-pressed=true]').first().click();await page.getByRole('button',{name:'특별한 고민 없음',exact:true}).click();
 check(await page.locator('[role=group] [aria-pressed=true]').count()===1,'Exclusive concern option clears other selections');
 await page.getByRole('button',{name:'볼륨 부족',exact:true}).click();check(await page.getByRole('button',{name:'특별한 고민 없음',exact:true}).getAttribute('aria-pressed')==='false','Normal concern clears exclusive option');
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [390,360]){await page.setViewportSize({width,height:875});await page.goto(base+'/');await page.locator('.splash[data-ready=true]').waitFor();check(await page.locator('[data-splash-letter]').evaluateAll(els=>els.every(el=>getComputedStyle(el).opacity==='1'&&el.getAnimations().length===0)),`${width}px reduced-motion splash fully visible without motion`);await page.screenshot({path:`${out}/splash-${width}.png`});await page.waitForURL('**/onboarding/1');}
 await page.goto(base+'/preferences/3');await page.locator('[aria-pressed=true]').evaluateAll(els=>els.forEach(el=>el.click()));
 const mood=page.locator('[role=group] button');await mood.nth(0).click();await mood.nth(1).click();await mood.nth(2).click();
 check(await page.locator('.preference-survey-step__question p').evaluate(el=>getComputedStyle(el).textDecorationLine.includes('underline')&&el.getAnimations().length===0),'Reduced motion limit feedback is static and accessible');
 await page.screenshot({path:out+'/reduced-motion-limit.png'});
 await page.goto(base+'/login');await page.getByRole('button',{name:'카카오로 계속하기',exact:true}).click();await page.getByRole('button',{name:'데모로 계속하기',exact:true}).click();await page.waitForURL('**/welcome');
 check(await page.evaluate(()=>JSON.parse(localStorage.getItem('hairus.entry.v1')).loginMode==='demo'),'Existing login sheet saves demo mode');
 await page.goto(base+'/');await page.waitForURL('**/welcome');check(true,'Splash preserves demo login routing');
 await page.evaluate(()=>{const e=JSON.parse(localStorage.getItem('hairus.entry.v1'));e.loginMode='guest';e.onboardingDone=true;localStorage.setItem('hairus.entry.v1',JSON.stringify(e));});await page.goto(base+'/');await page.waitForURL('**/login');check(true,'Splash preserves completed-onboarding routing');
 await page.goto(base+'/');await page.locator('.splash').waitFor();await page.goto(base+'/preferences/1');await page.waitForTimeout(3000);check(page.url().endsWith('/preferences/1'),'Leaving splash cancels pending route timer');
 check(errors.length===0,'No browser runtime or hydration errors');
 fs.writeFileSync(out+'/qa.json',JSON.stringify({checks,errors,splash,held,geometry},null,2));
 console.log(JSON.stringify({passed:checks.length,errors,held,geometry},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
