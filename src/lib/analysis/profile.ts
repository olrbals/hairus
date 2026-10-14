/** 1012 코덱스 시연용 결과 및 수정 시트. 시술 이력은 사용자 입력으로만 관리한다. */
export const fields = [
 {key:'length',label:'기장',group:'Hair Details',initial:'슈퍼 롱 (허리선)',kind:'length'},
 {key:'bangs',label:'앞머리',group:'Hair Details',initial:'없음',kind:'chips'},
 {key:'texture',label:'헤어 텍스처',group:'Hair Details',initial:'반곱슬',kind:'chips'},
 {key:'cut',label:'커트 스타일',group:'Hair Details',initial:'레이어드',kind:'chips'},
 {key:'color',label:'헤어 컬러',group:'Hair Details',initial:'흑갈색',kind:'swatches'},
 {key:'face',label:'얼굴형',group:'Other Features',initial:'계란형',kind:'face'},
 {key:'neck',label:'목 길이',group:'Other Features',initial:'짧은 편',kind:'chips'},
 {key:'skin',label:'피부톤',group:'Other Features',initial:'뉴트럴',kind:'swatches'},
 {key:'layer',label:'레이어',group:'직접 알려주세요',initial:null,kind:'chips'},
 {key:'cutHistory',label:'커트 이력',group:'직접 알려주세요',initial:null,kind:'history'},
 {key:'permHistory',label:'펌 이력',group:'직접 알려주세요',initial:null,kind:'history'},
 {key:'dyeHistory',label:'염색 이력',group:'직접 알려주세요',initial:null,kind:'history'},
 {key:'bleachHistory',label:'탈색 이력',group:'직접 알려주세요',initial:null,kind:'history'},
] as const;
export type FieldKey=typeof fields[number]['key'];
export type Values=Record<FieldKey,string|null>;
export interface Profile {
 version:2; source:'mock'; original:Values; edits:Partial<Values>; analyzedAt:string; updatedAt:string;
 /** v1 condition was used for both care and bleach labels; never infer its meaning. */
 legacyCondition?: {original:string|null; edit?:string|null};
}
export const lengths=['쇼트 (귀 주변)','단발 (턱선)','미디엄 (어깨 / 쇄골)','롱 (가슴선)','슈퍼 롱 (허리선)'];
export const faces=['계란형','둥근형','각진형','긴형','하트형','역삼각형'];
export function newProfile():Profile {
 const date=new Date().toISOString();
 return {version:2,source:'mock',original:Object.fromEntries(fields.map(f=>[f.key,f.initial])) as Values,edits:{},analyzedAt:date,updatedAt:date};
}
export function effectiveProfile(profile:Profile):Values{return {...profile.original,...profile.edits};}
export function editProfile(profile:Profile,key:FieldKey,value:string|null):Profile{return {...profile,edits:{...profile.edits,[key]:value?.trim().slice(0,160)||null},updatedAt:new Date().toISOString()};}
const storageKey='hairus.profile.v2';
const legacyStorageKey='hairus.profile.v1';
let memory:Profile|null=null;
export function persistProfile(profile:Profile):boolean {memory=profile;try{localStorage.setItem(storageKey,JSON.stringify(profile));return true;}catch{return false;}}
const isRecord=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const isValue=(v:unknown):v is string|null=>v===null||typeof v==='string';
const bounded=(v:string|null)=>typeof v==='string'?v.slice(0,160):null;
export function readProfile():Profile|null {
 try {
  // Leave v1 storage untouched as a backup when writing the migrated profile.
  const raw=localStorage.getItem(storageKey)??localStorage.getItem(legacyStorageKey);
  if(!raw)return memory;
  const p:unknown=JSON.parse(raw);
  if(!isRecord(p)||(p.version!==1&&p.version!==2)||p.source!=='mock'||typeof p.analyzedAt!=='string'||typeof p.updatedAt!=='string'||!isRecord(p.original)||!isRecord(p.edits))return null;
  const result=newProfile();result.analyzedAt=p.analyzedAt;result.updatedAt=p.updatedAt;
  for(const f of fields){
   const v=p.original[f.key];
   // V1 accepted missing fields as unknown; preserve that compatibility.
   if(v===undefined&&p.version===1)result.original[f.key]=null;
   else if(isValue(v))result.original[f.key]=bounded(v);
   else return null;
   const e=p.edits[f.key];
   if(isValue(e))result.edits[f.key]=bounded(e);
  }
  if(p.version===1&&isValue(p.original.condition)){
   result.legacyCondition={original:bounded(p.original.condition)};
   if(isValue(p.edits.condition))result.legacyCondition.edit=bounded(p.edits.condition);
  }else if(p.version===2&&isRecord(p.legacyCondition)&&isValue(p.legacyCondition.original)){
   result.legacyCondition={original:bounded(p.legacyCondition.original)};
   if(isValue(p.legacyCondition.edit))result.legacyCondition.edit=bounded(p.legacyCondition.edit);
  }
  memory=result;return result;
 }catch{return memory;}
}
