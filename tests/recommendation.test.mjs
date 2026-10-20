import {test} from 'node:test';
import assert from 'node:assert/strict';
import {provinces} from '../src/lib/prototype/regions.ts';
import {matchQuestions} from '../src/lib/prototype/catalog.ts';
import {recommend,toggleChoice} from '../src/lib/prototype/logic.ts';
test('Recommendation uses four questions without the regional selection screen',()=>{
 assert.deepEqual(matchQuestions.map(q=>q.key),['gender','strength','consult','avoid']);assert.equal(provinces.length,18);
 assert.equal(provinces[0],'전체');assert.equal(provinces.at(-1),'제주특별자치도');
 assert.deepEqual(toggleChoice(['서울특별시'],'부산광역시',1),['부산광역시']);
 assert.deepEqual(matchQuestions.map(q=>q.max),[1,1,3,3]);
});
test('Recommendation new province values use existing salon addresses and retain legacy district scoring',()=>{
 const legacy=recommend({location:['성수']},{}),seoul=recommend({location:['서울특별시']},{});
 assert.deepEqual(legacy.map(x=>[x.designer.id,x.score]),seoul.map(x=>[x.designer.id,x.score]));
 assert.ok(seoul.every(x=>x.score===1));
 for(const location of ['전체','부산광역시','상관없어요'])assert.ok(recommend({location:[location]},{}).every(x=>x.score===0));
});
test('Fourth consultation choice keeps three answers, deselection allows replacement without mutating input',()=>{
 const q=matchQuestions.find(q=>q.key==='consult'),before=q.options.slice(0,3);
 assert.deepEqual(toggleChoice(before,q.options[3],q.max),before);
 const removed=toggleChoice(before,before[0],q.max);
 assert.deepEqual(toggleChoice(removed,q.options[3],q.max),[...before.slice(1),q.options[3]]);
 assert.deepEqual(before,q.options.slice(0,3));
});

test('Yoona match descriptions use supported preferences without inventing a match',async()=>{
 const {getYoonaMatchReasons}=await import('../src/lib/prototype/match-reasons.ts');
 const empty=getYoonaMatchReasons({},{});
 assert.match(empty.style,/윤아/);
 assert.match(empty.consultation,/윤아/);
 const tailored=getYoonaMatchReasons({strength:['손질하기 쉬운 결과'],consult:['취향 존중']},{mood:['내추럴']});
 assert.match(tailored.style,/손질/);
 assert.match(tailored.consultation,/취향을 존중/);
 const unrelated=getYoonaMatchReasons({consult:['단호한']},{mood:['모던 · 시크']});
 assert.deepEqual(unrelated,empty);
 const conversational=getYoonaMatchReasons({consult:['충분한 대화']},{});
 assert.notEqual(conversational.consultation,empty.consultation);
});
