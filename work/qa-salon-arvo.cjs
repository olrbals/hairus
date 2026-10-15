// Run against a local Next server. Set PLAYWRIGHT_MODULE if Playwright is outside node_modules.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:3015';
const output='outputs/salon-arvo';
const checks=[];const errors=[];const metrics={};
function check(value,label){assert.ok(value,label);checks.push(label);}

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const context=await browser.newContext({viewport:{width:430,height:932},deviceScaleFactor:1});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(String(error)));
  async function visit(route){const response=await page.goto(base+route);check(response.status()===200,route+' HTTP 200');await page.evaluate(()=>document.fonts.ready);await page.addStyleTag({content:'nextjs-portal{display:none!important}'});}
  async function screenshot(name){
    for(const image of await page.locator('main img:visible').all())await image.scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('main img')).filter(image=>image.getBoundingClientRect().width>0).every(image=>image.complete&&image.naturalWidth>0));
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:`${output}/${name}.png`,fullPage:true});
  }
  await visit('/salons/arvo');
  check(await page.locator('h1').textContent()==='아르보 성수','salon identity');
  const nav=page.getByRole('navigation',{name:'매장 상세 섹션'});
  check(await nav.getByRole('link').count()===5,'five section links');
  metrics.hero=await page.locator('main>img').evaluate(element=>({src:element.getAttribute('src'),natural:[element.naturalWidth,element.naturalHeight],rect:element.getBoundingClientRect().toJSON()}));
  check(metrics.hero.rect.width===430&&metrics.hero.rect.height===338,'Figma hero 430 × 338');
  await page.evaluate(()=>scrollTo({top:760,behavior:'instant'}));
  check(Math.abs(await nav.evaluate(element=>element.getBoundingClientRect().top))<1,'salon nav sticky at viewport top');
  for(const [id,label] of [['notice','공지'],['price','가격'],['designers','디자이너'],['reviews','후기'],['information','정보']]){
    await nav.getByRole('link',{name:label,exact:true}).click();
    await page.waitForFunction(id=>Math.abs(document.getElementById(id).getBoundingClientRect().top-64)<2,id);
    check(await nav.locator('[aria-current=location]').textContent()===label,`click ${label} scroll and active underline`);
    const titleTop=await page.locator(`#${id} h2`).first().evaluate(element=>element.getBoundingClientRect().top);
    check(titleTop>=48,`${id} heading is clear of sticky navigation`);
  }
  for(const [id,label] of [['reviews','후기'],['designers','디자이너'],['price','가격'],['notice','공지']]){
    await page.locator('#'+id).evaluate(element=>scrollTo({top:scrollY+element.getBoundingClientRect().top-72,behavior:'instant'}));
    await page.waitForFunction(label=>document.querySelector('nav[aria-label="매장 상세 섹션"] [aria-current]')?.textContent===label,label);
    check(true,`manual scroll spy ${label}`);
  }
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('nav[aria-label="매장 상세 섹션"] [aria-current]')?.textContent==='공지');
  check(await nav.evaluate(element=>element.getBoundingClientRect().top)>500,'nav returns to normal flow at page top');

  const toggle=page.getByRole('button',{name:'디자이너별 휴무일',exact:true});
  await toggle.click();
  check(await toggle.getAttribute('aria-expanded')==='true','NOTICE expands');
  check(JSON.stringify(await page.locator('#designer-days-off dt').allTextContents())===JSON.stringify(['소율 원장','소희 실장','하나 디자이너','경현 디자이너','윤아 디자이너','종훈 디자이너']),'NOTICE six names in specified order');
  check(JSON.stringify(await page.locator('#designer-days-off dd').allTextContents())===JSON.stringify(['화 · 토 OFF','월 · 목 OFF','수 · 목 OFF','화 · 일 OFF','화 · 금 OFF','월 · 수 OFF']),'NOTICE closure labels');
  await page.locator('#notice').screenshot({path:`${output}/notice-expanded.png`});
  await toggle.click();check(await page.locator('#designer-days-off').isHidden(),'NOTICE collapses');
  check(await page.locator('#designers img').count()===3,'two featured portraits and arrow asset');
  check(await page.locator('#reviews [role=progressbar]').count()===9,'salon five rating bars and four highlight bars');
  check(await page.locator('#reviews').innerText().then(text=>text.includes('데모 리뷰')&&text.includes('매장이 청결해요')&&!text.includes('쌤')),'salon reviews and explicit demo disclosure');
  check(await page.locator('#reviews article').count()===2,'two salon visit experience reviews');
  check(await page.locator('#information button:disabled').count()===3&&await page.locator('#information a').count()===0,'three disabled SNS channels with no outbound URL');
  await screenshot('salon');
  metrics.interior=await page.locator('#information img[loading=lazy]').evaluateAll(elements=>elements.map(element=>({src:element.getAttribute('src'),natural:[element.naturalWidth,element.naturalHeight],rect:element.getBoundingClientRect().toJSON(),fit:getComputedStyle(element).objectFit})));
  check(metrics.interior.length===4&&metrics.interior.every(image=>image.natural[0]>=image.rect.width&&image.natural[1]>=image.rect.height),'four original interior photographs have sufficient source resolution');
  await page.locator('#reviews').screenshot({path:`${output}/salon-reviews.png`});
  const reviewStyle=()=>page.locator('#reviews').evaluate(element=>{
    const selectors=['h2','strong','[role=progressbar]','article','article header','article p','a'];
    return selectors.map(selector=>{const child=element.querySelector(selector);const style=getComputedStyle(child);return [selector,...['fontFamily','fontSize','fontWeight','lineHeight','borderTopWidth','paddingTop','marginTop','height'].map(property=>property==='height'&&selector==='article p'?'text-dependent':style[property])];});
  });
  metrics.salonReviewStyles=await reviewStyle();
  await page.getByRole('link',{name:'모든 후기 보기 →'}).click();
  await page.waitForURL('**/salons/arvo/reviews');
  check(await page.locator('#reviews article').count()===2,'salon all reviews destination uses salon data');
  await page.goBack();await page.waitForURL(/\/salons\/arvo(?:#.*)?$/);
  await page.getByRole('link',{name:/전체 디자이너 6명/}).click();
  await page.waitForURL('**/salons/arvo/designers');
  await page.evaluate(()=>Promise.all([document.fonts.load('500 13px "Arvo Noto Sans KR"'),document.fonts.load('700 17px "Arvo Noto Sans KR"')]));
  const names=['윤아 디자이너','소희 실장','하나 디자이너','소율 원장','경현 디자이너','종훈 디자이너'];
  check(JSON.stringify(await page.locator('article strong').allTextContents())===JSON.stringify(names),'six designers in Figma groups and order');
  check(await page.evaluate(()=>document.fonts.check('500 13px "Arvo Noto Sans KR"')&&document.fonts.check('700 17px "Arvo Noto Sans KR"')),'Figma Noto Sans KR name and group fonts loaded locally');
  check(await page.locator('main').innerText().then(text=>text.includes('6명의 디자이너')&&text.includes('화 · 금 OFF')),'corrected team count and Yoona closure');
  await screenshot('team');
  await page.getByRole('button',{name:'예약하기',exact:true}).click();
  check(await page.evaluate(()=>document.activeElement?.getAttribute('href'))==='/reservation/yoona/service','team CTA focuses designer selection');
  for(const width of [320,375,430]){
    await page.setViewportSize({width,height:932});
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`team ${width}px no horizontal overflow`);
  }
  await page.setViewportSize({width:430,height:932});

  // All six routes use the existing four-step booking flow.
  const closures={yoona:[2,5],sohee:[1,4],hana:[3,4],soyul:[2,6],gyunghyun:[2,0],jonghun:[1,3]};
  for(const [id,offDays] of Object.entries(closures)){
    await visit('/salons/arvo/designers');
    await page.locator(`a[href="/reservation/${id}/service"]`).click();
    await page.waitForURL(`**/reservation/${id}/service`);
    await page.getByRole('button',{name:/여성 디자인 컷/}).click();
    await page.getByRole('button',{name:'다음',exact:true}).click();
    await page.waitForURL(`**/reservation/${id}/schedule`);
    const dates=await page.locator('select option').evaluateAll(options=>options.map(option=>option.value).filter(Boolean));
    check(dates.length===10&&dates.every(date=>!offDays.includes(new Date(date+'T12:00:00Z').getUTCDay())),`${id} booking excludes both closed weekdays`);
    check(await page.locator('.proto-content').innerText().then(text=>text.includes('아르보 성수')),`${id} booking belongs to Arvo`);
  }

  // Persisted conflicting schedule is cleared, preserving note, service and stored bookings.
  const savedState=await page.evaluate(()=>JSON.parse(localStorage.getItem('hairus.prototype.v1')));
  const now=new Date();const future=[];for(let i=1;i<=14;i++){const day=new Date(now);day.setDate(day.getDate()+i);future.push(`${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`);}
  const closed=future.find(date=>[2,5].includes(new Date(date+'T12:00:00Z').getUTCDay()));
  const priorBooking={id:'existing-demo',designerId:'yoona',serviceId:'cut',date:'2026-01-01',time:'10:00',note:'기존 예약 보존',noteEdited:true,mode:'demo',createdAt:'2026-01-01T00:00:00Z'};
  const priorSave={id:'arvo',kind:'salon',reasons:['매장 분위기 좋음'],note:'기존 저장 메모',savedAt:'2026-01-01T00:00:00Z'};
  await page.evaluate(({state,closed,priorBooking,priorSave})=>localStorage.setItem('hairus.prototype.v1',JSON.stringify({...state,bookings:[priorBooking],saved:[priorSave],draft:{id:'closed-test',designerId:'yoona',serviceId:'cut',date:closed,time:'10:00',note:'수정된 상담 노트',noteEdited:true}})),{state:savedState,closed,priorBooking,priorSave});
  await visit('/reservation/yoona/review');
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('hairus.prototype.v1')).draft.date==='');
  check(await page.getByRole('button',{name:'데모 예약 완료하기'}).isDisabled(),'restored closed-day review cannot submit');
  const restored=await page.evaluate(()=>JSON.parse(localStorage.getItem('hairus.prototype.v1')));
  check(restored.draft.time===''&&restored.draft.serviceId==='cut'&&restored.draft.note==='수정된 상담 노트'&&restored.draft.noteEdited,'collision only clears date and time');
  check(JSON.stringify(restored.bookings)===JSON.stringify([priorBooking])&&JSON.stringify(restored.saved)===JSON.stringify([priorSave]),'existing booking and SAVENOTE remain unchanged');
  await page.getByRole('link',{name:'일정 수정',exact:true}).click();
  await page.locator('select').selectOption({index:1});
  await page.getByRole('button',{name:'10:00',exact:true}).click();
  await page.getByRole('button',{name:'다음',exact:true}).click();
  await page.waitForURL('**/reservation/yoona/note');
  check(await page.getByRole('textbox',{name:'상담 노트'}).inputValue()==='수정된 상담 노트','Golden Path keeps edited note');
  await page.getByRole('button',{name:'노트 저장하고 확인하기'}).click();
  await page.getByRole('button',{name:'데모 예약 완료하기'}).click();
  await page.waitForURL('**/reservations/closed-test');
  check(await page.getByRole('heading',{name:'데모 예약을 저장했어요.'}).isVisible(),'Yoona Golden Path completes with an available date');

  for(const id of ['yoona','sohee']){
    await visit('/designers/'+id);
    check(await page.locator('#reviews [role=progressbar]').count()===9,`${id} existing review bars retained`);
    check(await page.locator('#reviews').innerText().then(text=>text.includes(id==='yoona'?'윤아쌤':'소희쌤')&&!text.includes('매장이 청결해요')),`${id} original personal review content retained`);
    metrics[id+'ReviewStyles']=await reviewStyle();
    // Content length differs, so article heights are intentionally text-dependent.
    for(let index=0;index<metrics.salonReviewStyles.length;index++){
      const a=[...metrics.salonReviewStyles[index]],b=[...metrics[id+'ReviewStyles'][index]];
      if(a[0]==='article')a[a.length-1]=b[b.length-1]='text-dependent';
      assert.deepEqual(a,b,`${id} shared review style ${a[0]}`);
    }
    check(true,`${id} salon and designer REVIEWS styles identical`);
    await page.locator('#reviews').screenshot({path:`${output}/after-${id}-reviews.png`});
    const designerNav=page.getByRole('navigation',{name:'디자이너 상세 섹션'});
    for(const [section,label] of [['works','스타일'],['reviews','후기'],['salon','살롱']]){
      await designerNav.getByRole('link',{name:label,exact:true}).click();
      await page.waitForFunction(label=>document.querySelector('nav[aria-label="디자이너 상세 섹션"] [aria-current]')?.textContent===label,label);
      check(Math.abs(await designerNav.evaluate(element=>element.getBoundingClientRect().top))<1,`${id} designer ${section} sticky and scroll spy preserved`);
      check(await page.locator(`#${section}>h2, #${section}>div h2`).first().evaluate(element=>element.getBoundingClientRect().top)>=48,`${id} ${section} heading not hidden by nav`);
    }
    await page.getByRole('link',{name:'모든 후기 보기 →'}).click();await page.waitForURL(`**/designers/${id}/reviews`);
    check(true,`${id} existing all-reviews navigation`);
  }
  await visit('/salons/arvo');
  for(const width of [320,375,430]){
    await page.setViewportSize({width,height:932});
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`salon ${width}px no horizontal overflow`);
  }
  await page.setViewportSize({width:430,height:932});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('navigation',{name:'매장 상세 섹션'}).getByRole('link',{name:'후기',exact:true}).click();
  check(await page.locator('#reviews h2').evaluate(element=>element.getBoundingClientRect().top)>=48,'reduced motion anchor clears nav');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.locator('main>header .proto-save').click();
  check(await page.getByRole('dialog').isVisible(),'salon header opens existing SAVENOTE');
  await page.getByRole('textbox',{name:'나만의 메모'}).fill('매장 메모 QA');
  await page.getByRole('button',{name:'적용하기',exact:true}).click();
  await page.reload();
  await page.waitForFunction(()=>document.querySelector('main>header .proto-save')?.getAttribute('aria-pressed')==='true');
  check(await page.evaluate(()=>JSON.parse(localStorage.getItem('hairus.prototype.v1')).saved.find(item=>item.id==='arvo'&&item.kind==='salon').note)==='매장 메모 QA','salon SAVENOTE persists after refresh');
  // Smoke-check protected routes; their implementation files are untouched.
  for(const route of ['/home','/explore','/saved','/articles/care','/in-focus/soft-bob','/styles/airy','/recommendation/intro']){
    await visit(route);
    check(await page.locator('main').count()>0,route+' preserved route renders');
  }
  check(errors.length===0,'no browser runtime errors');
  fs.writeFileSync(`${output}/qa.json`,JSON.stringify({base,viewport:{width:430,height:932},checks,metrics,errors},null,2));
  await browser.close();console.log(JSON.stringify({passed:checks.length,errors},null,2));
})().catch(error=>{fs.writeFileSync(`${output}/qa-failure.json`,JSON.stringify({checks,metrics,errors,error:String(error)},null,2));console.error(error);process.exit(1);});
