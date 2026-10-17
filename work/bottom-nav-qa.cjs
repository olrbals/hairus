/* Run against a completed production build. No app/test-only motion hooks. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require(process.env.HAIRUS_PLAYWRIGHT_MODULE||'/Users/qm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.HAIRUS_QA_URL||'http://127.0.0.1:3025';
const out=process.env.HAIRUS_QA_OUTPUT||'/private/tmp/hairus-nav-qa';
fs.mkdirSync(out,{recursive:true});
let checks=0;const errors=[],results=[];
const check=(condition,label)=>{assert.ok(condition,label);checks++;};
const near=(a,b,label)=>check(Math.abs(a-b)<.05,`${label}: ${a} / ${b}`);
const nav='.bottom-nav--liquid';
async function ready(p,path){await p.addInitScript(()=>sessionStorage.setItem('hairus.popup.seen','1'));await p.goto(base+path);await p.locator(nav+':not([hidden])').waitFor();await p.evaluate(()=>document.fonts.ready);}
async function settled(p,href){await p.waitForURL(base+href);await p.waitForFunction(expected=>{const n=document.querySelector('.bottom-nav--liquid'),d=n?.querySelector('.liquid-indicator')?.dataset;return d?.phase==='rest'&&Number(d.target)===['/home','/explore','/saved','/my'].indexOf(expected)&&n.querySelector('[aria-current=page]')?.getAttribute('href')===expected;},href);const data=await p.locator(nav).evaluate(n=>({active:n.querySelector('[aria-current="page"]')?.getAttribute('href'),target:n.querySelector('.liquid-indicator').dataset.target,count:document.querySelectorAll('.bottom-nav:not([hidden])').length}));check(data.active===href&&data.count===1,'route and sole navigation agree');check(Number(data.target)===['/home','/explore','/saved','/my'].indexOf(href),'indicator and route agree');}
(async()=>{
 const b=await chromium.launch({channel:'chrome',headless:true});
 const baseline=fs.existsSync(out+'/baseline.json')?JSON.parse(fs.readFileSync(out+'/baseline.json')):[];
 for(const width of [430,390,360]){
  const context=await b.newContext({viewport:{width,height:874},isMobile:true,hasTouch:true,deviceScaleFactor:2});const p=await context.newPage();p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!m.location().url.endsWith('/favicon.ico'))errors.push(m.text()+' '+m.location().url);});
  await ready(p,'/home');
  const initial=await p.locator(nav).evaluate(n=>({rect:n.getBoundingClientRect().toJSON(),labels:[...n.querySelectorAll('a span')].map(x=>x.textContent),style:Object.fromEntries(['background','backdropFilter','border','boxShadow','borderRadius','bottom','padding'].map(k=>[k,getComputedStyle(n)[k]])),indicator:Object.fromEntries(['background','border','boxShadow','borderRadius'].map(k=>[k,getComputedStyle(n.querySelector('.liquid-indicator__rest'))[k]])),tabs:[...n.querySelectorAll('a')].map(a=>a.getBoundingClientRect().toJSON())}));
  assert.deepEqual(initial.labels,['홈','탐색','저장','마이']);checks++;
  near(initial.rect.width,width-32,'approved width');near(initial.rect.height,64,'approved height');near(874-initial.rect.bottom,14,'approved bottom');
  const old=baseline.find(x=>x.width===width);if(old){assert.deepEqual(initial.style,old.style);checks++;assert.deepEqual(initial.indicator,Object.fromEntries(Object.keys(initial.indicator).map(k=>[k,old.tabs[0].indicator[k]])));checks++;initial.tabs.forEach((t,i)=>{near(t.x,old.tabs[i].rect.x,'tab x');near(t.width,old.tabs[i].rect.width,'tab width');});}
  await p.locator(nav).screenshot({path:`${out}/after-${width}.png`});
  await p.evaluate(()=>window.navigationBefore=document.querySelector('.bottom-nav--liquid'));
  for(const href of ['/explore','/saved','/my','/home','/my','/explore']){await p.locator(`${nav} a[href="${href}"]`).tap();await settled(p,href);check(await p.evaluate(()=>window.navigationBefore===document.querySelector('.bottom-nav--liquid')),'persistent DOM during routing');}
  // Click again while the spring is in flight, including reversal and same-tab reselection.
  for(const href of ['/my','/home','/saved','/my','/my','/explore','/home']){await p.locator(`${nav} a[href="${href}"]`).dispatchEvent('click',{button:0});await p.waitForTimeout(35);}
  await settled(p,'/home');
  await p.locator(`${nav} a[href="/home"]`).tap();await settled(p,'/home');
  await p.goBack();await settled(p,'/explore');await p.goForward();await settled(p,'/home');
  // Native link keyboard operation remains intact.
  await p.locator(`${nav} a[href="/saved"]`).focus();await p.keyboard.press('Enter');await settled(p,'/saved');
  for(const height of [640,932]){await p.setViewportSize({width,height});const r=await p.locator(nav).boundingBox();near(height-r.y-r.height,14,'responsive bottom');near(r.height,64,'responsive height');check(r.x>=0&&r.x+r.width<=width,'no clipping');}
  await p.setViewportSize({width,height:874});
  // Emulate a nonzero safe-area value at the browser's environment-variable boundary.
  const cdp=await context.newCDPSession(p);
  await cdp.send('Emulation.setSafeAreaInsetsOverride',{insets:{bottom:34}});
  const safe=await p.locator(nav).boundingBox();near(874-safe.y-safe.height,48,'34px safe area');
  await cdp.send('Emulation.setSafeAreaInsetsOverride',{insets:{bottom:0}});
  await p.emulateMedia({reducedMotion:'reduce'});await p.locator(`${nav} a[href="/my"]`).tap();await settled(p,'/my');
  check(await p.locator('.liquid-indicator__surface').evaluate(e=>getComputedStyle(e).opacity==='0'),'reduced motion skips SVG');
  await p.emulateMedia({reducedMotion:'no-preference'});
  // Pages keep their existing visibility policy, including nested detail navigation.
  for(const path of ['/salons/arvo','/salons/arvo/designers','/login','/magazine']){await p.goto(base+path);check(await p.locator('.bottom-nav:visible').count()===0,`no added nav on ${path}`);await p.emulateMedia({reducedMotion:'reduce'});await p.emulateMedia({reducedMotion:'no-preference'});}
  await ready(p,'/styles/airy');check(await p.locator(`${nav} [aria-current="page"]`).getAttribute('href')==='/explore','detail keeps Explore selection');
  results.push({width,initial});await context.close();
 }
 // Deterministic real browser frames: actual Link routing, original DOM, actual SVG filters.
 const p=await b.newPage({viewport:{width:430,height:874},deviceScaleFactor:2});p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!m.location().url.endsWith('/favicon.ico'))errors.push(m.text()+' '+m.location().url);});await ready(p,'/home');
 await p.clock.install({time:new Date('2026-10-17T00:00:00Z')});await p.clock.pauseAt(new Date('2026-10-17T00:00:01Z'));
 const sequences=[['adjacent','/explore'],['reset','/home'],['distant','/my'],['reverse','/home']];const frames=[];
 for(const [name,href] of sequences){await p.locator(`${nav} a[href="${href}"]`).dispatchEvent('click',{button:0});let elapsed=0,phases=[];
  for(const ms of [0,32,64,96,128,160,192,224,256,320,640,800]){await p.clock.runFor(ms-elapsed);elapsed=ms;const state=await p.locator('.liquid-indicator').evaluate(e=>({...e.dataset,path:e.querySelector('path').getAttribute('d')}));phases.push(state.phase);frames.push({name,ms,...state});if(name!=='reset'&&[0,64,96,160,224,256,800].includes(ms))await p.locator(nav).screenshot({path:`${out}/${name}-${ms}.png`});}
  check(phases.includes('connected'),`${name} has actual connected silhouette`);check(phases.includes('separated'),`${name} has a detached droplet`);check(phases.at(-1)==='rest',`${name} restores original surface`);
 }
 check(errors.length===0,`no runtime errors: ${errors.join(';')}`);
 fs.writeFileSync(out+'/NAV_QA.json',JSON.stringify({checks,errors,results,frames},null,2));await b.close();console.log(`PASS ${checks} checks; 3 widths, 3 heights, safe area, touch, keyboard, routing, motion frames.`);
})().catch(e=>{console.error(e);process.exit(1)});
