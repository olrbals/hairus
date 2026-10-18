import {services} from './catalog.ts';
export type NoteInput={wishes?:Record<string,string>;memo?:string;preserved?:string;bookingProfile?:Partial<Record<import('../analysis/profile.ts').FieldKey,string|null>>};
type Profile=Record<string,string|null>|null;
const known=(value:string|null|undefined)=>value&&!/^(미입력|미선택|모름|알 수 없음)$/.test(value)?value:'';
const serviceKind=(id:string)=>{const category=services.find(service=>service.id===id)?.category;return category==='컷'?'cut':category==='열펌'?'perm':category==='염색'?'color':id;};
export function wishQuestions(service:string){
 service=serviceKind(service);
 const bangs={key:'bangs',label:'앞머리',options:['유지','자르기','사이드뱅','고민 중']};
 const length={key:'length',label:'기장',options:['유지','변화','고민 중']};
 const perm={key:'perm',label:'펌',options:['자연스러운 컬','뿌리 볼륨 중시','확실한 컬','상담 후 결정']};
 return service==='cut'?[bangs,length]:service==='perm'?[perm,length]:[];
}
export function styleSuggestion(profile:Profile,service:string,wishes:Record<string,string>={}){
 service=serviceKind(service);
 const p=profile||{};const long=/롱|긴/.test(p.length||'');const short=/쇼트|단발/.test(p.length||'');
 const layered=/레이어|높|많/.test((p.cut||'')+' '+(p.layer||''));
 if(service==='cut'){
  const base=long?'긴 기장을 살리면서':short?'현재의 짧은 기장에 맞춰':'원하는 기장을 상담하며';
  const direction=/둥근|각진/.test(p.face||'')?'얼굴 주변에 부드러운 세로 흐름을 주는 커트':/긴형/.test(p.face||'')?'옆선의 볼륨을 살리는 커트':layered?'얼굴 주변 레이어에 변화를 주는 커트':/짧/.test(p.neck||'')?'목선 주변을 가볍게 정리하는 커트':'끝선과 얼굴 주변의 균형을 맞추는 커트';
  const bangs=wishes.bangs==='유지'?'앞머리는 현재 형태를 유지하는 방향으로 상담해 보세요.':wishes.bangs==='사이드뱅'?'앞머리는 옆으로 자연스럽게 이어지는 사이드뱅을 고려해 볼 수 있어요.':p.bangs==='없음'?'앞머리 변화를 원한다면 사이드뱅이나 시스루뱅도 고려해 볼 수 있어요.':/곱슬/.test(p.texture||'')?'앞머리는 모발의 흐름과 손질 방법을 함께 확인해 주세요.':'앞머리의 길이와 방향은 평소 손질에 맞춰 상담해 보세요.';
  return `${wishes.length==='변화'?'원하는 길이 변화의 폭을 상담하며':base} ${direction}를 제안해요. ${bangs}`;
 }
 if(service==='perm'){
  const curl=wishes.perm==='뿌리 볼륨 중시'?'뿌리 볼륨을 중심으로':wishes.perm==='확실한 컬'?'또렷한 컬을 중심으로':/곱슬/.test(p.texture||'')?'기존 모발 흐름을 고려한 자연스러운 컬을 중심으로':'자연스러운 컬과 볼륨을 중심으로';
  const shape=long&&layered?'긴 레이어의 움직임을 살리는':short?'짧은 기장의 끝선에 맞는':'현재 기장과 레이어에 맞는';
  const history=['permHistory','dyeHistory','bleachHistory'].some(key=>known(p[key])&&!/없음|안 함/.test(p[key]||''));
  return `${curl} ${shape} 펌을 고려해 볼 수 있어요. ${history?'기록한 시술 이력을 바탕으로 모발 상태와 컬의 강도를 디자이너와 먼저 확인해 주세요.':'컬의 강도와 손질 방법은 디자이너와 상담해 결정해 보세요.'}`;
 }
 if(service==='color'){
  if(!known(p.color)&&!known(p.skin))return '원하는 밝기와 분위기에 맞는 컬러를 디자이너와 상담해 결정해 보세요.';
  const tone=/쿨/.test(p.skin||'')?'애쉬 브라운이나 쿨한 흑갈색':/웜/.test(p.skin||'')?'따뜻한 브라운이나 베이지 브라운':'뉴트럴 브라운';
  const base=known(p.color)?`현재 ${p.color}의 분위기를 참고해 `:'';
  return `${base}${tone} 계열을 고려해 볼 수 있어요. ${known(p.dyeHistory)||known(p.bleachHistory)?'기록한 염색·탈색 이력과 원하는 밝기를 함께 상담해 주세요.':'원하는 밝기와 분위기는 실제 컬러를 비교하며 상담해 주세요.'}`;
 }
 return '원하는 스타일과 평소 손질 방법을 디자이너와 상담해 결정해 보세요.';
}
/** Draft an appointment request in the customer's voice, not advice addressed to them. */
export function effectiveStyleWishes(profile:Profile,service:string,wishes:Record<string,string>={}):Record<string,string>{
 const type=serviceKind(service);const next={...wishes};
 if(type==='cut'){next.length ||= '유지';next.bangs ||= '유지';}
 if(type==='perm'){next.length ||= '유지';next.perm ||= '자연스러운 컬';}
 return next;
}
export function styleRequest(profile:Profile,service:string,wishes:Record<string,string>={}){
 const p=profile||{};const choice=effectiveStyleWishes(profile,service,wishes);
 const category=services.find(item=>item.id===service)?.category;
 const length=known(p.length);const texture=known(p.texture);const color=known(p.color);
 const intro=length?`현재 ${length} 스타일인데, `:'';
 if(category==='컷'){
  const change=choice.length==='변화'?'기장에도 변화를 주면서':'지금 기장을 최대한 살리면서';
  const bangs=choice.bangs==='자르기'?'앞머리도 새롭게 잘라 주세요.':choice.bangs==='사이드뱅'?'앞머리는 자연스러운 사이드뱅으로 연결하고 싶어요.':choice.bangs==='고민 중'?'앞머리 방향은 상담 후 결정하고 싶어요.':'앞머리는 현재 느낌을 유지하고 싶어요.';
  return `${intro}${change} 얼굴 주변이 자연스럽게 정돈되는 커트를 받고 싶어요. ${bangs}`;
 }
 if(category==='열펌'){
  const curl=choice.perm==='뿌리 볼륨 중시'?'뿌리 볼륨이 잘 살아나도록':choice.perm==='확실한 컬'?'컬이 분명하게 보이도록':choice.perm==='상담 후 결정'?'제 모발 상태에 맞는 컬을 상담하면서':'자연스럽게 흐르는 컬이 나오도록';
  return `${intro}${curl} 펌을 하고 싶어요. ${texture?`제 모발은 ${texture}인 편이라 `:''}평소 손질도 어렵지 않게 부탁드려요.`;
 }
 if(category==='염색'||category==='탈색'){
  return `${color?`현재 헤어 컬러는 ${color}이고, `:''}원하는 밝기와 분위기에 맞춰 ${category==='탈색'?'탈색':'염색'}하고 싶어요. 시술 이력과 모발 상태를 함께 확인해 주시면 좋겠어요.`;
 }
 if(category==='클리닉')return `${intro}제 머릿결과 두피 상태를 확인한 뒤 필요한 케어를 받고 싶어요. 집에서 관리하기도 편했으면 좋겠어요.`;
 return `${intro}현재 모발 상태와 원하는 분위기를 함께 상담하고 싶어요. 손질이 편한 방향으로 부탁드려요.`;
}
export function composePersonalizedNote(profile:Profile,preferences:Record<string,string[]>,service:string,input:NoteInput={}){
 const p=profile||{};const sections:string[]=[];
 const hair=['length','color','texture','cut','layer','bangs'].map(key=>known(p[key])).filter(Boolean);
 if(hair.length)sections.push('현재 헤어: '+hair.join(' · '));
 const history=[['cutHistory','커트'],['permHistory','펌'],['dyeHistory','염색'],['bleachHistory','탈색']].flatMap(([key,label])=>known(p[key])?[`${label}: ${p[key]}`]:[]);
 if(history.length)sections.push('시술 이력: '+history.join(' · '));
 sections.push('DESIRED STYLE: '+styleRequest(profile,service,input.wishes));
 for(const [key,label] of [['mood','선호하는 분위기'],['care','평소 손질'],['concerns','헤어 고민']])if(preferences[key]?.length)sections.push(label+': '+preferences[key].join(' · '));
 const wishes=wishQuestions(service).flatMap(q=>q.options.includes(input.wishes?.[q.key]||'')?[`${q.label}: ${input.wishes![q.key]}`]:[]);
 if(wishes.length)sections.push('YOUR WISH: '+wishes.join(' · '));
 if(typeof input.memo==='string'&&input.memo.trim())sections.push('더 전하고 싶은 이야기: '+input.memo);
 if(typeof input.preserved==='string'&&input.preserved)sections.push('직접 작성한 노트:\n'+input.preserved);
 return sections.join('\n\n');
}
