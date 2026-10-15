const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const {newProfile}=await import('../../src/lib/analysis/profile.ts');
 const page=await browser.newPage({viewport:{width:430,height:874},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const base='http://127.0.0.1:3067';const key='hairus.prototype.v1';const checks=[];const check=(ok,label)=>{assert.ok(ok,label);checks.push(label);};
 const state=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 await page.goto(base+'/analysis/result');await page.evaluate(profile=>localStorage.setItem('hairus.profile.v2',JSON.stringify(profile)),newProfile());await page.reload();
 for(const [field,option] of [['length','단발'],['color','애쉬'],['texture','직모']]){
  await page.locator(`button[aria-labelledby="label-${field} value-${field}"]`).click();await page.locator('dialog[open]').getByRole('button',{name:new RegExp(option)}).first().click();await page.getByRole('button',{name:'저장하기',exact:true}).click();
 }
 check(await page.evaluate(()=>JSON.parse(localStorage.getItem('hairus.profile.v2')).edits.texture)==='직모','Profile edits saved through real UI');
 await page.goto(base+'/reservation/yoona/service');await page.getByRole('button',{name:/여성 디자인 컷/}).click();await page.getByRole('button',{name:'다음',exact:true}).click();await page.getByRole('region',{name:'예약 날짜 선택'}).locator('button:not(:disabled)[aria-pressed]').first().click();await page.getByRole('button',{name:'11:30',exact:true}).click();await page.getByRole('button',{name:'다음',exact:true}).click();await page.getByRole('button',{name:'노트 수정하기'}).waitFor();
 await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).draft.note.includes('직모'),key);
 let note=(await state()).draft.note;check(note.includes('단발')&&note.includes('애쉬'),'Latest saved profile reflected');check(!note.includes('시술 이력:')&&!/얼굴형:|목 길이:|피부 톤:/.test(note),'No invented history or raw reference features');
 await page.getByRole('button',{name:'사이드뱅',exact:true}).click();await page.getByLabel('더 전하고 싶은 이야기가 있나요?').fill('아침 손질은 5분 안에. 사용자 자유 메모');
 await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).draft.note.includes('사용자 자유 메모'),key);check((await state()).draft.note.includes('앞머리: 사이드뱅'),'Wishes and separate memo composed');
 await page.reload();await page.getByRole('button',{name:'노트 수정하기'}).waitFor();check((await state()).draft.noteInput.memo.includes('사용자 자유 메모'),'Memo survives refresh');
 await page.screenshot({path:'outputs/personalized-hair-note/note-430.png',fullPage:true,style:'main{position:relative!important} main>footer{position:absolute!important;bottom:0!important}'});
 const suggestions=[];
 for(const [service,label] of [['perm','디자인 펌'],['color','전체 염색']]){await page.goto(base+'/reservation/yoona/service');await page.getByRole('button',{name:new RegExp(label)}).click();await page.goto(base+'/reservation/yoona/note');await page.waitForFunction(({key,label})=>JSON.parse(localStorage.getItem(key)).draft.note.includes(label),{key,label});suggestions.push((await state()).draft.note);}
 check(suggestions[0]!==suggestions[1]&&suggestions[1].includes('컬러'),'Service-specific recommendations');
 await page.getByRole('button',{name:'노트 수정하기'}).click();const manual='직접 수정한 최종 노트\n이 문장은 보존';await page.getByRole('textbox',{name:'상담 노트 수정'}).fill(manual);await page.reload();await page.getByRole('button',{name:'노트 수정하기'}).waitFor();check((await state()).draft.note===manual,'Manual final note protected from regeneration');
 page.once('dialog',dialog=>dialog.dismiss());await page.getByRole('button',{name:'프로필로 노트 다시 구성'}).click();check((await state()).draft.note===manual,'Cancel rebuild retains note');
 page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'프로필로 노트 다시 구성'}).click();await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).draft.noteInput.preserved,key);check((await state()).draft.note.includes(manual),'Confirmed rebuild also preserves manual original');
 await page.getByRole('button',{name:'예약 정보 확인하기'}).click();await page.getByRole('button',{name:'예약 정보 저장하기'}).waitFor();const final=(await state()).draft.note;
 check((await page.locator('details').textContent()).includes(manual),'Review exposes final note');await page.getByRole('button',{name:'예약 정보 저장하기'}).click();await page.getByRole('heading',{name:'예약 정보를 저장했어요.'}).waitFor();check((await state()).bookings[0].note===final,'Saved booking exact final note');
 await page.getByRole('link',{name:'MY 예약 내역 보기',exact:true}).click();await page.getByRole('link',{name:'상담 노트 및 상세 보기'}).click();await page.locator('details').waitFor();check((await page.locator('details').textContent()).includes(manual),'MY detail retains final note');
 check(await page.evaluate(()=>document.documentElement.scrollWidth===430),'No horizontal overflow');check(!errors.length,'No runtime errors');fs.writeFileSync('outputs/personalized-hair-note/qa.json',JSON.stringify({checks,errors},null,2));console.log({passed:checks.length,errors});
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
