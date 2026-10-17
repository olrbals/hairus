'use client';

import Link from 'next/link';
import {useEffect,useState,useRef,type ReactNode} from 'react';
import {useRouter} from 'next/navigation';
import {Button,HeaderBackIcon} from '@/components/primitives';
import {designers,services,salons,serviceCategories,bookingServiceName,type ServiceCategory} from '@/lib/prototype/catalog';
import {hairNote,demoDates,availableBookingDates,clearClosedBookingDate,demoTimes,availableBookingTimes,isBookingDateFull,validBooking,completeBooking,type BookingDraft} from '@/lib/prototype/logic';
import {findArvoDesigner,offDaysLabel} from '@/lib/prototype/arvo';
import {bookingDateLabel,bookingVisitLabel,calendarCells,noteSections,selectBookingDate,selectBookingService} from '@/lib/prototype/booking-presentation';
import {readProfile,effectiveProfile} from '@/lib/analysis/profile';
import {usePrototype} from './store';
import styles from './booking.module.css';
import {HairNoteEditorial} from './hair-note-editorial';
import {SaveButton} from './shared';

const steps=['service','schedule','note','review'];
const labels=['시술','방문일','헤어노트','예약 확인'];
const stickyHeight=64+86+52;

function Check(){return <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function Arrow({right=false}:{right?:boolean}){return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" style={right?{transform:'rotate(180deg)'}:undefined}><path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function BookingPage({back,children,title='예약하기',historyBack=false,actions}:{back:string;children:ReactNode;title?:string;historyBack?:boolean;actions?:ReactNode}){
 const router=useRouter();
  return <main id="main" className={styles.page}>
    <header className={`${styles.header} hairus-page-header`}><Link className="hairus-header-back" href={back} aria-label="뒤로 가기" onClick={event=>{if(historyBack&&window.history.length>1){event.preventDefault();router.back();}}}><HeaderBackIcon/></Link><span>{title}</span>{actions?<div className={styles.headerActions}>{actions}</div>:<span aria-hidden="true"/>}</header>
    {children}
  </main>;
}
function DesignerIdentity({id}:{id:string}){
  const designer=designers.find(person=>person.id===id);
  if(!designer)return null;
  return <div className={styles.designer}><img src={designer.image} alt="" width="64" height="86"/><div><strong>{designer.name} 디자이너</strong><span>{salons.find(salon=>salon.id===designer.salonId)?.name||(findArvoDesigner(id)?'아르보 성수':'')} · {designer.location}</span></div></div>;
}
function NoteContent({note}:{note:string}){
  const sections=noteSections(note);
  return <dl className={styles.noteFields}>{sections.map((section,index)=><div key={index}>{section.label&&<dt>{section.label}</dt>}<dd>{section.value}</dd></div>)}</dl>;
}
function NotePreview({draft,editHref}:{draft:BookingDraft;editHref?:string}){
  if(draft.shareNote===false)return <section className={styles.noteCard} aria-label="HAIR NOTE 전달 여부"><h2 className={styles.editorial}>HAIR NOTE</h2><p>디자이너에게 전달하지 않아요.</p></section>;
  const preview=noteSections(draft.note).map(section=>section.label?`${section.label}: ${section.value}`:section.value).join('\n');
  return <section className={styles.noteCard} aria-label="상담 노트 미리보기">
    <div className={styles.cardHeading}><h2 className={styles.editorial}>HAIR NOTE</h2>{editHref&&<Link className={styles.edit} href={editHref} aria-label="노트 수정">수정</Link>}</div>
    <p className={styles.preview}>{preview||'상담 노트를 작성해 주세요.'}</p>
    {draft.note&&<details className={styles.noteDetails}><summary>노트 전체 보기</summary><NoteContent note={draft.note}/></details>}
  </section>;
}
// Verified Figma calendar 1110:2681, sticky profile/nav 1119:3148,
// and MY RESERVATION 1113:2856. CTA follows the shared component by user request.
// https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T?node-id=1110-2658
function BookingCalendar({dates,windowDates,value,onSelect}:{dates:string[];windowDates:string[];value:string;onSelect:(date:string)=>void}){
 const months=[...new Set(windowDates.map(date=>date.slice(0,7)))];
 const initial=windowDates.includes(value)?value.slice(0,7):windowDates[0]?.slice(0,7);
 const [view,setView]=useState(initial||'');
 const month=months.includes(view)?view:initial||months[0];
 if(!month)return null;
 const position=months.indexOf(month);
 const [year,monthNumber]=month.split('-').map(Number);
 return <section className={styles.calendar} aria-label="예약 날짜 선택">
  <div className={styles.monthHeading}><h3 aria-live="polite">{year}년 {monthNumber}월</h3><div><button type="button" aria-label="이전 달" disabled={position<=0} onClick={()=>setView(months[position-1])}><Arrow/></button><button type="button" aria-label="다음 달" disabled={position>=months.length-1} onClick={()=>setView(months[position+1])}><Arrow right/></button></div></div>
  <div className={styles.weekdays} aria-hidden="true">{['월','화','수','목','금','토','일'].map(day=><span key={day}>{day}</span>)}</div>
  <div className={styles.days}>{calendarCells(month,1).map((date,index)=>{
   if(!date)return <span key={`empty-${index}`}/>;
   const full=windowDates.includes(date)&&isBookingDateFull(date);
   return <button type="button" key={date} disabled={!dates.includes(date)} aria-label={`${bookingDateLabel(date)}${full?' 예약 마감':!dates.includes(date)?' 선택 불가':''}`} aria-pressed={value===date} data-full={full} onClick={()=>onSelect(date)}><span>{Number(date.slice(-2))}</span>{full&&<small>마감</small>}</button>;
  })}</div>
 </section>;
}
function SectionTitle({title,description}:{title:string;description:string}){return <div className={styles.sectionTitle}><h2>{title}</h2><p>{description}</p></div>;}

export function BookingFlow({designerId,step,initialService}:{designerId:string;step:string;initialService?:string;returnToReview?:boolean}){
 const {state,update,ready}=usePrototype();
 const router=useRouter();
 const initialized=useRef('');
 const entered=useRef('');
 const submitted=useRef(false);
 const [submitting,setSubmitting]=useState(false);
 const [error,setError]=useState('');
 const [profileRevision,setProfileRevision]=useState(0);
 const [dates,setDates]=useState<string[]>([]);
 const [windowDates,setWindowDates]=useState<string[]>([]);
 const [category,setCategory]=useState<ServiceCategory>('컷');
 const [activeSection,setActiveSection]=useState('service');
 const designer=designers.find(person=>person.id===designerId);
 const draft=state.draft?.designerId===designerId?state.draft:null;
 const prefix=`/reservation/${designerId}`;
 useEffect(()=>{
  const refresh=()=>{setDates(availableBookingDates(designerId));setWindowDates(demoDates());setProfileRevision(value=>value+1);};
  refresh();
  window.addEventListener('focus',refresh);
  window.addEventListener('storage',refresh);
  const timer=window.setInterval(refresh,60000);
  return()=>{window.removeEventListener('focus',refresh);window.removeEventListener('storage',refresh);window.clearInterval(timer);};
 },[designerId]);
 useEffect(()=>{
  if(!ready||!designer||initialized.current===designerId)return;
  initialized.current=designerId;
  const entry=services.find(service=>service.id===initialService);
  const current=state.draft?.designerId===designerId?state.draft:null;
  setCategory(services.find(service=>service.id===(entry?.id||current?.serviceId))?.category||'컷');
  update(current=>{
   if(current.draft?.designerId===designerId&&!current.bookings.some(booking=>booking.id===current.draft?.id))return entry?{...current,draft:selectBookingService(current.draft,entry.id)}:current;
   return {...current,draft:{id:crypto.randomUUID(),designerId,serviceId:entry?.id||'',date:'',time:'',note:'',noteEdited:false,shareNote:true}};
  });
 },[ready,designer,designerId,initialService,update,state.draft]);
 useEffect(()=>{
  if(!ready||!draft||!windowDates.length)return;
  const closed=clearClosedBookingDate(draft);
  const dateInvalid=!!draft.date&&!dates.includes(draft.date);
  const timeInvalid=!!draft.time&&!availableBookingTimes(draft.serviceId,draft.date,designerId).includes(draft.time);
  if(closed===draft&&!dateInvalid&&!timeInvalid)return;
  update(current=>({...current,draft:current.draft?.designerId===designerId?{...current.draft,...(closed!==draft||dateInvalid?{date:'',time:''}:{time:''})}:current.draft}));
  setError(dateInvalid?'선택한 날짜에 예약할 수 없어요. 다른 날짜를 선택해 주세요.':'선택한 시술로 예약 가능한 시간을 다시 선택해 주세요.');
 },[ready,draft,designerId,dates,windowDates,update]);
 useEffect(()=>{
  if(ready&&draft&&initialService&&services.some(service=>service.id===initialService))router.replace(`${prefix}/${step}`,{scroll:false});
 },[ready,draft,initialService,router,prefix,step]);
 useEffect(()=>{
  if(!ready||!draft||!draft.serviceId||draft.noteEdited)return;
  const profile=readProfile();
  const note=hairNote(profile?effectiveProfile(profile):null,state.preferences,draft.serviceId,draft.noteInput);
  if(note!==draft.note)update(current=>({...current,draft:current.draft?.designerId===designerId?{...current.draft,note}:current.draft}));
 },[ready,draft,state.preferences,designerId,update,profileRevision]);
 const draftId=draft?.id;
 useEffect(()=>{
  if(!ready||!draftId||entered.current===draftId)return;
  // Legacy step URLs are entry points into the same screen, never separate pages.
  const entry=steps.includes(step)?step:'service';
  const frame=requestAnimationFrame(()=>{entered.current=draftId;if(entry!=='service')document.getElementById(`booking-${entry}`)?.scrollIntoView({block:'start'});});
  return()=>cancelAnimationFrame(frame);
 },[ready,draftId,step]);
 useEffect(()=>{
  if(!ready||!draftId)return;
  let frame=0;
  const spy=()=>{
   let current='service';
   for(const id of steps)if((document.getElementById(`booking-${id}`)?.getBoundingClientRect().top??Infinity)<=stickyHeight+24)current=id;
   if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-2)current='review';
   setActiveSection(previous=>previous===current?previous:current);
  };
  const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(spy);};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);spy();
  const observer=new ResizeObserver(schedule);const content=document.getElementById('booking-content');if(content)observer.observe(content);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);observer.disconnect();};
 },[ready,draftId]);
 function patchDraft(change:(value:BookingDraft)=>BookingDraft){setError('');update(current=>({...current,draft:current.draft?.designerId===designerId?change(current.draft):current.draft}));}
 function goTo(target:string,focus=false){const section=document.getElementById(`booking-${target}`);section?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});if(focus)section?.focus({preventScroll:true});}
 function reserve(){
  if(!draft||submitted.current)return;
  const target=!services.some(service=>service.id===draft.serviceId)?'service':!availableBookingTimes(draft.serviceId,draft.date,designerId).includes(draft.time)?'schedule':draft.shareNote!==false&&!draft.note.trim()?'note':null;
  if(target){setError(target==='service'?'시술을 선택해 주세요.':target==='schedule'?'방문할 날짜와 시간을 선택해 주세요.':'전달할 HAIR NOTE를 작성해 주세요.');goTo(target,true);return;}
  if(!validBooking(draft))return;
  try{submitted.current=true;setSubmitting(true);update(current=>({...current,bookings:completeBooking(current.bookings,draft)}));router.replace(`/reservations/${draft.id}`);}catch(error){submitted.current=false;setSubmitting(false);setError((error as Error).message);}
 }
 if(!designer)return <BookingPage back="/explore?category=designer"><div className={styles.content}><h1>디자이너를 찾을 수 없어요.</h1><Link className="primary-cta" href="/explore?category=designer">디자이너 선택하기</Link></div></BookingPage>;
 if(!ready||!draft)return <BookingPage back={`/designers/${designerId}`}><p className={styles.content} role="status">예약 내용을 불러오는 중이에요.</p></BookingPage>;
 const service=services.find(service=>service.id===draft.serviceId);
 const times=availableBookingTimes(draft.serviceId,draft.date,designerId);
 const person=findArvoDesigner(designerId);
 return <BookingPage back={`/designers/${designerId}`} actions={<SaveButton item={designer}/>}>
  <DesignerIdentity id={designerId}/>
  <nav className={styles.sectionNav} aria-label="예약 섹션">{steps.map((id,index)=><a key={id} href={`#booking-${id}`} aria-current={activeSection===id?'location':undefined} onClick={event=>{event.preventDefault();goTo(id);}}>{labels[index]}</a>)}</nav>
  <div className={`${styles.content} ${styles.onePageContent}`} id="booking-content">
   <section id="booking-service" className={styles.reservationSection} tabIndex={-1} aria-label="시술 선택">
    <SectionTitle title="SERVICE" description="방문하여 받을 시술을 선택해 주세요."/>
    <div className={styles.categories} role="group" aria-label="시술 카테고리">{serviceCategories.map(value=><button type="button" key={value} aria-pressed={category===value} onClick={()=>setCategory(value)}>{value}</button>)}</div>
    <div className={styles.services} role="group" aria-label={`${category} 시술 선택`}>{services.filter(item=>item.category===category).map(item=><button type="button" className={styles.service} key={item.id} aria-pressed={draft.serviceId===item.id} onClick={()=>{
     const next=selectBookingService(draft,item.id);patchDraft(current=>selectBookingService(current,item.id));if(draft.time&&!next.time)setError('시술이 변경되어 기존 시간 선택을 해제했어요. 예약 가능한 시간을 다시 선택해 주세요.');
    }}><span className={styles.serviceInfo}><span className={styles.serviceHeading}><strong>{item.name}</strong><span>{item.price.toLocaleString('ko-KR')}원</span></span><span className={styles.serviceDescription}>{item.description}</span><small>{item.minutes?`약 ${item.minutes}분`:'소요 시간 상담 후 안내'} · 마지막 예약 {item.lastBooking}</small></span><span className={styles.selection} aria-hidden="true">{draft.serviceId===item.id&&<Check/>}</span></button>)}</div>
    <p className={styles.serviceSelected} aria-live="polite">{service?`${bookingServiceName(service)} · ${service.price.toLocaleString('ko-KR')}원`:'한 가지 시술을 선택해 주세요.'}</p>
   </section>
   <section id="booking-schedule" className={styles.reservationSection} tabIndex={-1} aria-label="방문 날짜와 시간">
    <SectionTitle title="DATE" description="방문할 날짜와 시간을 선택해 주세요."/>
    <div className={styles.schedule}>
     <BookingCalendar dates={dates} windowDates={windowDates} value={draft.date} onSelect={date=>patchDraft(current=>selectBookingDate(current,date))}/>
     <p className={styles.hint}>{person?`정기 휴무 ${offDaysLabel(person).replace(' OFF','')}`:'선택 가능한 날짜를 확인해 주세요.'}</p>
     <div className={styles.timeSection}><h3 className={styles.visuallyHidden}>시간 선택</h3><p className={styles.dateCaption}>{!service?'시술과 날짜를 먼저 선택해 주세요.':!draft.date?'날짜를 먼저 선택해 주세요.':`${service.minutes?`약 ${service.minutes}분 소요 · `:''}마지막 예약 ${service.lastBooking}`}</p><div className={styles.times} role="group" aria-label="예약 시간 선택">{demoTimes.map(time=><button type="button" key={time} disabled={!times.includes(time)} aria-pressed={draft.time===time} onClick={()=>patchDraft(current=>({...current,time}))}>{time}</button>)}</div></div>
     <div className={styles.visitPreview} aria-live="polite"><span>방문 예정일</span><strong>{bookingVisitLabel(draft.date,draft.time)}</strong></div>
    </div>
   </section>
   <section id="booking-note" className={styles.reservationSection} tabIndex={-1} aria-label="헤어노트">
    <SectionTitle title="HAIR NOTE" description="디자이너에게 전달할 사항을 확인해 주세요."/>
    <HairNoteEditorial draft={draft} profileRevision={profileRevision} onChange={patchDraft}/>
   </section>
   <section id="booking-review" className={styles.reservationSection} tabIndex={-1} aria-label="최종 예약 확인">
    <SectionTitle title="MY RESERVATION" description="예약을 최종적으로 확인해 주세요."/>
    <dl className={styles.reservationSummary} aria-live="polite"><div><dt>VISIT</dt><dd>{bookingVisitLabel(draft.date,draft.time)}</dd></div><div><dt>SERVICE</dt><dd>{service?bookingServiceName(service):'시술을 선택해 주세요.'}</dd></div><div><dt>HAIR NOTE</dt><dd>{draft.shareNote===false?'전달하지 않음':draft.note.trim()?'작성 완료 · 디자이너에게 전달':'작성 전'}</dd></div><div><dt>ESTIMATED PRICE</dt><dd>{service?`${service.price.toLocaleString('ko-KR')}원`:'—'}<small>가격은 HAIRUS의 예상 가격으로, 현장에서 상담 후 달라질 수 있습니다.</small></dd></div></dl>
   </section>
  </div>
  <footer className={styles.footer}>{error&&<p role="status" className={styles.message}>{error}</p>}<Button disabled={submitting} onClick={reserve}>{submitting?'예약 중…':'예약하기'}</Button></footer>
 </BookingPage>;
}

