import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fields,newProfile,readProfile,persistProfile,editProfile,effectiveProfile} from '../src/lib/analysis/profile.ts';
import {optionsForField,profileOptions,historyPeriods} from '../src/lib/analysis/profile-options.ts';

function storage(entries={}){
 const values=new Map(Object.entries(entries));
 globalThis.localStorage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 return values;
}
function legacyProfile(){
 const p={...newProfile(),version:1};
 delete p.original.cutHistory;delete p.original.bleachHistory;
 p.original.condition='끝부분 건조함';
 p.edits={condition:'탈색 2회',dyeHistory:'브라운 염색',permHistory:'작년 펌',bangs:'기존 자유 입력',skin:null};
 return p;
}

test('v1 원본과 수정값을 유지하고 condition을 탈색으로 추측하지 않는다',()=>{
 const old=legacyProfile();const raw=JSON.stringify(old);const saved=storage({'hairus.profile.v1':raw});
 const p=readProfile();assert.equal(p.version,2);
 assert.equal(p.analyzedAt,old.analyzedAt);assert.equal(p.updatedAt,old.updatedAt);
 assert.equal(effectiveProfile(p).dyeHistory,'브라운 염색');
 assert.equal(effectiveProfile(p).permHistory,'작년 펌');
 assert.equal(effectiveProfile(p).bangs,'기존 자유 입력');
 assert.equal(effectiveProfile(p).skin,null);
 assert.equal(p.original.cutHistory,null);assert.equal(p.original.bleachHistory,null);
 assert.deepEqual(p.legacyCondition,{original:'끝부분 건조함',edit:'탈색 2회'});
 assert.ok(persistProfile(p));assert.equal(saved.get('hairus.profile.v1'),raw);
 assert.deepEqual(readProfile(),p);
});

test('이미 독립된 탈색 키가 있으면 condition과 충돌하거나 덮어쓰지 않는다',()=>{
 const old=legacyProfile();old.original.bleachHistory='6개월 이내';old.edits.bleachHistory=null;
 storage({'hairus.profile.v1':JSON.stringify(old)});
 const p=readProfile();assert.equal(p.original.bleachHistory,'6개월 이내');
 assert.equal(effectiveProfile(p).bleachHistory,null);
 assert.equal(p.legacyCondition.edit,'탈색 2회');
});

test('커트·펌·염색·탈색 저장값과 명시적 미입력이 독립적으로 복원된다',()=>{
 storage();let p=newProfile();
 for(const [key,value] of Object.entries({cutHistory:'1개월 이내',permHistory:'3개월 이내',dyeHistory:'6개월 이내',bleachHistory:'시술 이력 없음'}))p=editProfile(p,key,value);
 persistProfile(p);assert.deepEqual(readProfile().edits,p.edits);
 p=editProfile(readProfile(),'bleachHistory',null);persistProfile(p);
 assert.equal(effectiveProfile(readProfile()).bleachHistory,null);
 assert.equal(effectiveProfile(readProfile()).dyeHistory,'6개월 이내');
 assert.equal(effectiveProfile(readProfile()).permHistory,'3개월 이내');
 assert.equal(effectiveProfile(readProfile()).cutHistory,'1개월 이내');
});

test('v2 저장값을 이전 v1보다 우선하고 손상된 필수 값은 거절한다',()=>{
 const p=editProfile(newProfile(),'cut','보브');
 storage({'hairus.profile.v1':JSON.stringify(legacyProfile()),'hairus.profile.v2':JSON.stringify(p)});
 assert.equal(effectiveProfile(readProfile()).cut,'보브');
 delete p.original.face;storage({'hairus.profile.v2':JSON.stringify(p)});assert.equal(readProfile(),null);
});

test('13개 항목의 선택지를 제공하고 기존 자유 입력을 선택 가능한 값으로 보존한다',()=>{
 assert.equal(fields.length,13);
 for(const field of fields){
  assert.ok(profileOptions[field.key].length);
  const options=optionsForField(field.key,'기존 자유 입력');
  assert.deepEqual(options.at(-1),{value:'기존 자유 입력',label:'기존 자유 입력',detail:'기존 입력값'});
  const known=profileOptions[field.key][0].value;
  assert.equal(optionsForField(field.key,known).filter(o=>o.value===known).length,1);
 }
 for(const key of ['cutHistory','permHistory','dyeHistory','bleachHistory'])assert.deepEqual(profileOptions[key].map(o=>o.value),historyPeriods);
 assert.equal(fields.find(f=>f.key==='dyeHistory').label,'염색 이력');
 assert.equal(fields.find(f=>f.key==='permHistory').label,'펌 이력');
 assert.equal(fields.find(f=>f.key==='bleachHistory').label,'탈색 이력');
 assert.ok(!fields.some(f=>f.key==='condition'));
});
