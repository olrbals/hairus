const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
for(const width of [430,390,360,1280]){const page=await browser.newPage({viewport:{width,height:900}});const base=process.env.BASE_URL||'http://localhost:3020';
await page.goto(base+'/home');await page.waitForTimeout(500);
assert.deepEqual(await page.locator('.home-discover .proto-card a').evaluateAll(a=>a.map(x=>x.getAttribute('href'))),['/styles/airy','/styles/tassel','/styles/sand']);
const names=await page.locator('.home-discover .proto-card > a > h3, .home-discover .proto-card > div > h3').allTextContents();assert.equal(names[5],'소프트 프린지');assert.equal(names.at(-1),'허쉬컷');
await page.goto(base+'/styles/airy');await page.waitForTimeout(500);
assert.equal(await page.locator('.airy-slide').count(),4);
assert.deepEqual(await page.locator('.airy-more-card').evaluateAll(a=>a.map(x=>x.textContent)),['샌드펌','테슬컷','스트레이트 레이어드 컷']);
assert.equal(await page.locator('.airy-more-card[href]').count(),2);
for(const name of ['', '  ', '규민']){await page.evaluate(n=>{localStorage.setItem('hairus.entry.v1',JSON.stringify({version:1,name:n}));window.dispatchEvent(new StorageEvent('storage',{key:'hairus.entry.v1'}));},name);await page.waitForTimeout(50);assert.equal(await page.locator('.airy-for-you .airy-section-heading p').textContent(),(name.trim()||'사용자')+'님에게 맞춘 스타일 가이드');}
const slider=page.locator('.airy-gallery-track');await slider.scrollIntoViewIfNeeded();const box=await slider.boundingBox();
await page.mouse.move(box.x+box.width-20,box.y+100);await page.mouse.down();await page.mouse.move(box.x+20,box.y+100,{steps:15});await page.mouse.up();await page.waitForTimeout(600);assert.ok(await slider.evaluate(e=>e.scrollLeft)>box.width/2);
await slider.evaluate(e=>e.scrollTo({left:0,behavior:'instant'}));await page.waitForTimeout(100);
for(let i=1;i<=3;i++){await page.mouse.move(box.x+100,box.y+100);await page.keyboard.down('Shift');await page.mouse.wheel(0,400);await page.keyboard.up('Shift');await page.waitForTimeout(600);assert.ok(Math.abs(await slider.evaluate(e=>e.scrollLeft)-box.width*i)<3);}
const more=page.locator('.airy-more-scroll');await more.scrollIntoViewIfNeeded();const mb=await more.boundingBox();await page.mouse.move(mb.x+200,mb.y+100);await page.mouse.down();await page.mouse.move(mb.x+20,mb.y+100,{steps:12});await page.mouse.up();await page.waitForTimeout(400);assert.ok(await more.evaluate(e=>e.scrollLeft)>50);assert.ok(page.url().endsWith('/styles/airy'));
for(const id of ['tassel','sand']){const response=await page.goto(base+'/styles/'+id);assert.equal(response.status(),200);}
await page.close();console.log('PASS',width);}
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