export function BookingSummary({draft,editPrefix}:{draft:BookingDraft;editPrefix?:string}){
  const designer=designers.find(person=>person.id===draft.designerId);
  const service=services.find(service=>service.id===draft.serviceId);
  const salon=salons.find(salon=>salon.id===designer?.salonId)?.name||(findArvoDesigner(draft.designerId)?'아르보 성수':'');
  return <section className={styles.summary} aria-label="예약 요약">
    <div className={styles.summaryIdentity}><span className={styles.eyebrow}>YOUR APPOINTMENT</span><h2>{designer?.name} 디자이너</h2>{salon&&<p>{salon}</p>}</div>
    <dl>
      <div><dt>시술</dt><dd><strong>{draft.serviceName||(service?bookingServiceName(service):'시술 선택 전')}</strong>{editPrefix&&<Link className={styles.edit} href={`${editPrefix}/service?return=review`} aria-label="시술 수정">수정</Link>}</dd></div>
      <div><dt>일정</dt><dd><span>{bookingDateLabel(draft.date)}<strong className={styles.summaryTime}>{draft.time}</strong></span>{editPrefix&&<Link className={styles.edit} href={`${editPrefix}/schedule?return=review`} aria-label="일정 수정">수정</Link>}</dd></div>
      <div className={styles.total}><dt>예상 금액</dt><dd><strong>{typeof draft.estimatedPrice==='number'?`${draft.estimatedPrice.toLocaleString('ko-KR')}원`:service?`${service.price.toLocaleString('ko-KR')}원`:'—'}</strong></dd></div>
      <div><dt>HAIR NOTE</dt><dd>{draft.shareNote===false?'전달하지 않음':'디자이너에게 전달'}</dd></div>
      <div className={styles.payment}><dt>결제 상태</dt><dd>결제 진행 전</dd></div>
    </dl>
  </section>;
}
export function BookingComplete({id}:{id:string}){
  const {state,ready}=usePrototype();
  const booking=state.bookings.find(booking=>booking.id===id);
  return <BookingPage title="예약 완료" back="/my/reservations"><div className={`${styles.content} ${styles.complete}`}>
    {!ready?<p role="status">예약 정보를 불러오는 중이에요.</p>:booking?<>
      <div className={styles.success}><span className={styles.successIcon}><Check/></span><h1>예약 정보를 저장했어요.</h1><p>선택한 일정과 상담 노트를 예약 내역에서 확인할 수 있어요.</p></div>
      <BookingSummary draft={booking}/>
      <div className={styles.visitGuide}><h2>방문 전 확인해 주세요</h2><p>시술 금액과 결제는 방문 상담 후 안내받으세요.</p></div>
      <NotePreview draft={booking}/>
      <div className={styles.completeActions}><Link className={`${styles.primary} primary-cta`} href="/my/reservations">MY 예약 내역 보기</Link><Link className={styles.homeLink} href="/home">홈으로 돌아가기</Link></div>
    </>:<><h1>저장된 예약을 찾을 수 없어요.</h1><Link className={`${styles.primary} primary-cta`} href="/my/reservations">MY 예약 내역 보기</Link></>}
  </div></BookingPage>;
}

