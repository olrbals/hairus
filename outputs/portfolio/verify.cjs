const {chromium}=require('playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://localhost:3100';const checks=[],errors=[],metrics={};
const ok=(value,label)=>{assert.ok(value,label);checks.push(label)};
const near=(a,b,label,tolerance=.1)=>ok(Math.abs(a-b)<tolerance,`${label}: ${a} ≈ ${b}`);
const selectors=['920:4823','920:4840','920:4853'];
const track=(p,i)=>p.locator(`[data-figma-node="${selectors[i]}"]`);
const pos=async(t)=>Number(await t.getAttribute('data-carousel-position'));
const settle=async(t,n)=>{await t.page().waitForFunction(({node,n})=>Math.abs(Number(document.querySelector(`[data-figma-node="${node}"]`).dataset.carouselPosition)-n)<.000001,{node:await t.getAttribute('data-figma-node'),n},{timeout:20000});};
const geometry=async t=>t.evaluate(el=>{const r=el.getBoundingClientRect();return [...el.querySelectorAll('figure')].map(c=>{const b=c.getBoundingClientRect(),cap=c.querySelector('figcaption').getBoundingClientRect();return{slot:+c.dataset.slot,x:b.x-r.x,y:b.y-r.y,w:b.width,h:b.height,grow:+c.dataset.emphasis,captionLeft:cap.x-b.x,captionBottom:b.bottom-cap.bottom,image:c.querySelector('img').complete&&c.querySelector('img').naturalWidth>0}}).filter(c=>c.x+c.w>0&&c.x<r.width).sort((a,b)=>a.x-b.x);});
async function ready(p,path){const r=await p.goto(base+path);ok(r.status()===200,path+' HTTP 200');await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>[...document.querySelectorAll('img[loading="eager"]')].every(i=>i.complete&&i.naturalWidth>0));}
async function touch(cdp,x,y,dx,dy){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/8,y:y+dy*i/8}]});await new Promise(r=>setTimeout(r,15));}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const context=await browser.newContext({viewport:{width:430,height:900}});const p=await context.newPage();p.on('pageerror',e=>errors.push(String(e)));
  for(const id of ['yoona','sohee'])for(const width of [430,390,360]){
   await p.setViewportSize({width,height:900});await ready(p,`/designers/${id}/portfolio`);
   await p.addStyleTag({content:'nextjs-portal{display:none!important}'});
   const m=await p.locator('main').evaluate(el=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,header:el.querySelector('header').getBoundingClientRect().height,sections:[...el.querySelectorAll('section')].map(s=>({y:s.offsetTop,height:s.getBoundingClientRect().height,title:getComputedStyle(s.querySelector('h2')).fontSize,font:getComputedStyle(s.querySelector('h2')).fontFamily,tracking:getComputedStyle(s.querySelector('h2')).letterSpacing})),name:el.querySelector('h1').textContent}));
   metrics[id+'-'+width]=m;ok(m.scrollWidth<=width,id+width+' no horizontal overflow');near(m.header,64,'header');ok(m.name.includes(id==='yoona'?'윤아':'소희'),'designer name');
   if(width===430)assert.deepEqual(m.sections.map(s=>s.y),[64,681,1317]);
   for(let i=0;i<3;i++){
    const cards=await geometry(track(p,i)),scale=(width-48)/382;
    near(cards[0].x,0,'active x');near(cards[0].w,335*scale,'active width');near(cards[0].h,460*scale,'active height');near(cards[1].w,241*scale,'peek width');near(cards[1].h,330*scale,'peek height');near(cards[1].x-cards[0].w,8,'gap');near(cards[0].captionLeft,24,'caption left');near(cards[0].captionBottom,24,'caption bottom');ok(cards.every(c=>c.image),'visible images loaded');
   }
   await p.screenshot({path:`outputs/portfolio/${id}-${width}.png`,fullPage:true});
   // All four entry points and deterministic direct-entry back link.
   await p.locator('header a').click();await p.waitForURL(`**/designers/${id}`);ok(true,id+' direct-entry back');
   const baseline=JSON.parse(fs.readFileSync('outputs/portfolio/baseline.json'));
   if(width===430){const current=await p.locator('#works').evaluate(el=>({height:el.getBoundingClientRect().height,images:[...el.querySelectorAll('img')].map(i=>{const r=i.getBoundingClientRect();const s=getComputedStyle(i);return{src:i.getAttribute('src'),x:r.x,y:r.y-el.getBoundingClientRect().y,w:r.width,h:r.height,crop:s.objectPosition,fit:s.objectFit}})}));assert.deepEqual(current.images,baseline[id].images);near(current.height,baseline[id].height,'selected works height');ok(true,id+' SELECTED WORKS exact geometry/crop preserved');}
   if(width===430)for(let n=0;n<4;n++){const links=p.locator('#works a');await links.nth(n).click();await p.waitForURL(`**/designers/${id}/portfolio`);ok(await p.locator('main').getAttribute('data-designer-id')===id,id+' selected link '+n);await p.locator('header a').click();await p.waitForURL(`**/designers/${id}`);}
  }
  await p.setViewportSize({width:430,height:900});await ready(p,'/designers/yoona/portfolio');
  for(let i=0;i<3;i++){
   const t=track(p,i),count=[6,4,7][i];await t.focus();await p.keyboard.press('ArrowLeft');await settle(t,-1);near((await geometry(t))[0].w,335,'reverse loop size');
   await p.keyboard.press('ArrowRight');await settle(t,0);
   await t.evaluate(el=>{window.portfolioSamples=[];window.portfolioSampling=true;const sample=()=>{if(!window.portfolioSampling)return;const r=el.getBoundingClientRect();const cards=[...el.querySelectorAll('figure')].map(c=>{const b=c.getBoundingClientRect();return{x:b.x-r.x,w:b.width,h:b.height,slot:c.dataset.slot,loaded:c.querySelector('img').complete}}).filter(c=>c.x+c.w>0&&c.x<r.width).sort((a,b)=>a.x-b.x);window.portfolioSamples.push({position:+el.dataset.carouselPosition,cards});requestAnimationFrame(sample)};requestAnimationFrame(sample)});
   for(let k=0;k<count;k++)await p.keyboard.press('ArrowRight');await settle(t,count);
   const samples=await p.evaluate(()=>{window.portfolioSampling=false;return window.portfolioSamples});ok(samples.some(s=>s.position%1>.15&&s.position%1<.85),'continuous scale samples '+i);
   for(const s of samples)for(let j=1;j<s.cards.length;j++){assert.ok(Math.abs(s.cards[j].x-s.cards[j-1].x-s.cards[j-1].w-8)<.1);assert.ok(s.cards[j].loaded)}
   metrics['animation-'+i]={samples:samples.length,minGap:Math.min(...samples.flatMap(s=>s.cards.slice(1).map((c,j)=>c.x-s.cards[j].x-s.cards[j].w))),maxGap:Math.max(...samples.flatMap(s=>s.cards.slice(1).map((c,j)=>c.x-s.cards[j].x-s.cards[j].w)))};
   ok(true,'forward full loop, stable gap, no blank images '+i);
   for(const other of [0,1,2].filter(n=>n>i))near(await pos(track(p,other)),0,'independent state');
  }
  // Idle mouse drag previews at fractional size, short/cancelled drags snap back.
  await ready(p,'/designers/yoona/portfolio');const t=track(p,0);let box=await t.boundingBox();await p.mouse.move(300,box.y+200);await p.mouse.down();await p.mouse.move(180,box.y+200,{steps:8});const middle=await geometry(t);ok(middle[0].w<335&&middle[0].w>241,'mouse drag preview scales');await p.mouse.up();await settle(t,1);await p.mouse.move(150,box.y+200);await p.mouse.down();await p.mouse.move(300,box.y+200,{steps:8});await p.mouse.up();await settle(t,0);ok(true,'mouse drag both directions');
  await t.focus();for(const key of ['ArrowRight','ArrowRight','ArrowRight','ArrowLeft','ArrowLeft','ArrowRight'])await p.keyboard.press(key);await settle(t,2);ok(true,'rapid mixed input serialized');
  await p.emulateMedia({reducedMotion:'reduce'});await p.keyboard.press('ArrowRight');await settle(t,3);ok(true,'reduced motion');await p.emulateMedia({reducedMotion:'no-preference'});
  // Real touch input through Chrome's touch dispatcher, including native vertical scroll.
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(String(e)));const cdp=await mobile.newCDPSession(mp);
  for(const width of [430,390,360]){await mp.setViewportSize({width,height:844});await ready(mp,'/designers/sohee/portfolio');await touch(cdp,width-90,330,-160,0);await settle(track(mp,0),1);await touch(cdp,100,330,160,0);await settle(track(mp,0),0);await touch(cdp,200,500,2,-220);await mp.waitForTimeout(300);ok(await mp.evaluate(()=>scrollY)>100,width+' native vertical scroll allowed');near(await pos(track(mp,0)),0,'vertical gesture does not navigate');ok(true,width+' real touch forward/reverse');}
  // Scope regression: both profiles, review routes, save state, menu and unchanged HOME carousel.
  for(const id of ['yoona','sohee','jisu']){await ready(p,'/designers/'+id);ok(await p.locator('h1').count()===1,id+' profile rendered');await p.getByRole('button',{name:'다음 비교 보기'}).click();ok((await p.locator('#match figure img').first().getAttribute('src')).includes('f66bd'),id+' WHY WE MATCH');if(id!=='jisu'){const save=p.locator('.proto-save');await save.click();await p.getByRole('button',{name:'적용하기',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.proto-save').getAttribute('aria-pressed')==='true');ok(await save.getAttribute('aria-pressed')==='true',id+' save');await save.click();ok(await save.getAttribute('aria-pressed')==='false',id+' unsave');}await p.locator('#reviews a').click();await p.waitForURL(`**/designers/${id}/reviews`);ok(await p.locator('.review').count()===3,id+' unchanged Reviews');}
  await ready(p,'/home');if(await p.getByRole('dialog',{name:'HAIRUS 소식 팝업'}).isVisible())await p.getByRole('button',{name:'닫기',exact:true}).click();await p.locator('.magazine-track').scrollIntoViewIfNeeded();await p.getByRole('button',{name:'다음 배너'}).click();await p.waitForFunction(()=>+document.querySelector('.magazine-track').dataset.carouselPosition===1);const homeCards=await p.locator('.magazine-track').evaluate(el=>[...el.querySelectorAll('a')].filter(a=>+a.dataset.emphasis===1).map(a=>a.getBoundingClientRect().width));near(homeCards[0],335,'HOME active preserved');for(let k=0;k<3;k++)await p.getByRole('button',{name:'다음 배너'}).click();await p.waitForFunction(()=>+document.querySelector('.magazine-track').dataset.carouselPosition===4);ok(true,'HOME full loop');
  for(const path of ['/saved','/reservation/yoona/note','/explore','/reservation/yoona/service']){const response=await p.goto(base+path);ok(response.status()===200,path+' smoke');}
  ok(errors.length===0,'no browser runtime errors');
 }catch(e){fs.writeFileSync('outputs/portfolio/failure.txt',String(e.stack));throw e;}finally{fs.writeFileSync('outputs/portfolio/qa.json',JSON.stringify({base,checks,metrics,errors},null,2));await browser.close();}
 console.log(JSON.stringify({checks:checks.length,errors},null,2));
})();
