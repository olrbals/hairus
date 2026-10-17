const {chromium}=require('/Users/qm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://localhost:3018';
const out=__dirname;
const checks=[];
const errors=[];
function check(condition,message){assert.ok(condition,message);checks.push(message);}
async function draft(page){return page.evaluate(()=>JSON.parse(localStorage.getItem('hairus.prototype.v1')).draft);}
async function tab(page,label){await page.getByRole('navigation',{name:'예약 섹션'}).getByRole('link',{name:label,exact:true}).click();await page.waitForTimeout(80);}
async function chooseDate(page,index=0){await page.getByRole('region',{name:'예약 날짜 선택'}).getByRole('button',{pressed:false}).filter({hasNotText:/^$/}).count();const buttons=page.locator('[aria-label="예약 날짜 선택"] button[aria-pressed="false"]:enabled');await buttons.nth(index).click();}
async function capture(page,width,name){await page.screenshot({path:`${out}/${name}-${width}.png`});}
(async()=>{
const browser=await chromium.launch({headless:true,channel:'chrome'});
for(const width of [430,390,360]){
 const context=await browser.newContext({viewport:{width,height:932},deviceScaleFactor:1,hasTouch:true});
 await context.addInitScript(()=>{
  if(sessionStorage.getItem('reservation-qa-seeded'))return;
  sessionStorage.setItem('reservation-qa-seeded','1');
  const now=new Date().toISOString();
  localStorage.setItem('hairus.profile.v2',JSON.stringify({version:2,source:'mock',original:{length:'슈퍼 롱 (허리선)',bangs:'없음',texture:'반곱슬',cut:'레이어드',color:'흑갈색',face:'계란형',neck:'짧은 편',skin:'뉴트럴',layer:'보통',cutHistory:'1개월 이내',permHistory:null,dyeHistory:'3개월 이내',bleachHistory:null},edits:{},analyzedAt:now,updatedAt:now}));
  localStorage.setItem('hairus.prototype.v1',JSON.stringify({version:1,preferences:{mood:['내추럴'],care:['자연 건조']},matching:{},saved:[],bookings:[{id:'legacy-booking',designerId:'yoona',serviceId:'cut',date:'2026-10-10',time:'13:00',note:'예전 상담 노트',noteEdited:true,createdAt:now,mode:'demo'}],draft:null,recent:[],popupDay:'',notifications:false,preferenceComplete:true,saveNoteEnabled:false}));
 });
 const page=await context.newPage();page.on('pageerror',error=>errors.push(`${width}: ${error.message}`));await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(base+'/reservation/yoona/service');await page.getByRole('heading',{name:'SERVICE',exact:true}).waitFor();await page.evaluate(()=>document.fonts.ready);
 check(await page.locator('#booking-content > section').count()===4,`${width}: four sections on existing route`);
 check(await page.locator('footer button').evaluate(el=>getComputedStyle(el).height)==='61px',`${width}: shared CTA 61px`);
 check(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),`${width}: no overflow`);
 await capture(page,width,'service');
 await page.getByRole('button',{name:'예약하기',exact:true}).click();check(await page.getByRole('status').textContent()==='시술을 선택해 주세요.',`${width}: missing service guide`);
 const before=await page.evaluate(()=>scrollY);await page.getByRole('button',{name:/남성 일반컷/}).click();check(Math.abs(await page.evaluate(()=>scrollY)-before)<2,`${width}: service does not auto advance`);await page.getByRole('button',{name:/여성 앞머리 컷/}).click();
 check((await draft(page)).serviceId==='cut-bangs',`${width}: bangs selected`);check(await page.locator('#booking-review').innerText().then(text=>text.includes('10,000원')),`${width}: bangs summary base price`);
 check(await page.getByRole('checkbox').count()===0,`${width}: no shampoo option`);
 await tab(page,'방문일');
 const sticky=await page.evaluate(()=>{const h=document.querySelector('header').getBoundingClientRect(),n=document.querySelector('nav').getBoundingClientRect(),p=document.querySelector('header+div').getBoundingClientRect(),s=document.querySelector('#booking-schedule').getBoundingClientRect();return {h:h.top,hb:h.bottom,p:p.top,pb:p.bottom,n:n.top,nb:n.bottom,s:s.top};});
 check(sticky.h===0&&sticky.p===64&&sticky.n===150&&sticky.nb===202&&Math.abs(sticky.s-222)<1,`${width}: stacked sticky header and anchor offset`);
 check(await page.getByRole('link',{name:'방문일',exact:true}).getAttribute('aria-current')==='location',`${width}: scroll spy date`);
 const closed=page.locator('[data-full="true"]');check(await closed.count()>0,`${width}: closed dates present`);check(await closed.first().isDisabled(),`${width}: closed date disabled`);check((await closed.first().textContent()).includes('마감'),`${width}: closed label`);
 await chooseDate(page);await page.getByRole('group',{name:'예약 시간 선택'}).getByRole('button',{name:'20:00',exact:true}).click();check((await draft(page)).time==='20:00',`${width}: short service accepts 20:00`);
 await tab(page,'방문일');await capture(page,width,'date');
 await tab(page,'시술');await page.getByRole('button',{name:'열펌',exact:true}).click();const beforeChange=await page.evaluate(()=>scrollY);await page.getByRole('button',{name:/단발펌/}).click();check((await draft(page)).time==='',`${width}: incompatible service clears time`);check(Math.abs(await page.evaluate(()=>scrollY)-beforeChange)<2,`${width}: no service-change auto scroll`);check((await page.getByRole('status').textContent()).includes('시간 선택을 해제'),`${width}: reset notice`);
 await tab(page,'방문일');check(await page.getByRole('group',{name:'예약 시간 선택'}).getByRole('button',{name:'18:30',exact:true}).isDisabled(),`${width}: long-service 18:30 disabled`);await page.getByRole('group',{name:'예약 시간 선택'}).getByRole('button',{name:'18:00',exact:true}).click();
 await chooseDate(page,1);check((await draft(page)).time==='',`${width}: changing date resets time`);await page.getByRole('group',{name:'예약 시간 선택'}).getByRole('button',{name:'18:00',exact:true}).click();
 await tab(page,'헤어노트');await page.getByRole('button',{name:'MY HAIR 수정',exact:true}).click();let sheet=page.getByRole('dialog',{name:'MY HAIR',exact:true});await sheet.waitFor({state:'visible'});await sheet.getByRole('button',{name:'단발',exact:true}).click();
 const chip=await sheet.getByRole('button',{name:'단발',exact:true}).evaluate(el=>({padding:getComputedStyle(el).padding,radius:getComputedStyle(el).borderRadius,font:getComputedStyle(el).fontSize}));check(chip.padding==='12px 16px'&&chip.radius==='20px'&&chip.font==='14px',`${width}: shared SelectionChip`);
 await sheet.getByRole('button',{name:'저장하기',exact:true}).click();check((await draft(page)).note.includes('단발'),`${width}: MY HAIR save`);check(await page.getByRole('button',{name:'MY HAIR 수정'}).evaluate(el=>el===document.activeElement),`${width}: sheet focus restores`);
 await page.getByRole('button',{name:'RECENT SERVICE 수정'}).click();sheet=page.getByRole('dialog',{name:'RECENT SERVICE',exact:true});await sheet.getByRole('textbox',{name:'전달할 내용'}).fill('커트 · 1개월 이내\n염색 · 3개월 이내');await sheet.getByRole('button',{name:'저장하기'}).click();check((await draft(page)).note.includes('RECENT SERVICE: 커트'),`${width}: history save`);
 await page.getByRole('button',{name:'DESIRED STYLE 수정'}).click();sheet=page.getByRole('dialog',{name:'DESIRED STYLE',exact:true});await sheet.getByRole('textbox',{name:'전달할 내용'}).fill('얼굴 주변은 자연스럽게, 손질은 간편하게 해주세요.');await sheet.getByRole('button',{name:'저장하기'}).click();
 await page.getByRole('textbox',{name:'디자이너에게 요청 사항'}).fill('앞머리는 눈썹 아래로 유지해 주세요.');check((await draft(page)).note.includes('앞머리는 눈썹 아래'),`${width}: request immediately saved`);
 const toggle=page.getByRole('switch',{name:'HAIR NOTE 디자이너에게 전달'});check(await toggle.getAttribute('aria-checked')==='true',`${width}: reservation toggle independent of SAVENOTE false`);
 const note=(await draft(page)).note;await toggle.click();check((await draft(page)).note===note,`${width}: OFF retains note`);check(await page.locator('#booking-review').innerText().then(text=>text.includes('전달하지 않음')),`${width}: OFF summary`);await toggle.click();
 await capture(page,width,'hair-note');
 await page.reload();await page.getByRole('heading',{name:'SERVICE',exact:true}).waitFor();check((await draft(page)).note===note,`${width}: note survives reload`);
 await tab(page,'예약 확인');check(Math.abs((await page.locator('#booking-review').boundingBox()).y-222)<1,`${width}: last section aligns below sticky header`);await capture(page,width,'review');check(await page.getByRole('link',{name:'예약 확인',exact:true}).getAttribute('aria-current')==='location',`${width}: scroll spy review at page end`);
 await page.getByRole('button',{name:'예약하기',exact:true}).click();await page.waitForURL('**/reservations/*');await page.getByRole('heading',{name:'예약 정보를 저장했어요.',exact:true}).waitFor();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('hairus.prototype.v1')));check(saved.bookings.length===2,`${width}: legacy booking preserved`);check(saved.bookings[0].estimatedPrice===180000&&saved.bookings[0].shareNote===true&&saved.bookings[0].note===note,`${width}: saved price and note match summary`);check(saved.saveNoteEnabled===false,`${width}: SAVENOTE setting unchanged`);
 await page.getByRole('link',{name:'MY 예약 내역 보기',exact:true}).click();await page.getByRole('heading',{name:'My Appointments',exact:true}).waitFor();check(await page.locator('article').count()===2,`${width}: MY appointments includes old/new bookings`);
 await page.goto(base+'/reservations/legacy-booking');await page.getByRole('heading',{name:'예약 정보를 저장했어요.',exact:true}).waitFor();check(await page.getByText('예전 상담 노트',{exact:true}).count()>0,`${width}: legacy completion renders`);
 for(const step of ['schedule','note','review']){await page.goto(base+`/reservation/yoona/${step}`);await page.getByRole('heading',{name:'SERVICE',exact:true}).waitFor();check(await page.locator('#booking-content > section').count()===4,`${width}: legacy ${step} opens same one-page flow`);}
 await context.close();
}
check(errors.length===0,'no browser runtime errors');fs.writeFileSync(`${out}/qa-results.json`,JSON.stringify({base,checks,errors},null,2));console.log(`PASS ${checks.length} browser checks`);await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
