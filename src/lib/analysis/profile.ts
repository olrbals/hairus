/** 최신 결과 920:5488 + 초안 905:15091 / 905:14575. 선택지가 없는 항목은 자유 입력. */
export const fields = [
 {key:'length',label:'기장',group:'Hair Details',initial:'슈퍼 롱 (허리선)',kind:'length'},
 {key:'bangs',label:'앞머리',group:'Hair Details',initial:'없음',kind:'text'},
 {key:'texture',label:'헤어 텍스처',group:'Hair Details',initial:'반곱슬',kind:'text'},
 {key:'cut',label:'커트 스타일',group:'Hair Details',initial:'레이어드',kind:'text'},
 {key:'color',label:'헤어 컬러',group:'Hair Details',initial:'흑갈색',kind:'text'},
 {key:'face',label:'얼굴형',group:'Other Features',initial:'계란형',kind:'face'},
 {key:'neck',label:'목 길이',group:'Other Features',initial:'짧은 편',kind:'text'},
 {key:'skin',label:'피부톤',group:'Other Features',initial:'뉴트럴',kind:'text'},
 {key:'layer',label:'레이어',group:'직접 알려주세요',initial:null,kind:'text'},
 {key:'dyeHistory',label:'염색 이력',group:'직접 알려주세요',initial:null,kind:'history'},
 {key:'permHistory',label:'펌 이력',group:'직접 알려주세요',initial:null,kind:'history'},
 {key:'cutHistory',label:'커트 이력',group:'직접 알려주세요',initial:null,kind:'history'},
 {key:'bleachHistory',label:'탈색 이력',group:'직접 알려주세요',initial:null,kind:'history'},
 {key:'condition',label:'관리 상태',group:'직접 알려주세요',initial:null,kind:'text'},
] as const;
export type FieldKey=typeof fields[number]['key'];
export type Values=Record<FieldKey,string|null>;
export interface Profile {version:1;source:'mock';original:Values;edits:Partial<Values>;analyzedAt:string;updatedAt:string}
export const lengths=['쇼트 (귀 주변)','단발 (턱선)','미디엄 (어깨 / 쇄골)','롱 (가슴선)','슈퍼 롱 (허리선)'];
export const faces=['계란형','둥근형','각진형','긴형','하트형','역삼각형'];
export function newProfile():Profile {const date=new Date().toISOString();return {version:1,source:'mock',original:Object.fromEntries(fields.map(f=>[f.key,f.initial])) as Values,edits:{},analyzedAt:date,updatedAt:date};}
export function effectiveProfile(profile:Profile):Values{return {...profile.original,...profile.edits};}
export function editProfile(profile:Profile,key:FieldKey,value:string|null):Profile{return {...profile,edits:{...profile.edits,[key]:value?.trim().slice(0,160)||null},updatedAt:new Date().toISOString()};}
const storageKey='hairus.profile.v1';
let memory:Profile|null=null;
export function persistProfile(profile:Profile):boolean {memory=profile;try{localStorage.setItem(storageKey,JSON.stringify(profile));return true;}catch{return false;}}
export function readProfile():Profile|null {
 try {const raw=localStorage.getItem(storageKey);if(!raw)return memory;const p=JSON.parse(raw);
 if(p.version!==1||p.source!=='mock'||typeof p.analyzedAt!=='string'||typeof p.updatedAt!=='string'||!p.original||!p.edits)return null;
 const result=newProfile();result.analyzedAt=p.analyzedAt;result.updatedAt=p.updatedAt;
 for(const f of fields){const v=p.original[f.key];if(v!==undefined&&v!==null&&typeof v!=='string')return null;result.original[f.key]=typeof v==='string'?v.slice(0,160):null;const e=p.edits[f.key];if(e===null||typeof e==='string')result.edits[f.key]=typeof e==='string'?e.slice(0,160):null;}
 memory=result;return result;
 }catch{return memory;}
}
