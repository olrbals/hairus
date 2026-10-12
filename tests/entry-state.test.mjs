import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readEntry,writeEntry} from '../src/lib/entry-state.ts';
test('손상된 저장소·임의 값은 안전한 기본 상태로 복구한다',()=>{globalThis.localStorage={getItem:()=>'{broken'};assert.equal(readEntry().loginMode,'guest');globalThis.localStorage={getItem:()=>JSON.stringify({version:1,onboardingStep:99,name:42,loginMode:'admin'})};assert.equal(readEntry().onboardingStep,1);assert.equal(readEntry().name,'');assert.equal(readEntry().loginMode,'guest');});
test('진행·데모 모드·이름을 보존하고 건너뛰기에서 분석 결과를 만들지 않는다',()=>{let value=null;globalThis.localStorage={getItem:()=>value,setItem:(_key,next)=>{value=next;}};writeEntry({onboardingStep:3,onboardingDone:true});writeEntry({loginMode:'demo',name:'테스트'});writeEntry({analysis:'skipped'});const state=readEntry();assert.equal(state.name,'테스트');assert.equal(state.onboardingDone,true);assert.equal(state.analysis,'skipped');assert.equal('profile' in state,false);});
test('브라우저 저장소 접근이 차단돼도 예외로 여정을 중단하지 않는다',()=>{globalThis.localStorage={getItem:()=>{throw Error('blocked')},setItem:()=>{throw Error('blocked')}};assert.doesNotThrow(()=>writeEntry({loginMode:'demo'}));});
