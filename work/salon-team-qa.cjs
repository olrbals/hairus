const {chromium}=require(process.env.HAIRUS_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=process.env.HAIRUS_QA_URL||'http://127.0.0.1:3025';
const output=process.env.HAIRUS_QA_OUTPUT||'/private/tmp/hairus-salon-qa-1017';
fs.mkdirSync(output,{recursive:true});
const checks=[],metrics=[],errors=[];
function check(value,label){assert.ok(value,label);checks.push(label);}
function near(value,expected,label,tolerance=.15){check(Math.abs(value-expected)<tolerance,`${label}: ${value} ≈ ${expected}`);}
const expected=[['윤아','디자이너','화 · 금 OFF','31628.png'],['소희','실장','월 · 목 OFF','a91f5.png'],['하나','디자이너','수 · 목 OFF','63467.png'],['소율','원장','화 · 토 OFF','c451a.png'],['경현','디자이너','화 · 일 OFF','3a62b.png'],['종훈','디자이너','월 · 수 OFF','92e32.png']];
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({viewport:{width:430,height:874},deviceScaleFactor:1,reducedMotion:'reduce'});
 await context.addInitScript(()=>sessionStorage.setItem('hairus.popup.seen','1'));
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const go=async route=>{const res=await page.goto(base+route);check(res.status()===200,`${route} responds 200`);await page.locator('main').waitFor();await page.evaluate(()=>document.fonts.ready);};
 const loadImages=async()=>{for(const img of await page.locator('main img[loading=lazy]').all())await img.scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('main img')].every(img=>img.complete&&img.naturalWidth>0));await page.evaluate(()=>document.fonts.ready);};
 // Element screenshots hide only the floating navigation while recording the section.
 const sectionShot=async(selector,name)=>{const hide=await page.addStyleTag({content:'.hairus-page-header,nav[aria-label="매장 상세 섹션"]{visibility:hidden!important}'});await page.locator(selector).evaluate(el=>window.scrollTo({top:Math.floor(el.getBoundingClientRect().top+scrollY),behavior:'instant'}));await page.locator(selector).screenshot({path:path.join(output,name+'.png')});await hide.evaluate(el=>el.remove());};
 try{
  for(const width of [430,390,360])for(const height of [932,874,740,640]){
   await page.setViewportSize({width,height});await go('/salons/arvo');await loadImages();
   const initial=await page.locator('.hairus-page-header').boundingBox();near(initial.height,64,`${width}x${height} salon header height`);
   for(const y of [0,800,1900]){
    await page.evaluate(y=>scrollTo(0,y),y);
    const header=await page.locator('.hairus-page-header').boundingBox();near(header.y,0,`${width}x${height} salon header sticky at scroll ${y}`);
    if(y>800){const nav=await page.locator('nav[aria-label="매장 상세 섹션"]').boundingBox();near(nav.y,64,`${width}x${height} navigation below header`);}
    check(await page.locator('.hairus-page-header').evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+30,30));}),'Header is not covered by section navigation');
   }
   for(const id of ['notice','price','designers','reviews','information']){
    await page.locator(`nav a[href="#${id}"]`).click();await page.waitForTimeout(40);
    const rect=await page.locator('#'+id).boundingBox();check(rect.y>=111,`${id} heading clears the 112px navigation stack`);
    check(await page.locator(`nav a[href="#${id}"]`).getAttribute('aria-current')==='location',`${id} active section tracks navigation`);
   }
   const info=await page.locator('#information').evaluate(el=>{
    const rect=el.getBoundingClientRect(),s=getComputedStyle(el),last=el.querySelector('li:last-child button').getBoundingClientRect(),cta=document.querySelector('main>footer a').getBoundingClientRect(),f=document.querySelector('[class*="_featuredDesigners"]');
    const first=f.children[0].getBoundingClientRect(),second=f.children[1].getBoundingClientRect();
    return {width:rect.width,height:rect.height,padding:s.padding,paddingBottom:parseFloat(s.paddingBottom),footerPadding:parseFloat(getComputedStyle(document.querySelector('main>footer')).paddingTop),gap:cta.top-last.bottom,featuredGap:second.top-first.bottom,photos:[...el.querySelectorAll('[class*="_interior"] img')].map(img=>{const r=img.getBoundingClientRect();return {width:r.width,height:r.height,src:img.getAttribute('src')};})};
   });
   near(info.gap,64,`${width}x${height} final Information-to-booking gap`);near(info.paddingBottom,24,'Information bottom padding');near(info.footerPadding,40,'Additional booking spacing');near(info.featuredGap,12,'Featured designers exact gap');
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Salon ${width}x${height} no horizontal overflow`);
   check(await page.locator('#information').innerText()==='INFORMATION\n매장 내부\nSNS\n카카오톡 오픈 채팅\n네이버 블로그\n인스타그램','Information contains only the Figma text');
   check(await page.locator('#information button:disabled').count()===3,'Existing three SNS disabled states retained');
   check(await page.locator('#reviews [class*="_demoLabel"]').count()===0,'Salon demo label removed from rendered structure');
   near(await page.locator('#reviews [class*="_ratingMeta"]').evaluate(el=>parseFloat(getComputedStyle(el).marginTop)),12,'Salon rating meta margin');
   near(await page.locator('#reviews [class*="_ratingScore"]>span').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)),28,'Salon rating star 28px');
   check(await page.locator('#reviews [role=progressbar]').count()===9,'Rating distribution and highlights preserved');check(await page.locator('#reviews article').count()===2,'Two original review cards preserved');
   const logos=page.locator('[data-figma-node="945:9579"]');check(await logos.count()===2,'Two native logo frames rendered');
   const logo=await logos.first().evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el.firstElementChild);return {width:r.width,height:r.height,font:s.fontFamily,fontSize:s.fontSize,lineHeight:s.lineHeight,tracking:s.letterSpacing,images:el.querySelectorAll('img').length};});
   near(logo.width,40,'Logo frame width');near(logo.height,40,'Logo frame height');check(logo.images===0&&logo.font.includes('Arvo Reenie Beanie')&&logo.fontSize==='24px','Logo uses exact live font, no raster image');
   check(await page.evaluate(()=>document.fonts.check('24px "Arvo Reenie Beanie"')),'Logo font loaded');
   const cta=await page.locator('main>footer a').evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {width:r.width,height:r.height,fontSize:s.fontSize,fontWeight:s.fontWeight,bg:s.backgroundColor,radius:s.borderRadius,href:el.getAttribute('href')};});
   near(cta.height,61,'Approved booking CTA height');near(cta.width,width-38,'Approved booking CTA width');check(cta.fontSize==='16px'&&cta.bg==='rgb(0, 0, 0)'&&cta.radius==='4px'&&cta.href==='/salons/arvo/designers','Primary CTA visual style and route retained');
   if(width===430){near(info.height,789,'Figma Information section height',.3);const sizes=[[382,257.08],[119,169],[121,169],[126,168]];info.photos.forEach((p,i)=>{near(p.width,sizes[i][0],`Information image ${i} width`);near(p.height,sizes[i][1],`Information image ${i} height`,.2);});}
   metrics.push({screen:'salon',width,height,info,logo,cta});
   if(height===874){
    await sectionShot('#information',`information-${width}`);await sectionShot('#price',`after-price-${width}`);await sectionShot('#designers',`after-featured-${width}`);await sectionShot('#notice',`after-notice-${width}`);await sectionShot('#reviews',`after-reviews-${width}`);
    await page.evaluate(()=>scrollTo(0,0));await page.locator('.hairus-page-header').screenshot({path:path.join(output,`after-salon-header-${width}.png`)});await page.screenshot({path:path.join(output,`after-salons-arvo-${width}.png`),fullPage:true});
   }
   await go('/salons/arvo/designers');await loadImages();await page.evaluate(()=>scrollTo(0,0));
   const header=await page.locator('.hairus-page-header').boundingBox();near(header.height,64,'Team approved header height');
   const rows=page.locator('article[class*="_designerRow"]');check(await rows.count()===6,'Team contains exactly six existing designers');
   for(let i=0;i<expected.length;i++){
    const row=rows.nth(i),[name,rank,off,image]=expected[i];
    check(await row.locator('strong').innerText()===`${name} ${rank}`,`Correct name/rank for ${name}`);check(await row.locator('[class*="_designerName"] small').innerText()===off,`${name} OFF days correct`);
    check((await row.locator('img').getAttribute('src')).endsWith(image),`${name} existing image retained`);near((await row.boundingBox()).height,76,`${name} existing row height`);
    const control=row.locator('[class*="_reserveDesigner"]');
    if(name==='윤아'){check(await control.getAttribute('href')==='/reservation/yoona/service','Only Yoona keeps booking link');}
    else{
     check(await control.evaluate(el=>el.tagName==='BUTTON'&&el.disabled&&!el.hasAttribute('href')),`${name} native disabled button`);check(await control.evaluate(el=>getComputedStyle(el).opacity)==='1',`${name} disabled button not faded`);
     await control.scrollIntoViewIfNeeded();const r=await control.boundingBox(),url=page.url();await page.mouse.click(r.x+r.width/2,r.y+r.height/2);check(page.url()===url&&await page.locator('dialog[open]').count()===0,`${name} click causes no navigation, reservation or modal`);
    }
   }
   near(await page.locator('[class*="_recommended"] h2').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)),20,'Team recommended heading Figma 20px');
   check(await page.locator('main').evaluate(el=>[...el.querySelectorAll('article')].every(row=>row.scrollWidth<=row.clientWidth)),`Team ${width}x${height} cards fit`);
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Team ${width}x${height} no horizontal overflow`);
   await page.evaluate(()=>scrollTo(0,700));near((await page.locator('.hairus-page-header').boundingBox()).y,0,'Team existing sticky header retained');
   if(height===874){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(output,`after-salons-arvo-designers-${width}.png`),fullPage:true});await page.locator('.hairus-page-header').screenshot({path:path.join(output,`after-team-header-${width}.png`)});}
   metrics.push({screen:'team',width,height});
   console.log(`PASS ${width}x${height} salon + team`);
  }
  await page.setViewportSize({width:430,height:874});
  await go('/salons/arvo/designers');await page.locator('main>footer button').click();check(await page.getByRole('link',{name:'윤아 디자이너 예약하기',exact:true}).evaluate(el=>el===document.activeElement),'Existing Team bottom CTA focuses Yoona booking');await page.getByRole('link',{name:'윤아 디자이너 예약하기',exact:true}).click();await page.waitForURL('**/reservation/yoona/service');check(true,'Yoona booking enters existing service flow');
  // Other pages retain their own booking availability; no global reservation lock.
  await go('/designers/sohee');check(await page.locator('a[href^="/reservation/sohee/"]').count()>0,'Sohee detail booking remains available outside Team');
  for(const route of ['/designers/yoona','/designers/sohee','/salons/arvo/reviews']){
   await go(route);const designer=route.startsWith('/designers/');near(await page.locator('#reviews [class*="_ratingMeta"]').evaluate(el=>parseFloat(getComputedStyle(el).marginTop)),designer?12:5,`${route} requested rating meta`);near(await page.locator('#reviews [class*="_ratingScore"]>span').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)),designer?28:22,`${route} requested star size`);
   check(await page.locator('#reviews [class*="_demoLabel"]').count()===(designer?0:1),`${route} correct demo-label scope`);
   check(await page.locator('#reviews [role=progressbar]').count()===9&&await page.locator('#reviews article').count()===2,`${route} original review contents and charts preserved`);
  }
  // Existing Notice interactions are preserved.
  await go('/salons/arvo');await page.getByRole('button',{name:'디자이너별 휴무일',exact:true}).click();check(await page.locator('#designer-days-off').isVisible(),'Notice days-off expansion still works');check(await page.locator('#designer-days-off>div').count()===6,'Notice still shares six designer records');
  await page.getByRole('button',{name:'첫 방문 최대 30% 할인 혜택 안내',exact:true}).click();check((await page.locator('[role=status]').innerText()).includes('실제 쿠폰 발급은 준비 중'),'Original benefit notice still works');
  // Retina: exact live text geometry is independent of device-pixel ratio.
  const retina=await browser.newContext({viewport:{width:430,height:874},deviceScaleFactor:3});const rp=await retina.newPage();await rp.goto(base+'/salons/arvo');await rp.evaluate(()=>document.fonts.ready);const logo=rp.locator('[data-figma-node="945:9579"]').first();await logo.screenshot({path:path.join(output,'logo-3x.png')});near((await logo.boundingBox()).width,40,'Retina logo remains 40 CSS pixels');await retina.close();
  // Unchanged pages for before/after image comparison.
  for(const route of ['/home','/explore','/explore?category=designer','/explore?category=salon','/saved','/welcome','/login','/analysis/guide','/magazine','/salons/arvo/reviews','/designers/sohee']){
   await go(route);await loadImages();await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(output,'regression-after-'+route.slice(1).replaceAll(/[/?=]/g,'-')+'.png'),fullPage:true});
  }
  check(errors.length===0,'No browser runtime errors');
  fs.writeFileSync(path.join(output,'SALON_TEAM_QA.json'),JSON.stringify({passed:checks.length,checks,metrics,errors},null,2));console.log(`PASS: ${checks.length} checks; ${metrics.length} responsive page combinations; no runtime errors.`);
 }catch(error){await page.screenshot({path:path.join(output,'salon-team-failure.png'),fullPage:true});fs.writeFileSync(path.join(output,'SALON_TEAM_QA_FAILURE.json'),JSON.stringify({error:String(error),checks,metrics,errors},null,2));throw error;}
 finally{await browser.close();}
})();
