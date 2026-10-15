export type NoteInput={wishes?:Record<string,string>;memo?:string;preserved?:string};
type Profile=Record<string,string|null>|null;
const known=(value:string|null|undefined)=>value&&!/^(미입력|미선택|모름|알 수 없음)$/.test(value)?value:'';
export function wishQuestions(service:string){
 const bangs={key:'bangs',label:'앞머리',options:['유지','자르기','사이드뱅','고민 중']};
 const length={key:'length',label:'기장',options:['유지','변화','고민 중']};
 const perm={key:'perm',label:'펌',options:['자연스러운 컬','뿌리 볼륨 중시','확실한 컬','상담 후 결정']};
 return service==='cut'?[bangs,length]:service==='perm'?[perm,length]:[];
}
export function styleSuggestion(profile:Profile,service:string,wishes:Record<string,string>={}){
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
export function composePersonalizedNote(profile:Profile,preferences:Record<string,string[]>,service:string,input:NoteInput={}){
 const p=profile||{};const sections:string[]=[];
 const hair=['length','color','texture','cut','layer','bangs'].map(key=>known(p[key])).filter(Boolean);
 if(hair.length)sections.push('현재 헤어: '+hair.join(' · '));
 const history=[['cutHistory','커트'],['permHistory','펌'],['dyeHistory','염색'],['bleachHistory','탈색']].flatMap(([key,label])=>known(p[key])?[`${label}: ${p[key]}`]:[]);
 if(history.length)sections.push('시술 이력: '+history.join(' · '));
 sections.push('스타일 제안: '+styleSuggestion(profile,service,input.wishes));
 for(const [key,label] of [['mood','선호하는 분위기'],['care','평소 손질'],['concerns','헤어 고민']])if(preferences[key]?.length)sections.push(label+': '+preferences[key].join(' · '));
 const wishes=wishQuestions(service).flatMap(q=>q.options.includes(input.wishes?.[q.key]||'')?[`${q.label}: ${input.wishes![q.key]}`]:[]);
 if(wishes.length)sections.push('YOUR WISH: '+wishes.join(' · '));
 if(typeof input.memo==='string'&&input.memo.trim())sections.push('더 전하고 싶은 이야기: '+input.memo);
 if(typeof input.preserved==='string'&&input.preserved)sections.push('직접 작성한 노트:\n'+input.preserved);
 return sections.join('\n\n');
}