export function BookingAppointments(){
 const {state,ready}=usePrototype();
 return <BookingPage back="/my" title="" historyBack><div className={`${styles.content} ${styles.appointments}`}>
 <h1 className={styles.appointmentsTitle}>My Appointments</h1>
 {!ready?<p role="status">불러오는 중이에요.</p>:state.bookings.length?state.bookings.map(booking=>{
 const designer=designers.find(person=>person.id===booking.designerId);const service=services.find(service=>service.id===booking.serviceId);const salon=salons.find(salon=>salon.id===designer?.salonId)?.name||'';
 return <article className={styles.appointment} key={booking.id}><p className={styles.savedStatus}>저장 완료</p><p className={styles.appointmentDate}>{bookingDateLabel(booking.date)} · {booking.time}</p><h2>{designer?.name} 디자이너</h2><p className={styles.appointmentSalon}>{salon}</p><div className={styles.appointmentService}><span>{booking.serviceName||(service?bookingServiceName(service):'시술')}</span><span>{(booking.estimatedPrice??service?.price)?.toLocaleString('ko-KR')}원</span></div><Link className={`${styles.primary} primary-cta`} href={`/reservations/${booking.id}`}>상담 노트 및 상세 보기</Link></article>;
 }):<><p>아직 저장한 예약이 없어요.</p><Link className={`${styles.primary} primary-cta`} href="/explore?category=designer">디자이너 찾아보기</Link></>}
 </div></BookingPage>;
}
