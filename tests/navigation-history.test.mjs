import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {installNavigationHistory, goBack, goBackTo} from '../src/lib/navigation-history.ts';

function fixture(initial='/home', externalEntries=0) {
  let entries=[...Array.from({length:externalEntries},()=>({url:'https://external.test/',state:null})),{url:`https://hairus.test${initial}`,state:{__NA:true,tree:'next-tree'}}];
  let position=entries.length-1;
  const browser={
    get location(){return new URL(entries[position].url);},
    history:{
      get state(){return entries[position].state;},
      get length(){return entries.length;},
      pushState(state,_,url){entries=entries.slice(0,position+1);entries.push({state,url:new URL(url,entries[position].url).href});position++;},
      replaceState(state,_,url){entries[position]={state,url:url==null?entries[position].url:new URL(url,entries[position].url).href};},
      go(delta){if(position+delta>=0&&position+delta<entries.length)position+=delta;},
    },
  };
  const router={back:()=>browser.history.go(-1),replace:url=>browser.history.replaceState({__NA:true},'',url)};
  const push=url=>browser.history.pushState({__NA:true,tree:url},'',url);
  const back=fallback=>goBack(router,fallback,browser);
  const current=()=>browser.location.pathname+browser.location.search;
  installNavigationHistory(browser);
  return {browser,router,push,back,current};
}

for(const prefix of ['/recommendation','/preferences']){
  test(`${prefix}: 03 → 02 → 01 → actual entry, preserving forward history`,()=>{
    const f=fixture('/saved');f.push(`${prefix}/1`);f.push(`${prefix}/2`);f.push(`${prefix}/3`);
    for(const expected of [`${prefix}/2`,`${prefix}/1`,'/saved']){f.back('/home');assert.equal(f.current(),expected);}
    assert.equal(f.browser.history.length,4);
    f.browser.history.go(1);assert.equal(f.current(),`${prefix}/1`);
  });
  test(`${prefix}: back, next, back, back never revisits duplicate steps`,()=>{
    const f=fixture(`${prefix}/intro`);f.push(`${prefix}/1`);f.push(`${prefix}/2`);f.push(`${prefix}/3`);
    f.back('/home');f.push(`${prefix}/3`);f.back('/home');assert.equal(f.current(),`${prefix}/2`);
    f.back('/home');assert.equal(f.current(),`${prefix}/1`);assert.equal(f.browser.history.length,4);
  });
}
test('same detail returns to its actual Explore or Saved list, including filters',()=>{
  for(const source of ['/explore?category=designer','/saved']){
    const f=fixture(source);f.push('/designers/yoona');f.push('/designers/yoona/portfolio');
    f.back('/explore');assert.equal(f.current(),'/designers/yoona');
    f.back('/explore');assert.equal(f.current(),source);
  }
});
test('external browser history is NOT an app predecessor; direct-entry fallback replaces',()=>{
  const f=fixture('/designers/yoona',5);f.back('/explore?category=designer');
  assert.equal(f.current(),'/explore?category=designer');assert.equal(f.browser.history.length,6);
  f.back('/home');assert.equal(f.current(),'/home');assert.equal(f.browser.history.length,6);
});
test('replace on booking completion preserves origin and does not add a repeatable submission',()=>{
  const f=fixture('/designers/yoona');f.push('/reservation/yoona/service');
  f.router.replace('/reservation/yoona/service?return=review');
  f.router.replace('/reservations/demo');f.back('/my');
  assert.equal(f.current(),'/designers/yoona');assert.equal(f.browser.history.length,2);
  f.browser.history.go(1);assert.equal(f.current(),'/reservations/demo');
});
test('native back/forward and query/hash entries retain Next state and correct ancestry',()=>{
  const f=fixture();f.push('/explore?category=salon');f.push('/salons/arvo-seongsu');f.push('/salons/arvo-seongsu#team');
  f.browser.history.go(-1);assert.equal(f.current(),'/salons/arvo-seongsu');
  f.browser.history.go(-1);assert.equal(f.current(),'/explore?category=salon');
  f.browser.history.go(1);f.back('/home');assert.equal(f.current(),'/explore?category=salon');
  assert.equal(f.browser.history.state.__NA,true);assert.equal(f.browser.history.state.tree,'/explore?category=salon');
});
test('same-URL pushes and Strict Mode installation do not duplicate entries',()=>{
  const f=fixture();installNavigationHistory(f.browser);
  f.push('/home');f.push('/explore');f.push('/explore');
  assert.equal(f.browser.history.length,2);f.back('/home');assert.equal(f.current(),'/home');
});
test('new entries start at the top and retain per-entry scroll metadata',()=>{
  const f=fixture('/home');
  assert.equal(f.browser.history.state.__hairusScrollTop,0);
  f.push('/explore');
  assert.equal(f.browser.history.state.__hairusScrollTop,0);
  f.back('/home');
  assert.equal(f.browser.history.state.__hairusScrollTop,0);
});
test('onboarding backward dots traverse existing steps; skipped steps use replacement',()=>{
  const f=fixture('/onboarding/1');f.push('/onboarding/2');f.push('/onboarding/3');
  goBackTo(f.router,'/onboarding/1',f.browser);assert.equal(f.current(),'/onboarding/1');assert.equal(f.browser.history.length,3);
  const direct=fixture('/onboarding/3');goBackTo(direct.router,'/onboarding/2',direct.browser);
  assert.equal(direct.current(),'/onboarding/2');assert.equal(direct.browser.history.length,1);
});
test('refresh re-experience script remains intact; navigation never reads/writes user storage',()=>{
  const layout=readFileSync(new URL('../src/app/layout.tsx',import.meta.url),'utf8');
  assert.match(layout,/navigation\?\.type==='reload'/);
  assert.match(layout,/location\.replace\('\/'\)/);
  assert.match(layout,/store\.removeItem\(key\)/);
  const helper=readFileSync(new URL('../src/lib/navigation-history.ts',import.meta.url),'utf8');
  assert.doesNotMatch(helper,/localStorage|sessionStorage|history\.length/);
  assert.match(helper,/if \(changesDocument && typeof window/);
});
