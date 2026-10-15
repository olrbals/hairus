const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const base='http://localhost:3112',out='outputs/final-integration-1015/',checks=[],errors=[],metrics={};
const check=(ok,label)=>{assert.ok(ok,label);checks.push(label);};
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const context=await browser.newContext({viewport:{width:430,height:874},isMobile:true,hasTouch:true});
 const page=await context.newPage();page.on('pageerror',error=>errors.push(String(error)));
 const goto=async path=>{const r=await page.goto(base+path);check(r.status()===200,path+' HTTP 200');await page.locator('main').waitFor();};
 for(const id of ['sohee','yoona']){
  await goto('/designers/'+id);await page.locator('.proto-save').waitFor({state:'visible'});await page.waitForFunction(()=>!document.querySelector('.proto-save').disabled);
  check(await page.locator('h1').textContent()===(id==='sohee'?'SOHEE':'YOONA'),id+' profile');
  const nav=page.getByRole('navigation',{name:'디자이너 상세 섹션'});
  check(await nav.evaluate(el=>getComputedStyle(el).position)==='sticky',id+' sticky CSS');
  const old=await page.locator('#match figure img').first().getAttribute('src');
  await page.getByRole('button',{name:'다음 비교 보기'}).tap();
  check(await page.locator('#match figure img').first().getAttribute('src')!==old,id+' comparison next changes image');
  await page.getByRole('button',{name:'이전 비교 보기'}).tap();
  check(await page.locator('#match figure img').first().getAttribute('src')===old,id+' comparison previous restores image');
  await page.locator('#match [role=group]').evaluate(el=>{
   el.dispatchEvent(new TouchEvent('touchstart',{touches:[new Touch({identifier:1,target:el,clientX:300,clientY:200})],bubbles:true}));
   el.dispatchEvent(new TouchEvent('touchend',{changedTouches:[new Touch({identifier:1,target:el,clientX:150,clientY:200})],bubbles:true}));
  });
  check(await page.locator('#match figure img').first().getAttribute('src')!==old,id+' swipe handler changes image');
  check(await page.locator('#reviews [role=progressbar]').count()===9,id+' five rating and four highlight bars');
  check(await page.locator('#reviews article').count()===2,id+' original two reviews');
  metrics[id]=await page.locator('#match,#works,#service,#reviews,#salon').evaluateAll(nodes=>nodes.map(el=>{const s=getComputedStyle(el);return {id:el.id,margin:s.marginTop,padding:s.paddingTop,border:s.borderTopWidth};}));
  check(metrics[id].slice(1).every(s=>s.margin==='52px'),id+' section gaps 52px');
  check(metrics[id].every(s=>s.padding===(s.id==='works'?'40px':'24px')),id+' section padding 24px / works 40px');
  check(metrics[id].filter(s=>['reviews','salon'].includes(s.id)).every(s=>s.border==='0px'),id+' section dividers absent');
  const gap=await page.locator('#salon').evaluate(el=>el.nextElementSibling.querySelector('a').getBoundingClientRect().top-(el.lastElementChild.getBoundingClientRect().bottom));
  check(gap===52,id+' salon content to booking 52px');
  for(const section of ['works','reviews','salon']){
   await nav.locator('a[href="#'+section+'"]').tap();
   await page.waitForTimeout(700);
   check(await nav.locator('[aria-current=location]').getAttribute('href')==='#'+section,id+' active section '+section);
   check(Math.abs((await nav.boundingBox()).y)<1,id+' sticky stays at viewport top '+section);
  }
  await page.screenshot({path:out+id+'-salon.png'});
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(500);
  const save=page.locator('header .proto-save');await save.tap();
  const sheet=page.locator('dialog[open]');await sheet.waitFor();
  check(await sheet.getByRole('heading',{name:'SAVENOTE',exact:true}).count()===1,id+' original SAVENOTE opens');
  await sheet.getByRole('button',{name:'취향 잘 맞음',exact:true}).tap();
  await sheet.getByRole('textbox',{name:'나만의 메모'}).fill(id+' integration QA');
  await sheet.getByRole('button',{name:'적용하기'}).tap();
  check(await save.getAttribute('aria-pressed')==='true',id+' save persisted');
  const look=await save.evaluate(el=>{const s=getComputedStyle(el);return {background:s.backgroundColor,shadow:s.boxShadow,blur:s.backdropFilter};});
  check(look.background==='rgba(0, 0, 0, 0)'&&look.shadow==='none'&&look.blur==='none',id+' header saved heart remains plain');
  await page.reload();await page.waitForFunction(()=>document.querySelector('header .proto-save').getAttribute('aria-pressed')==='true');
  check(await save.getAttribute('aria-pressed')==='true',id+' save restored after refresh');
  await save.tap();check(await sheet.getByRole('textbox',{name:'나만의 메모'}).inputValue()===id+' integration QA',id+' SAVENOTE memo restored');
  await sheet.getByRole('button',{name:'저장 해제',exact:true}).tap();
  check(await save.getAttribute('aria-pressed')==='false',id+' unsave');
  await page.getByRole('link',{name:'예약하기',exact:true}).tap();await page.waitForURL('**/reservation/'+id+'/service');
  await page.locator('.service-choice').first().waitFor();
  check((await page.evaluate(()=>JSON.parse(localStorage.getItem('hairus.prototype.v1')).draft)).designerId===id,id+' booking receives correct designer');
  await page.locator('.service-choice').first().tap();await page.getByRole('button',{name:'다음',exact:true}).tap();await page.waitForURL('**/schedule');
  check(await page.getByRole('combobox').count()===1,id+' booking schedule connected');
 }
 await goto('/in-focus/soft-bob');
 const bookmark=()=>page.getByRole('button',{name:/SOFTLY, IN MOTION.*스크랩/});await bookmark().tap();
 check(await bookmark().getAttribute('aria-pressed')==='true','IN FOCUS bookmark selected');
 check(await page.locator('dialog[open]').count()===0,'Bookmark never opens SAVENOTE');
 metrics.focus=[];
 for(const file of ['designer-sohee.png','silhouette-side.png','texture-rear.png','wave-close-up.png']){
  const image=page.locator('img[src$="'+file+'"]');await image.scrollIntoViewIfNeeded();
  await image.evaluate(el=>el.decode());const size=await image.evaluate(el=>({file:el.src,width:el.naturalWidth,height:el.naturalHeight}));metrics.focus.push(size);check(size.width>0&&size.height>0,'High quality image renders '+file);
 }
 await goto('/saved');check(await page.getByRole('tab',{name:'스타일',exact:true}).getAttribute('aria-selected')==='true','Archive defaults to style');
 check(await page.getByRole('tab').count()===4,'Archive four categories preserved');
 await page.getByRole('tab',{name:'매거진',exact:true}).tap();check(await page.getByRole('heading',{name:'SOFTLY, IN MOTION.'}).count()===1,'IN FOCUS bookmark syncs to Archive');
 await page.reload();await page.getByRole('tab',{name:'매거진',exact:true}).tap();check(await page.getByRole('heading',{name:'SOFTLY, IN MOTION.'}).count()===1,'Editorial bookmark persists after reload');
 await page.getByRole('button',{name:/SOFTLY, IN MOTION.*스크랩 해제/}).tap();check(await page.getByText('아직 스크랩한 매거진이 없어요.',{exact:true}).count()===1,'Archive unbookmark and empty state');
 for(const route of ['/home','/explore','/my','/articles/popup','/articles/care','/styles/airy','/recommendation/intro','/recommendation/1']){
  await goto(route);check((await page.locator('main').innerText()).trim().length>0,route+' content renders');
 }
 await page.getByRole('button',{name:'여자',exact:true}).tap();
 check(await page.getByRole('button',{name:'여자',exact:true}).getAttribute('aria-pressed')==='true','Survey selection remains functional');
 check(await page.locator('[class*=portrait]:not([class*=portraitFill])').first().evaluate(el=>el.offsetWidth===173&&el.offsetHeight===173),'Survey 173px circular mask preserved');
 await goto('/designers/sohee');await page.locator('#reviews').scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 check(await page.locator('nav[aria-label="디자이너 상세 섹션"] [aria-current=location]').getAttribute('href')==='#reviews','Manual scroll synchronizes active review tab');
 await page.screenshot({path:out+'sohee-reviews.png'});
 check(errors.length===0,'No browser JavaScript errors');
 }finally{
 fs.writeFileSync(out+'qa.json',JSON.stringify({checks,errors,metrics},null,2));await browser.close();
 }
 console.log(JSON.stringify({passed:checks.length,errors}));
})().catch(e=>{console.error(e);process.exit(1)});
