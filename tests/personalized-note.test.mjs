import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hairNote} from '../src/lib/prototype/logic.ts';
import {styleSuggestion,wishQuestions} from '../src/lib/prototype/personalized-note.ts';
import {newProfile,editProfile,effectiveProfile,persistProfile,readProfile} from '../src/lib/analysis/profile.ts';
test('saved edits are authoritative and current color never implies dye history',()=>{
 const memory=new Map();globalThis.localStorage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value)};
 let profile=newProfile();for(const [key,value] of Object.entries({length:'단발 (턱선)',color:'애쉬 브라운',texture:'직모',skin:'쿨톤',neck:'보통'}))profile=editProfile(profile,key,value);
 persistProfile(profile);const effective=effectiveProfile(readProfile());const note=hairNote(effective,{},'color');
 assert.ok(note.includes('애쉬 브라운'));assert.ok(!note.includes('시술 이력:'));assert.ok(!/얼굴형:|목 길이:|피부 톤:|최근 2개월/.test(note));
 profile=editProfile(profile,'dyeHistory','2개월 전 흑갈색 염색');assert.ok(hairNote(effectiveProfile(profile),{},'color').includes('염색: 2개월 전 흑갈색 염색'));
});
test('recommendations vary with service, length, texture, face, neck, tone and history',()=>{
 const profile=effectiveProfile(newProfile());const cut=styleSuggestion(profile,'cut');const perm=styleSuggestion(profile,'perm');const color=styleSuggestion(profile,'color');assert.equal(new Set([cut,perm,color]).size,3);
 for(const [service,key,value] of [['cut','face','긴형'],['cut','length','단발'],['cut','cut','보브'],['perm','texture','직모'],['perm','permHistory','지난달 펌'],['color','skin','쿨톤']])assert.notEqual(styleSuggestion({...profile,[key]:value},service),styleSuggestion(profile,service));
 assert.notEqual(styleSuggestion({neck:'짧은 편'},'cut'),styleSuggestion({neck:'보통'},'cut'));
 assert.ok(!hairNote(null,{},'perm').includes('미입력'));
});
test('optional wishes and separate memo survive serialization without altering preserved notes',()=>{
 const input={wishes:{bangs:'사이드뱅',length:'유지',perm:'확실한 컬'},memo:'아침 손질은 5분 안에',preserved:'사용자가 수정한 원문\n두 번째 줄'};
 const note=hairNote(null,{},'cut',JSON.parse(JSON.stringify(input)));assert.ok(note.includes('앞머리: 사이드뱅'));assert.ok(!note.includes('펌: 확실한 컬'));assert.ok(note.includes(input.memo));assert.ok(note.includes(input.preserved));
 assert.ok(wishQuestions('cut').length<=3);assert.equal(wishQuestions('color').length,0);
});
