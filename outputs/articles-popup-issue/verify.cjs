const {chromium}=require(process.env.HAIRUS_PLAYWRIGHT||'C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const out='outputs/articles-popup-issue';
const before=JSON.parse(fs.readFileSync(out+'/before.json','utf8'));
const base=process.env.HAIRUS_QA_URL||'http://localhost:3017';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const checks=[],measurements=[],errors=[];
 const check=(condition,label)=>{assert.ok(condition,label);checks.push(label);};
 try{
 const context=await browser.newContext({viewport:{width:430,height:875},isMobile:true,hasTouch:true});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
 for(const width of [430,390,360]){
  await page.setViewportSize({width,height:875});
  for(const route of ['popup','issue','care']){
   await page.goto(base+'/articles/'+route);await page.evaluate(()=>document.fonts.ready);
   const original=before.find(row=>row.width===width&&row.route===route);
   if(route==='care'){
    check(await page.locator('main').evaluate(el=>el.outerHTML)===original.html,`${width}px: /care markup preserved`);
    check(await page.locator('.hc-epilogue').evaluate(el=>getComputedStyle(el).marginTop)==='52px',`${width}px: /care epilogue unchanged`);
    check(await page.locator('.hc-header').evaluate(el=>getComputedStyle(el).position)==='static',`${width}px: /care header unchanged`);
    continue;
   }
   const header=page.locator('header');
   const headerRect=await header.boundingBox();
   check(headerRect.y===0&&headerRect.height===64&&headerRect.width===width,`${width}px ${route}: original header size and top position`);
   const cover=await page.locator('.pd-hero,.hc-cover').boundingBox();
   check(cover.y===original.cover.y&&cover.height===original.cover.height,`${width}px ${route}: sticky header preserves initial content position`);
   check(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),`${width}px ${route}: no horizontal overflow`);
   await page.locator('img').evaluateAll(images=>images.forEach(img=>img.loading='eager'));
   await page.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0));
   if(route==='popup'){
    const metrics=await page.evaluate(()=>{
     const save=document.querySelector('.pd-experience-media--save'),img=save.querySelector('img');
     const frame=save.getBoundingClientRect(),image=img.getBoundingClientRect();
     return {frame:{width:frame.width,height:frame.height},image:{left:image.x-frame.x,top:image.y-frame.y,width:image.width,height:image.height},fit:getComputedStyle(img).objectFit,experiences:[...document.querySelectorAll('.pd-experience-media')].map(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height,src:el.querySelector('img').getAttribute('src')}})};
    });
    check(Math.abs(metrics.frame.width/metrics.frame.height-212/208)<.001,`${width}px SAVE: Figma frame aspect ratio`);
    check(width!==430||(metrics.frame.width===212&&metrics.frame.height===208),`${width}px SAVE: Figma 212 × 208 frame at 430px`);
    check(Math.abs(metrics.image.width/metrics.frame.width-1.39)<.001&&Math.abs(metrics.image.height/metrics.frame.height-1.1393)<.001&&Math.abs(metrics.image.left/metrics.frame.width+.1945)<.001&&Math.abs(metrics.image.top/metrics.frame.height+.0673)<.001&&metrics.fit==='fill',`${width}px SAVE: Figma source dimensions and offsets restored without cover crop`);
    check(JSON.stringify(metrics.experiences.slice(0,3))===JSON.stringify(original.experiences.slice(0,3)),`${width}px: DISCOVER/TRY/TOUCH image geometry and sources preserved`);
    const buttonStyles=await page.locator('.pd-benefit button').evaluateAll(buttons=>buttons.map(el=>{const c=getComputedStyle(el);return {height:el.getBoundingClientRect().height,font:c.fontSize,radius:c.borderRadius,padding:c.padding,background:c.backgroundColor,color:c.color}}));
    check(buttonStyles.every(c=>c.height===61&&c.font==='16px'&&c.radius==='4px'&&c.padding==='20px 24px'&&c.background==='rgb(0, 0, 0)'&&c.color==='rgb(255, 255, 255)'),`${width}px: BENEFIT reuses shared primary button style`);
    check(await page.locator('.pd-benefit-content h2').evaluateAll(els=>els.every(el=>getComputedStyle(el).fontSize==='24px')),`${width}px: BENEFIT heading 24px`);
    const korean=await page.evaluate(()=>{
     const walker=document.createTreeWalker(document.querySelector('main'),NodeFilter.SHOW_TEXT);const rows=[];
     for(let n=walker.nextNode();n;n=walker.nextNode())if(/[가-힣]/.test(n.textContent)){const el=n.parentElement,c=getComputedStyle(el);rows.push({text:n.textContent,font:c.fontFamily,spacing:c.letterSpacing,ratio:parseFloat(c.lineHeight)/parseFloat(c.fontSize)});}
     return rows;
    });
    check(korean.every(row=>row.font.includes('Pretendard')&&row.spacing==='-1.2px'&&Math.abs(row.ratio-1.3)<.001),`${width}px: all Korean text uses Pretendard / 130% / -1.2px`);
    const clipped=await page.locator('.pd-benefit-content,.pd-experience-copy,.pd-footer').evaluateAll(els=>els.filter(el=>el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1).map(el=>el.className));
    check(clipped.length===0,`${width}px: Korean copy and BENEFIT content not clipped`);
    await page.locator('.pd-experience-item').last().screenshot({path:`${out}/save-${width}.png`});
    await page.locator('.pd-benefits').screenshot({path:`${out}/benefits-${width}.png`});
    const bottom=await page.evaluate(()=>{const main=document.querySelector('main'),footer=document.querySelector('.pd-footer'),shell=document.querySelector('.mobile-shell');return {padding:getComputedStyle(main).paddingBottom,shellPadding:getComputedStyle(shell).paddingBottom,gap:main.getBoundingClientRect().bottom-footer.getBoundingClientRect().bottom};});
    check(bottom.padding==='0px'&&bottom.shellPadding==='0px'&&bottom.gap===0,`${width}px: no space after POPUP footer`);
    measurements.push({width,route,metrics,buttonStyles,korean,bottom});
    for(const [index,title] of ['15% 할인 쿠폰','디자이너 세션'].entries()){
     await page.locator('.pd-benefit button').nth(index).click();
     const dialog=page.getByRole('dialog');await dialog.waitFor();
     check(await dialog.locator('h2').textContent()===title,`${width}px: benefit ${index+1} retains dialog action`);
     check(await dialog.locator('h2,p,.pd-dialog-confirm').evaluateAll(els=>els.every(el=>{const c=getComputedStyle(el);return c.fontFamily.includes('Pretendard')&&c.letterSpacing==='-1.2px'&&Math.abs(parseFloat(c.lineHeight)/parseFloat(c.fontSize)-1.3)<.001})),`${width}px: dialog Korean typography`);
     await dialog.getByRole('button',{name:'확인',exact:true}).click();check(await dialog.count()===0,`${width}px: benefit dialog closes`);
    }
   }else{
    check(await page.locator('.hc-epilogue').evaluate(el=>getComputedStyle(el).marginTop)==='76px',`${width}px ISSUE: epilogue margin 76px`);
    const gap=await page.evaluate(()=>document.querySelector('.hc-epilogue').getBoundingClientRect().top-document.querySelector('.hc-steps').getBoundingClientRect().bottom);
    check(gap===76,`${width}px ISSUE: actual epilogue gap 76px`);
   }
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${out}/${route}-${width}.png`,fullPage:true});
   for(const position of [600,'bottom']){
    await page.evaluate(pos=>scrollTo(0,pos==='bottom'?document.documentElement.scrollHeight:pos),position);
    const pinned=await header.boundingBox();
    check(pinned.y===0&&pinned.height===64,`${width}px ${route}: header pinned at ${position}`);
    check(await page.locator('header a,header button').evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),`${width}px ${route}: back control accessible at ${position}`);
   }
   await page.screenshot({path:`${out}/${route}-sticky-${width}.png`});
   if(route==='popup'){await page.getByRole('link',{name:'홈으로 돌아가기'}).click();await page.waitForURL('**/home');}
   else{await page.goto(base+'/magazine');await page.goto(base+'/articles/issue');await page.evaluate(()=>scrollTo(0,600));await page.getByRole('button',{name:'뒤로 가기',exact:true}).click();await page.waitForURL('**/magazine');}
   check(true,`${width}px ${route}: existing back navigation works`);
  }
 }
 check(errors.length===0,'No runtime or hydration errors');
 fs.writeFileSync(out+'/qa.json',JSON.stringify({checks,measurements,errors},null,2));
 console.log(JSON.stringify({passed:checks.length,errors}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
