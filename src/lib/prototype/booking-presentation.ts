import {availableBookingTimes,selectedBookingServiceIds,type BookingDraft} from './logic.ts';
import {services,bookingServiceName} from './catalog.ts';

// Presentation only: the stored note remains the original, editable string.
const noteLabels=['MY HAIR','RECENT SERVICE','DESIRED STYLE','REQUEST','스타일 제안','나의 취향','YOUR WISH','더 전하고 싶은 이야기','직접 작성한 노트','현재 헤어','선호하는 분위기','평소 손질','헤어 고민','바꾸고 싶은 부분','희망 시술','시술 이력','디자이너에게 전하고 싶은 말'];
const emptyValues=['미입력','미선택','아직 입력하지 않았어요.'];
export function noteSections(note:string){
  return note.split(/\n\s*\n/).map(paragraph=>{
    const text=paragraph.trim();
    const label=noteLabels.find(label=>text.startsWith(label+':'));
    return {label:label||'',value:label?text.slice(label.length+1).trim():text};
  }).filter(section=>section.value&&(!section.label||!emptyValues.includes(section.value)));
}
export function selectBookingService(draft:BookingDraft,serviceId:string):BookingDraft{
 if(!services.some(service=>service.id===serviceId))return draft;
 const current=selectedBookingServiceIds(draft);
 const category=services.find(service=>service.id===serviceId)!.category;
 const categoryIndex=current.findIndex(id=>services.find(service=>service.id===id)?.category===category);
 const ids=current.includes(serviceId)
  ?current.filter(id=>id!==serviceId)
  :categoryIndex===-1?[...current,serviceId]:current.map((id,index)=>index===categoryIndex?serviceId:id);
 const selected=ids.map(id=>services.find(service=>service.id===id)!);
 const note=draft.noteEdited?draft.note.split(/\n\s*\n/).map(paragraph=>paragraph.startsWith('희망 시술:')?`희망 시술: ${selected.map(bookingServiceName).join(' · ')}`:paragraph).join('\n\n'):'';
 const time=draft.time&&availableBookingTimes(ids,draft.date,draft.designerId).includes(draft.time)?draft.time:'';
 return {...draft,serviceId:ids[0]||'',selectedServiceIds:ids,time,note};
}
export function selectBookingDate(draft:BookingDraft,date:string):BookingDraft{
  return draft.date===date?draft:{...draft,date,time:''};
}
export function calendarCells(month:string,weekStartsOn:0|1=0){
  const [year,index]=month.split('-').map(Number);
  const offset=(new Date(year,index-1,1).getDay()-weekStartsOn+7)%7;
  const count=new Date(year,index,0).getDate();
  return Array.from({length:Math.ceil((offset+count)/7)*7},(_,i)=>{
    const day=i-offset+1;
    return day>0&&day<=count?`${month}-${String(day).padStart(2,'0')}`:null;
  });
}
export function bookingDateLabel(date:string){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return '날짜를 선택해 주세요';
  const [year,month,day]=date.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일 (${'일월화수목금토'[new Date(year,month-1,day).getDay()]})`;
}

export function bookingVisitLabel(date:string,time:string){
 if(!date)return '날짜와 시간을 선택해 주세요.';
 const [,month,day]=date.split('-').map(Number);
 if(!time)return `${month}월 ${day}일 · 시간을 선택해 주세요.`;
 const [hour,minute]=time.split(':').map(Number);
 return `${month}월 ${day}일 · ${hour<12?'오전':'오후'} ${hour%12||12}:${String(minute).padStart(2,'0')}`;
}
export function updateNoteSection(draft:BookingDraft,labels:string[],label:string,value:string):BookingDraft{
 const paragraphs=draft.note.split(/\n\s*\n/);
 const index=paragraphs.findIndex(text=>labels.some(name=>text.trim().startsWith(name+':')));
 const replacement=`${label}: ${value.trim()}`;
 if(index>=0)paragraphs[index]=replacement;else paragraphs.push(replacement);
 return {...draft,note:paragraphs.filter(Boolean).join('\n\n'),noteEdited:true};
}
