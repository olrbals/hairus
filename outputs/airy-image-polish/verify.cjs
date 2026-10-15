const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:430,height:932},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://localhost:3107/styles/airy');await page.evaluate(()=>document.fonts.ready);
 const shots='outputs/airy-image-polish/';const checks=[];
 const assert=(ok,label)=>{if(!ok)throw Error(label);checks.push(label)};
 const gallery=page.locator('.airy-gallery-track');
 for(let i=0;i<4;i++){
  await page.locator('.airy-progress-button').nth(i).click();
  await page.waitForFunction(i=>Math.abs(document.querySelector('.airy-gallery-track').scrollLeft-i*382)<1,i);
  await page.locator('.airy-slide img').nth(i).evaluate(im=>im.decode());
  assert(await page.locator('.airy-progress-button').nth(i).getAttribute('aria-pressed')==='true','progress '+i);
  await gallery.screenshot({path:shots+'slide-'+i+'.png'});
 }
 const metrics=await page.evaluate(()=>({slides:[...document.querySelectorAll('.airy-slide')].map(el=>({width:el.clientWidth,height:el.clientHeight,src:el.firstChild.getAttribute('src'),natural:[el.firstChild.naturalWidth,el.firstChild.naturalHeight],style:el.firstChild.getAttribute('style')})),cards:[...document.querySelectorAll('.airy-more-image')].map(el=>({width:el.clientWidth,height:el.clientHeight})),title:document.querySelector('h1').textContent}));
 assert(metrics.slides.every(s=>s.width===382&&s.height===538),'430px gallery slots 382x538');
 assert(metrics.cards.every(s=>s.width===183&&s.height===298),'cards 183x298');
 assert(metrics.slides.slice(1).every(s=>s.natural[0]===2171&&s.natural[1]===724),'original angle resolution');
 assert(metrics.title==='Airy Layered','title preserved');
 const cdp=await page.context().newCDPSession(page);
 await page.evaluate(()=>scrollTo(0,0));
 const swipe=async(from,to)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:from,y:420}]});for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from+(to-from)*i/12,y:420}]});await page.waitForTimeout(20);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});};
 await swipe(60,360);
 await page.waitForFunction(()=>Math.abs(document.querySelector('.airy-gallery-track').scrollLeft-764)<1);
 assert(await page.locator('.airy-progress-button').nth(2).getAttribute('aria-pressed')==='true','touch swipe backward updates progress');
 await swipe(360,60);
 await page.waitForFunction(()=>Math.abs(document.querySelector('.airy-gallery-track').scrollLeft-1146)<1);
 assert(await page.locator('.airy-progress-button').nth(3).getAttribute('aria-pressed')==='true','touch swipe forward updates progress');
 for(let i=0;i<3;i++){const im=page.locator('.airy-more-image').nth(i);await im.scrollIntoViewIfNeeded();await im.locator('img').evaluate(im=>im.decode());await im.screenshot({path:shots+'more-'+i+'.png'});}
 await page.locator('.airy-progress-button').first().click();await page.waitForFunction(()=>document.querySelector('.airy-gallery-track').scrollLeft<1);await page.evaluate(()=>{document.querySelector('.airy-more-scroll').scrollLeft=0;scrollTo(0,0)});await page.screenshot({path:shots+'page-430.png',fullPage:true});
 assert(!errors.length,'no runtime errors');fs.writeFileSync(shots+'qa.json',JSON.stringify({checks,metrics,errors},null,2));await browser.close();console.log(checks);
})().catch(e=>{console.error(e);process.exit(1)});
