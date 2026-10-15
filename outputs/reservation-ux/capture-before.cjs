const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({headless:true,channel:'chrome'});
 const p=await b.newPage({viewport:{width:430,height:874},isMobile:true,hasTouch:true});
 const shot=async name=>{await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:`outputs/reservation-ux/before-${name}.png`,fullPage:true});};
 await p.goto('http://localhost:3016/reservation/yoona/service');
 await p.getByRole('button',{name:/여성 디자인 컷/}).waitFor();await shot('service');
 await p.getByRole('button',{name:/여성 디자인 컷/}).click();await p.getByRole('button',{name:'다음',exact:true}).click();
 await p.locator('select').waitFor();await shot('schedule');
 await p.locator('select').selectOption({index:1});await p.getByRole('button',{name:'10:00',exact:true}).click();
 await p.getByRole('button',{name:'다음',exact:true}).click();await p.locator('textarea').waitFor();await shot('note');
 await p.getByRole('button',{name:'노트 저장하고 확인하기'}).click();await p.getByRole('button',{name:'데모 예약 완료하기'}).waitFor();await shot('review');
 await p.getByRole('button',{name:'데모 예약 완료하기'}).click();await p.getByText('데모 예약을 저장했어요.',{exact:true}).waitFor();await shot('complete');
 await b.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
