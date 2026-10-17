import {composePersonalizedNote,type NoteInput} from './personalized-note.ts';
import {designers,salons,services,bookingServiceName,type Kind} from './catalog.ts';
import {isDesignerDayOff} from './arvo.ts';
export type Answers=Record<string,string[]>;
export type SaveNote={id:string;kind:Kind;reasons:string[];note:string;savedAt:string};
export type BookingDraft={id:string;designerId:string;serviceId:string;date:string;time:string;note:string;noteEdited:boolean;noteInput?:NoteInput;shareNote?:boolean;estimatedPrice?:number;serviceName?:string};
export type Booking=BookingDraft&{createdAt:string;mode:'demo'};
export function toggleChoice(values:string[],value:string,max:number){if(values.includes(value))return values.filter(v=>v!==value);if(max===1)return [value];return values.length<max?[...values,value]:values;}
export function recommend(answers:Answers,preferences:Answers){return designers.filter(designer=>!designer.discoveryOnly).map(designer=>{const reasons:string[]=[];let score=0;for(const mood of preferences.mood||[])if(designer.tags.includes(mood)){score+=3;reasons.push(`선호하는 ${mood} 분위기가 대표 스타일과 겹쳐요.`);}for(const strength of [...answers.strength||[],...answers.consult||[]])if(designer.strengths?.includes(strength)){score+=2;reasons.push(`${strength}을 원하는 응답과 디자이너의 상담 특징이 맞아요.`);}if(answers.location?.some(region=>region===designer.location||(region!=='전체'&&salons.find(salon=>salon.id===designer.salonId)?.location?.startsWith(region.replace(/특별자치시$|특별자치도$|특별시$|광역시$|도$/,''))))){score++;reasons.push(`${designer.location} 지역을 선택하셨어요.`);}if(answers.gender?.includes(designer.gender||''))score++;return {designer,score,reasons:reasons.length?reasons:['현재 샘플 디자이너의 포트폴리오를 먼저 제안해요. 상세페이지에서 취향을 비교해 보세요.']};}).sort((a,b)=>b.score-a.score);}
export function hairNote(profile:Record<string,string|null>|null,preferences:Answers,serviceId:string,input:NoteInput={}){
 const service=services.find(item=>item.id===serviceId);
 return composePersonalizedNote(profile,preferences,serviceId,input)+'\n\n희망 시술: '+(service?bookingServiceName(service):'상담 후 결정');
}

export function demoDates(now=new Date()){return Array.from({length:14},(_,i)=>{const d=new Date(now);d.setDate(d.getDate()+i+1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;});}
export const demoTimes=Array.from({length:22},(_,index)=>`${String(10+Math.floor(index/2)).padStart(2,'0')}:${index%2?'30':'00'}`);
// Stable example occupancy, shared by the calendar, slot picker and submission.
export function isBookingDateFull(date:string){return /^\d{4}-\d{2}-\d{2}$/.test(date)&&Number(date.slice(-2))%9===0;}
const timeInMinutes=(time:string)=>Number(time.slice(0,2))*60+Number(time.slice(3));
export function availableBookingTimes(serviceId:string,date:string,designerId:string,now=new Date()){
 const service=services.find(item=>item.id===serviceId);
 if(!service||service.lastBooking===null||!availableBookingDates(designerId,now).includes(date))return [];
 const occupied=Number(date.slice(-2))%2===0?['10:30','11:00','14:00','15:30']:['11:00','12:30','14:00','16:00'];
 // The latest one-hour service starts at 20:00, giving a 21:00 finish boundary.
 return demoTimes.filter(time=>{
  if(time>service.lastBooking!)return false;
  const start=timeInMinutes(time);
  // Unknown bleach duration: only apply the confirmed cutoff and occupied starts.
  if(service.minutes===null)return !occupied.includes(time);
  const end=start+service.minutes;
  if(service.minutes!==null&&end>21*60)return false;
  return !occupied.some(slot=>{const bookedStart=timeInMinutes(slot);return start<bookedStart+30&&end>bookedStart;});
 });
}

export function availableBookingDates(designerId:string,now=new Date()){return demoDates(now).filter(date=>!isDesignerDayOff(designerId,date)&&!isBookingDateFull(date));}
export function clearClosedBookingDate(draft:BookingDraft){return draft.date&&isDesignerDayOff(draft.designerId,draft.date)?{...draft,date:'',time:''}:draft;}
export function validBooking(d:BookingDraft){return designers.some(i=>i.id===d.designerId)&&availableBookingTimes(d.serviceId,d.date,d.designerId).includes(d.time)&&(d.shareNote===false||d.note.trim().length>0);}
export function completeBooking(bookings:Booking[],draft:BookingDraft):Booking[]{
 if(bookings.some(b=>b.id===draft.id))return bookings;
 if(!validBooking(draft))throw new Error('시술, 날짜와 시간, HAIR NOTE를 확인해 주세요.');
 const service=services.find(item=>item.id===draft.serviceId)!;
 return [{...draft,estimatedPrice:service.price,serviceName:bookingServiceName(service),createdAt:new Date().toISOString(),mode:'demo'},...bookings];
}
