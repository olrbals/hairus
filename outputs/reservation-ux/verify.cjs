const {chromium}=require(process.env.HAIRUS_PLAYWRIGHT||'C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const base=process.env.HAIRUS_QA_URL||'http://localhost:3016';
const output='outputs/reservation-ux';
const key='hairus.prototype.v1';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const context=await browser.newContext({viewport:{width:430,height:874},isMobile:true,hasTouch:true,timezoneId:'Asia/Seoul'});
 const page=await context.newPage();
 const errors=[],checks=[],fonts=[];
 page.on('pageerror',error=>errors.push(String(error)));
 const check=(ok,label)=>{assert.ok(ok,label);checks.push(label);};
 const state=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 const waitStep=async step=>{await page.waitForURL(new RegExp(`/reservation/[^/]+/${step}(?:\\?|$)`));await page.locator('ol[aria-label]').waitFor();};
 const shot=async name=>{
   await page.evaluate(()=>document.fonts.ready);
   // Linearize the fixed footer only in the full-page overview image.
   // Layout/overlap assertions and viewport captures use its actual fixed position.
   await page.screenshot({path:`${output}/after-${name}.png`,fullPage:true,animations:'disabled',style:'main{position:relative!important} main>footer{position:absolute!important;bottom:0!important} nextjs-portal{display:none}'});
 };
 const visual=async label=>{
   check(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),`${label}: no horizontal overflow`);
   const korean=await page.locator('main *').evaluateAll(nodes=>nodes.filter(n=>n.childNodes.length&&[...n.childNodes].some(c=>c.nodeType===3&&/[가-힣]/.test(c.textContent))).map(n=>{const s=getComputedStyle(n);return {text:n.textContent.slice(0,35),family:s.fontFamily,line:parseFloat(s.lineHeight)/parseFloat(s.fontSize),spacing:parseFloat(s.letterSpacing)/parseFloat(s.fontSize)}}));
   const bad=korean.filter(s=>!s.family.includes('Pretendard')||Math.abs(s.line-1.3)>.01||Math.abs(s.spacing+.02)>.002);
   check(!bad.length,`${label}: all Korean text uses Pretendard / 130% / -2% ${JSON.stringify(bad)}`);
   fonts.push({label,koreanElements:korean.length});
   const footer=page.locator('main>footer');
   if(await footer.count()){
     const rect=await footer.getByRole('button').boundingBox();
     check(rect.height>=52&&rect.height<=56&&rect.x===24&&rect.width===382,`${label}: 54px fixed CTA with 24px gutters`);
     await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
     const overlap=await page.evaluate(()=>{const footer=document.querySelector('main>footer');const content=footer.previousElementSibling;return content.lastElementChild.getBoundingClientRect().bottom<=footer.getBoundingClientRect().top;});
     check(overlap,`${label}: final content scrolls above fixed CTA`);
     await page.evaluate(()=>window.scrollTo(0,0));
   }
 };
 await page.goto(`${base}/salons/arvo/designers`);
 const identities=await page.locator('a[href^="/reservation/"]').evaluateAll(nodes=>nodes.map(node=>({name:node.getAttribute('aria-label'),href:node.getAttribute('href')})));
 check(identities.length===6,'All six existing designer booking entries preserved');
 for(const entry of identities){
   await page.goto(`${base}/salons/arvo/designers`);
   const id=entry.href.split('/')[2];
   check(await page.locator(`a[href="/designers/${id}"]`).count()>0,`${id}: profile details link preserved`);
   await page.getByRole('link',{name:entry.name,exact:true}).click();await waitStep('service');
   await page.getByRole('button',{name:/여성 디자인 컷/}).waitFor();
   check((await state()).draft.designerId===id,`${id}: correct designer passed to draft`);
   await page.getByRole('button',{name:/여성 디자인 컷/}).click();await page.getByRole('button',{name:'다음',exact:true}).click();await waitStep('schedule');
   const days=page.getByRole('region',{name:'예약 날짜 선택'});
   await days.getByRole('button',{name:/년.*월.*일/}).first().waitFor();
   const dates=await days.getByRole('button',{name:/년.*월.*일/}).evaluateAll(nodes=>nodes.map(n=>({label:n.getAttribute('aria-label'),disabled:n.disabled})));
   const off={soyul:[2,6],sohee:[1,4],hana:[3,4],gyunghyun:[2,0],yoona:[2,5],jonghun:[1,3]}[id];
   const now=new Date();const today=new Date(now.toLocaleString('en-US',{timeZone:'Asia/Seoul'}));today.setHours(0,0,0,0);
   for(const date of dates){const [y,m,d]=date.label.match(/\d+/g).map(Number);const day=new Date(y,m-1,d);const diff=Math.round((day-today)/86400000);check(date.disabled===(diff<1||diff>14||off.includes(day.getDay())),`${id}: ${date.label} availability`);}
 }
 // Start a fresh reservation without altering the user's browser profile.
 await context.clearCookies();await page.evaluate(()=>localStorage.clear());await page.reload();
 await page.waitForFunction(key=>!!JSON.parse(localStorage.getItem(key))?.draft,key);
 const legacy={id:'existing-reservation',designerId:'yoona',serviceId:'color',date:'2025-01-12',time:'10:00',note:'기존 예약 상담 원문',noteEdited:true,createdAt:'2025-01-01T12:00:00Z',mode:'demo'};
 await page.evaluate(({key,legacy})=>{const current=JSON.parse(localStorage.getItem(key));current.bookings=[legacy];current.preferences={mood:['내추럴'],care:['자연스럽게 말리기'],concerns:['볼륨 부족'],change:['손질 편의성']};current.notifications=true;localStorage.setItem(key,JSON.stringify(current));},{key,legacy});
 await page.reload();
 await page.goto(`${base}/reservation/yoona/service`);await page.getByRole('button',{name:/여성 디자인 컷/}).waitFor();
 check(await page.getByRole('button',{name:'다음',exact:true}).isDisabled(),'Service required before continuing');
 const cards=page.getByRole('group',{name:'시술 선택'}).getByRole('button');
 check(await cards.count()===3,'Original three bookable services retained');
 check(!(await cards.allTextContents()).some(text=>text.includes('얼굴선')),'Service descriptions removed');
 await visual('service');await shot('service');
 await page.getByRole('button',{name:/여성 디자인 컷/}).click();
 check(await page.locator('button[aria-pressed=true]').count()===1,'Single service selected');
 await shot('service-selected');await page.reload();
 check(await page.getByRole('button',{name:/여성 디자인 컷/}).getAttribute('aria-pressed')==='true','Service persists after refresh');
 await page.getByRole('button',{name:'다음',exact:true}).click();await waitStep('schedule');
 check(await page.getByRole('button',{name:'다음',exact:true}).isDisabled(),'Both date and time required');
 const available=page.getByRole('region',{name:'예약 날짜 선택'}).locator('button:not(:disabled)[aria-pressed]');
 await available.first().click();await page.getByRole('button',{name:'11:30',exact:true}).click();
 const initialDate=(await state()).draft.date;
 await visual('schedule');await shot('schedule');
 await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await page.screenshot({path:`${output}/after-time-slots.png`,animations:'disabled'});await page.evaluate(()=>window.scrollTo(0,0));
 await page.getByRole('link',{name:'뒤로 가기',exact:true}).click();await waitStep('service');
 check((await state()).draft.date===initialDate&&(await state()).draft.time==='11:30','Previous step retains schedule');
 await page.getByRole('button',{name:'다음',exact:true}).click();await waitStep('schedule');
 check(await page.getByRole('button',{name:'11:30',exact:true}).getAttribute('aria-pressed')==='true','Returning restores selected time');
 await available.nth(1).click();check((await state()).draft.time==='','Changing date clears only time');
 await page.getByRole('button',{name:'13:00',exact:true}).click();await page.getByRole('button',{name:'다음',exact:true}).click();await waitStep('note');
 await page.getByRole('button',{name:'노트 수정하기'}).waitFor();
 check(await page.locator('textarea').count()===0,'Hair note starts in reading mode');
 check(!(await page.getByRole('region',{name:'상담 노트',exact:true}).textContent()).includes('미입력'),'No repeated empty fields in reading card');
 check(!(await page.locator('main').textContent()).includes('AI API'),'Developer-only notice removed');
 await visual('note');await shot('note');
 const original=(await state()).draft.note;check(original.includes('희망 시술: 여성 디자인 컷'),'Existing rule-based generator retained');
 await page.getByRole('button',{name:'노트 수정하기'}).click();
 const custom='현재 헤어: 어깨 길이\n\n선호하는 분위기: 내추럴\n\n헤어 고민: 볼륨 부족\n\n디자이너에게 전하고 싶은 말: 앞머리는 유지하고 싶어요.\n아침 손질은 5분 이내면 좋겠어요.';
 await page.getByRole('textbox',{name:'상담 노트 수정'}).fill(custom);await visual('note-editor');await shot('note-editor');
 await page.reload();await page.getByRole('button',{name:'노트 수정하기'}).click();
 check(await page.getByRole('textbox',{name:'상담 노트 수정'}).inputValue()===custom,'Edited note persists after reload');
 await page.getByRole('button',{name:'수정 마치기'}).click();
 await page.getByRole('button',{name:'예약 정보 확인하기'}).click();await waitStep('review');await page.getByRole('button',{name:'데모 예약 저장하기'}).waitFor();
 check(await page.locator('details:not([open])').count()===1,'Review note initially collapsed');
 await visual('review');await shot('review');
 await page.getByText('노트 전체 보기',{exact:true}).click();check((await page.locator('details').textContent()).includes('아침 손질은 5분 이내'),'Full note available on demand');
 await page.getByRole('link',{name:'시술 수정',exact:true}).click();await waitStep('service');await page.getByRole('button',{name:/디자인 펌/}).click();await page.getByRole('button',{name:'수정하고 예약 확인'}).click();await waitStep('review');
 check((await state()).draft.serviceId==='perm'&&(await state()).draft.note===custom,'Service edit returns directly to review and retains edited note');
 await page.getByRole('link',{name:'일정 수정',exact:true}).click();await waitStep('schedule');await available.first().click();await page.getByRole('button',{name:'16:00',exact:true}).click();await page.getByRole('button',{name:'수정하고 예약 확인'}).click();await waitStep('review');
 check((await state()).draft.time==='16:00'&&(await state()).draft.note===custom,'Schedule edit returns to review and preserves service/note');
 await page.getByRole('link',{name:'노트 수정',exact:true}).click();await waitStep('note');await page.getByRole('button',{name:'노트 수정하기'}).click();await page.getByRole('textbox',{name:'상담 노트 수정'}).fill(custom+'\n컬은 자연스럽게 부탁드려요.');await page.getByRole('button',{name:'수정하고 예약 확인'}).click();await waitStep('review');
 const finalDraft=(await state()).draft;
 check(finalDraft.serviceId==='perm'&&finalDraft.time==='16:00'&&finalDraft.note.endsWith('컬은 자연스럽게 부탁드려요.'),'Note edit preserves schedule and service');
 const beforeCount=(await state()).bookings.length;
 await page.getByRole('button',{name:'데모 예약 저장하기'}).click();await page.waitForURL(/\/reservations\//);await page.getByRole('heading',{name:'예약이 확정되었어요 !'}).waitFor();
 const saved=(await state()).bookings;
 check(saved.length===beforeCount+1&&saved[0].note===finalDraft.note&&saved[0].mode==='demo','Completed demo stored with exact edited note');
 check(JSON.stringify(saved[1])===JSON.stringify(legacy),'Existing saved reservation preserved byte for byte');
 check((await state()).notifications===true&&(await state()).preferences.concerns[0]==='볼륨 부족','Unrelated preferences and settings remain intact');
 check(await page.locator('details:not([open])').count()===1,'Completion note initially collapsed');
 await visual('complete');await shot('complete');
 await page.reload();await page.getByRole('heading',{name:'예약이 확정되었어요 !'}).waitFor();check((await state()).bookings.length===saved.length,'Reload does not duplicate saved booking');
 await page.getByRole('link',{name:'MY 예약 내역 보기',exact:true}).click();await page.waitForURL('**/my/reservations');await page.getByText('디자인 펌',{exact:true}).waitFor();
 check((await page.getByRole('region',{name:'예약 요약'}).first().textContent()).includes('16:00'),'MY shows the saved service and time');await shot('my-reservations');
 await page.getByRole('link',{name:'상담 노트 및 상세 보기'}).first().click();await page.getByText('노트 전체 보기',{exact:true}).click();check((await page.locator('details').textContent()).includes('컬은 자연스럽게 부탁드려요.'),'MY detail exposes full preserved note');
 // A month boundary is deterministic regardless of when QA is rerun.
 const boundary=await context.newPage();await boundary.clock.install({time:new Date('2026-10-26T03:00:00Z')});await boundary.goto(`${base}/reservation/sohee/service?service=cut`);await boundary.getByRole('button',{name:'다음',exact:true}).click();await boundary.waitForURL(/schedule/);
 await boundary.getByRole('button',{name:'다음 달',exact:true}).click();await boundary.getByRole('heading',{name:'2026년 11월'}).waitFor();
 check(await boundary.getByRole('button',{name:'2026년 11월 1일 (일)'}).isEnabled(),'Cross-month navigation reaches available next-month dates');
 await boundary.getByRole('button',{name:'2026년 11월 1일 (일)'}).click();await boundary.getByRole('button',{name:'10:00',exact:true}).click();await boundary.reload();
 await boundary.getByRole('heading',{name:'2026년 11월'}).waitFor();check(true,'Reload restores the selected calendar month');
 await boundary.screenshot({path:`outputs/reservation-ux/after-calendar-boundary.png`,fullPage:true});await boundary.close();
 // Query entry choices must not overwrite later service selection after a refresh.
 await page.goto(`${base}/reservation/hana/service?service=cut`);await page.getByRole('button',{name:/디자인 펌/}).click();await page.reload();
 await page.getByRole('button',{name:/디자인 펌/}).and(page.locator('[aria-pressed=true]')).waitFor();check(true,'Initial service query is consumed once');
 check(await page.evaluate(async()=>{await document.fonts.ready;return [...document.fonts].some(font=>font.family==='Pretendard'&&font.status==='loaded');}),'Pretendard font face actually loaded');
 const response=await page.request.get(`${base}/fonts/PretendardVariable.woff2`);check(response.ok()&&(await response.body()).length>100000,'Pretendard WOFF2 served successfully');
 for(const width of [375,430]){await page.setViewportSize({width,height:874});for(const step of ['service','schedule','note','review']){await page.goto(`${base}/reservation/hana/${step}`);await page.locator('ol[aria-label]').waitFor();check(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),`No overflow ${width}px ${step}`);}}
 check(!errors.length,'No browser runtime errors');
 fs.writeFileSync(`${output}/qa.json`,JSON.stringify({passed:checks.length,checks,fonts,errors},null,2));console.log(JSON.stringify({passed:checks.length,errors}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
