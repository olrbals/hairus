const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const {newProfile}=await import('../../src/lib/analysis/profile.ts');
 const page=await browser.newPage({viewport:{width:430,height:874},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const base='http://127.0.0.1:3077';const key='hairus.prototype.v1';const checks=[];const check=(ok,label)=>{assert.ok(ok,label);checks.push(label);};
 const state=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 await page.goto(base+'/analysis/result');await page.evaluate(profile=>localStorage.setItem('hairus.profile.v2',JSON.stringify(profile)),newProfile());await page.reload();
 for(const [field,option] of [['length','단발'],['color','애쉬'],['texture','직모']]){
  await page.locator(`button[aria-labelledby="label-${field} value-${field}"]`).click();await page.locator('dialog[open]').getByRole('button',{name:new RegExp(option)}).first().click();await page.getByRole('button',{name:'저장하기',exact:true}).click();
 }
 check(await page.evaluate(()=>JSON.parse(localStorage.getItem('hairus.profile.v2')).edits.texture)==='직모','Profile edits saved through real UI');
 await page.goto(base+'/reservation/yoona/service');await page.getByRole('button',{name:/여성 디자인 컷/}).click();await page.getByRole('button',{name:'다음',exact:true}).click();await page.getByRole('region',{name:'예약 날짜 선택'}).locator('button:not(:disabled)[aria-pressed]').first().click();await page.getByRole('button',{name:'11:30',exact:true}).click();await page.getByRole('button',{name:'다음',exact:true}).click();await page.getByText('디자이너에게 전달할 내용 보기',{exact:false}).waitFor();
 await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).draft.note.includes('직모'),key);
 const legacy={...(await state()).draft,id:'legacy-booking',note:'기존 예약 원문',createdAt:'2025-01-01T00:00:00Z',mode:'demo'};await page.evaluate(({key,legacy})=>{const saved=JSON.parse(localStorage.getItem(key));saved.bookings=[legacy];localStorage.setItem(key,JSON.stringify(saved));},{key,legacy});await page.reload();await page.getByText('디자이너에게 전달할 내용 보기',{exact:false}).waitFor();
 let note=(await state()).draft.note;check(note.includes('단발')&&note.includes('애쉬'),'Latest saved profile reflected');check(!note.includes('시술 이력:')&&!/얼굴형:|목 길이:|피부 톤:/.test(note),'No invented history or raw reference features');
 const shot=async name=>{await page.locator('textarea').first().blur();await page.evaluate(()=>window.scrollTo(0,0));await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`outputs/hair-note-editorial/${name}.png`,fullPage:true,style:'main{position:relative!important} main>footer{position:absolute!important;bottom:0!important}'});};
 const validate=async()=>{
  check(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'No horizontal overflow');
  const bad=await page.locator('main *').evaluateAll(nodes=>nodes.filter(n=>[...n.childNodes].some(c=>c.nodeType===3&&/[가-힣]/.test(c.textContent))).filter(n=>{const s=getComputedStyle(n);return !s.fontFamily.includes('Pretendard')||Math.abs(parseFloat(s.lineHeight)/parseFloat(s.fontSize)-1.3)>.01||Math.abs(parseFloat(s.letterSpacing)/parseFloat(s.fontSize)+.02)>.002}).map(n=>n.textContent));check(!bad.length,'Korean typography '+JSON.stringify(bad));
 };
 const card=page.getByRole('region',{name:'나의 HAIR NOTE'});const wishes=page.getByRole('region',{name:'원하는 디테일'});
 check((await card.boundingBox()).y<(await wishes.boundingBox()).y,'Card precedes questions');
 check(await page.getByRole('heading',{name:'YOUR WISH',exact:true}).count()===0,'No large YOUR WISH title');
 check(await page.locator('details:not([open])').count()===1,'Final note starts collapsed');
 const suggestion=card.locator('h3').last();check(await suggestion.evaluate(el=>getComputedStyle(el).webkitLineClamp==='none'&&el.scrollHeight<=el.clientHeight+1),'Recommendation not clamped');
 await validate();await shot('01-default');
 await page.getByRole('button',{name:'사이드뱅',exact:true}).click();await page.getByLabel('더 전하고 싶은 말').fill('아침 손질은 5분 안에. 사용자 자유 메모');
 await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).draft.note.includes('사용자 자유 메모'),key);check((await state()).draft.note.includes('앞머리: 사이드뱅'),'Wishes and separate memo composed');
 await shot('02-selected');await page.reload();await page.getByText('디자이너에게 전달할 내용 보기',{exact:false}).waitFor();check((await state()).draft.noteInput.memo.includes('사용자 자유 메모'),'Memo survives refresh');
 await page.screenshot({path:'outputs/hair-note-editorial/note-430.png',fullPage:true,style:'main{position:relative!important} main>footer{position:absolute!important;bottom:0!important}'});
 await page.locator('details summary').click();check(await page.getByLabel('더 전하고 싶은 말').evaluate(el=>el.clientHeight<100),'Short memo stays near two lines');await shot('03-expanded');check(await page.getByRole('button',{name:'노트 수정하기'}).isVisible(),'Edit action available when expanded');await page.locator('details summary').click();check(!await page.getByRole('button',{name:'노트 수정하기'}).isVisible(),'Collapse hides editing tools');
 for(const width of [375,430]){await page.setViewportSize({width,height:874});await validate();}
 await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));check(await page.evaluate(()=>document.querySelector('main>footer').previousElementSibling.lastElementChild.getBoundingClientRect().bottom<=document.querySelector('main>footer').getBoundingClientRect().top),'Content scrolls clear of unchanged fixed CTA');
 const suggestions=[];
 for(const [service,label] of [['perm','디자인 펌'],['color','전체 염색']]){await page.goto(base+'/reservation/yoona/service');await page.getByRole('button',{name:new RegExp(label)}).click();await page.goto(base+'/reservation/yoona/note');await page.waitForFunction(({key,label})=>JSON.parse(localStorage.getItem(key)).draft.note.includes(label),{key,label});suggestions.push((await state()).draft.note);}
 check(suggestions[0]!==suggestions[1]&&suggestions[1].includes('컬러'),'Service-specific recommendations');
 await page.locator('details summary').click();await page.getByRole('button',{name:'노트 수정하기'}).click();const manual='직접 수정한 최종 노트\n이 문장은 보존';await page.getByRole('textbox',{name:'상담 노트 수정'}).fill(manual);await shot('04-editing');check(await page.getByLabel('더 전하고 싶은 말').isDisabled(),'Manual note locks optional inputs safely');await page.reload();await page.getByText('디자이너에게 전달할 내용 보기',{exact:false}).waitFor();check((await state()).draft.note===manual,'Manual final note protected from regeneration');
 await page.locator('details summary').click();page.once('dialog',dialog=>dialog.dismiss());await page.getByRole('button',{name:'프로필로 노트 다시 구성'}).click();check((await state()).draft.note===manual,'Cancel rebuild retains note');
 page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'프로필로 노트 다시 구성'}).click();await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).draft.noteInput.preserved,key);check((await state()).draft.note.includes(manual),'Confirmed rebuild also preserves manual original');
 await page.getByRole('button',{name:'예약 정보 확인하기'}).click();await page.getByRole('button',{name:'예약 정보 저장하기'}).waitFor();const final=(await state()).draft.note;
 check((await page.locator('details').textContent()).includes(manual),'Review exposes final note');await page.getByRole('button',{name:'예약 정보 저장하기'}).click();await page.getByRole('heading',{name:'예약 정보를 저장했어요.'}).waitFor();check((await state()).bookings[0].note===final,'Saved booking exact final note');check(JSON.stringify((await state()).bookings[1])===JSON.stringify(legacy),'Existing saved booking preserved exactly');
 await page.getByRole('link',{name:'MY 예약 내역 보기',exact:true}).click();await page.getByRole('link',{name:'상담 노트 및 상세 보기'}).first().click();await page.locator('details').waitFor();check((await page.locator('details').textContent()).includes(manual),'MY detail retains final note');
 check(await page.evaluate(()=>document.documentElement.scrollWidth===430),'No horizontal overflow');check(!errors.length,'No runtime errors');fs.writeFileSync('outputs/hair-note-editorial/qa.json',JSON.stringify({checks,errors},null,2));console.log({passed:checks.length,errors});
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
