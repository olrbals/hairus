import type {BookingDraft} from './logic.ts';

// Presentation only: the stored note remains the original, editable string.
const noteLabels=['현재 헤어','선호하는 분위기','평소 손질','헤어 고민','바꾸고 싶은 부분','희망 시술','시술 이력','디자이너에게 전하고 싶은 말'];
const emptyValues=['미입력','미선택','아직 입력하지 않았어요.'];
export function noteSections(note:string){
  return note.split(/\n\s*\n/).map(paragraph=>{
    const text=paragraph.trim();
    const label=noteLabels.find(label=>text.startsWith(label+':'));
    return {label:label||'',value:label?text.slice(label.length+1).trim():text};
  }).filter(section=>section.value&&(!section.label||!emptyValues.includes(section.value)));
}
export function selectBookingService(draft:BookingDraft,serviceId:string):BookingDraft{
  if(draft.serviceId===serviceId)return draft;
  return {...draft,serviceId,...(!draft.noteEdited?{note:''}:{})};
}
export function selectBookingDate(draft:BookingDraft,date:string):BookingDraft{
  return draft.date===date?draft:{...draft,date,time:''};
}
export function calendarCells(month:string){
  const [year,index]=month.split('-').map(Number);
  const offset=new Date(year,index-1,1).getDay();
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
