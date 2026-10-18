import {composePersonalizedNote,type NoteInput} from './personalized-note.ts';
import {designers,salons,services,bookingServiceName,type Kind} from './catalog.ts';
import {isDesignerDayOff} from './arvo.ts';
export type Answers=Record<string,string[]>;
export type SaveNote={id:string;kind:Kind;reasons:string[];note:string;savedAt:string};
export type BookingDraft={id:string;designerId:string;serviceId:string;selectedServiceIds?:string[];date:string;time:string;note:string;noteEdited:boolean;noteInput?:NoteInput;shareNote?:boolean;estimatedPrice?:number;serviceName?:string};
export type Booking=BookingDraft&{createdAt:string;mode:'demo'};
// Preserve old single-service drafts while storing new multi-service selections.
export function selectedBookingServiceIds(draft:Pick<BookingDraft,'serviceId'|'selectedServiceIds'>):string[]{
 const source=Array.isArray(draft.selectedServiceIds)?draft.selectedServiceIds:(draft.serviceId?[draft.serviceId]:[]);
 return [...new Set(source)].filter(id=>services.some(service=>service.id===id));
}
export function selectedBookingServices(draft:Pick<BookingDraft,'serviceId'|'selectedServiceIds'>){
 return selectedBookingServiceIds(draft).map(id=>services.find(service=>service.id===id)!);
}
export function bookingServicesTotal(draft:Pick<BookingDraft,'serviceId'|'selectedServiceIds'>){
 return selectedBookingServices(draft).reduce((sum,service)=>sum+service.price,0);
}
export function bookingServicesLabel(draft:Pick<BookingDraft,'serviceId'|'selectedServiceIds'>){
 return selectedBookingServices(draft).map(bookingServiceName).join(' · ');
}
export function toggleChoice(values:string[],value:string,max:number){if(values.includes(value))return values.filter(v=>v!==value);if(max===1)return [value];return values.length<max?[...values,value]:values;}
export function recommend(answers:Answers,preferences:Answers){return designers.filter(designer=>!designer.discoveryOnly).map(designer=>{const reasons:string[]=[];let score=0;for(const mood of preferences.mood||[])if(designer.tags.includes(mood)){score+=3;reasons.push(`선호하는 ${mood} 분위기가 대표 스타일과 겹쳐요.`);}for(const strength of [...answers.strength||[],...answers.consult||[]])if(designer.strengths?.includes(strength)){score+=2;reasons.push(`${strength}을 원하는 응답과 디자이너의 상담 특징이 맞아요.`);}if(answers.location?.some(region=>region===designer.location||(region!=='전체'&&salons.find(salon=>salon.id===designer.salonId)?.location?.startsWith(region.replace(/특별자치시$|특별자치도$|특별시$|광역시$|도$/,''))))){score++;reasons.push(`${designer.location} 지역을 선택하셨어요.`);}if(answers.gender?.includes(designer.gender||''))score++;return {designer,score,reasons:reasons.length?reasons:['현재 샘플 디자이너의 포트폴리오를 먼저 제안해요. 상세페이지에서 취향을 비교해 보세요.']};}).sort((a,b)=>b.score-a.score);}
export function hairNote(profile:Record<string,string|null>|null,preferences:Answers,serviceId:string,input:NoteInput={}){
 const service=services.find(item=>item.id===serviceId);
 return composePersonalizedNote(profile,preferences,serviceId,input)+'\n\n희망 시술: '+(service?bookingServiceName(service):'상담 후 결정');
}

// Provide month navigation across the upcoming year rather than a rolling two-week window.
export function demoDates(now=new Date()){return Array.from({length:365},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i+1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;});}
export const demoTimes=Array.from({length:22},(_,index)=>`${String(10+Math.floor(index/2)).padStart(2,'0')}:${index%2?'30':'00'}`);
// Artificially closed dates end after November 15, 2026. Regular designer days off still apply.
// Date strings compare safely in YYYY-MM-DD format, independent of browser timezone.
export const BOOKING_FULL_DATE_THROUGH='2026-11-15';
export function isBookingDateFull(date:string){return /^\d{4}-\d{2}-\d{2}$/.test(date)&&date<=BOOKING_FULL_DATE_THROUGH&&Number(date.slice(-2))%9===0;}
const timeInMinutes=(time:string)=>Number(time.slice(0,2))*60+Number(time.slice(3));
export function availableBookingTimes(serviceIds:string|readonly string[],date:string,designerId:string,now=new Date()){
 const ids=typeof serviceIds==='string'?[serviceIds]:[...serviceIds];
 const chosen=[...new Set(ids)].map(id=>services.find(item=>item.id===id));
 if(!chosen.length||chosen.some(service=>!service||service.lastBooking===null)||!availableBookingDates(designerId,now).includes(date))return [];
 const selected=chosen.filter((service):service is NonNullable<typeof service>=>!!service);
 const latestStart=selected.map(service=>service.lastBooking!).sort()[0];
 // Do not invent bleach duration; combine only known service minutes.
 const unknownDuration=selected.some(service=>service.minutes===null);
 const knownMinutes=selected.reduce((sum,service)=>sum+(service.minutes??0),0);
 // Sample blocked slots exist only through November 15, 2026.
 // Later dates remain subject to opening hours, total duration and regular days off.
 const occupied=date>BOOKING_FULL_DATE_THROUGH?[]:Number(date.slice(-2))%2===0?['10:30','11:00','14:00','15:30']:['11:00','12:30','14:00','16:00'];
 // The latest one-hour service starts at 20:00, giving a 21:00 finish boundary.
 return demoTimes.filter(time=>{
  if(time>latestStart)return false;
  const start=timeInMinutes(time);
  // Unknown bleach duration: use known durations and the existing cutoff.
  if(unknownDuration&&knownMinutes===0)return !occupied.includes(time);
  const end=start+knownMinutes;
  if(end>21*60)return false;
  return !occupied.some(slot=>{const bookedStart=timeInMinutes(slot);return start<bookedStart+30&&end>bookedStart;});
 });
}

export function availableBookingDates(designerId:string,now=new Date()){return demoDates(now).filter(date=>!isDesignerDayOff(designerId,date)&&!isBookingDateFull(date));}
export function clearClosedBookingDate(draft:BookingDraft){return draft.date&&isDesignerDayOff(draft.designerId,draft.date)?{...draft,date:'',time:''}:draft;}
export function validBooking(d:BookingDraft){return designers.some(i=>i.id===d.designerId)&&availableBookingTimes(selectedBookingServiceIds(d),d.date,d.designerId).includes(d.time)&&(d.shareNote===false||d.note.trim().length>0);}
export function completeBooking(bookings:Booking[],draft:BookingDraft):Booking[]{
 if(bookings.some(b=>b.id===draft.id))return bookings;
 if(!validBooking(draft))throw new Error('시술, 날짜와 시간, HAIR NOTE를 확인해 주세요.');
 const selectedServiceIds=selectedBookingServiceIds(draft);
 return [{...draft,serviceId:selectedServiceIds[0],selectedServiceIds,estimatedPrice:bookingServicesTotal(draft),serviceName:bookingServicesLabel(draft),createdAt:new Date().toISOString(),mode:'demo'},...bookings];
}
