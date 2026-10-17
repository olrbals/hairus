import {test} from 'node:test';
import assert from 'node:assert/strict';
import {portfolioCardGeometry as geometry} from '../src/lib/prototype/portfolio-carousel.ts';
import {designerPortfolios} from '../src/lib/prototype/portfolio.ts';
import {existsSync,statSync} from 'node:fs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<.00001,`${a} != ${b}`);

test('Portfolio maintains an 8px gap and uninterrupted recycling for all counts and responsive sizes',()=>{
 for(const count of [4,6,7])for(const width of [430,390,360]){
  const scale=(width-48)/382;
  const cardsAt=p=>Array.from({length:count*3},(_,slot)=>({slot,...geometry(slot,p,count,scale)}));
  for(let p=-count*4;p<count*4;p+=.025){
   const before=cardsAt(p),after=cardsAt(p+.001);
   const visible=before.filter(c=>c.x+c.width>0&&c.x<width-24).sort((a,b)=>a.x-b.x);
   assert.ok(visible.length>=2);
   for(let i=1;i<visible.length;i++)near(visible[i].x-visible[i-1].x-visible[i-1].width,8);
   for(const c of visible){assert.ok(Math.abs(after[c.slot].x-c.x)<1);assert.ok(Math.abs(after[c.slot].width-c.width)<1);}
   for(const c of before)if(Math.abs(after[c.slot].x-c.x)>1000){assert.ok(c.x+c.width<0||c.x>width-24);assert.ok(after[c.slot].x+after[c.slot].width<0||after[c.slot].x>width-24);}
  }
 }
 assert.deepEqual(geometry(0,0,6),{offset:0,emphasis:1,x:0,width:335,height:460});
 assert.deepEqual(geometry(1,0,6),{offset:1,emphasis:0,x:343,width:241,height:330});
});

test('Every loop starts reduced, grows continuously, and finishes at the active size',()=>{
 for(const count of [4,6,7])for(const boundary of [-count,0,count,count*3,count*9]){
  const slot=((boundary%(count*3))+count*3)%(count*3);
  const start=geometry(slot,boundary-1,count),mid=geometry(slot,boundary-.5,count),end=geometry(slot,boundary,count);
  near(start.width,241);near(mid.width,288);near(end.width,335);
  assert.ok(start.x>mid.x&&mid.x>end.x);
 }
});

test('Both portfolios retain all 17 ordered Figma slots and use nonempty local images',()=>{
 const names=[['테슬컷','레이어드컷','레이어드컷','허쉬컷','레이어드컷','허쉬컷'],['매트브라운','애쉬베이지','매트브라운','매트브라운'],['샌드펌','그레이스펌','샌드펌','샌드펌','그레이스펌','히피펌','히피펌']];
 for(const data of Object.values(designerPortfolios)){
  assert.deepEqual(data.sections.map(s=>s.works.map(w=>w.caption)),names);
  for(const section of data.sections)for(const w of section.works)assert.ok(existsSync('public'+w.image)&&statSync('public'+w.image).size>0);
 }
 assert.notEqual(designerPortfolios.yoona.sections[0].works[0].image,designerPortfolios.sohee.sections[0].works[0].image);
 assert.deepEqual(designerPortfolios.yoona.sections.flatMap(s=>s.works.map(w=>w.figmaNode)),designerPortfolios.sohee.sections.flatMap(s=>s.works.map(w=>w.figmaNode)));
});
