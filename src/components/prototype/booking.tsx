'use client';

import Link from 'next/link';
import {useEffect,useState,useRef,type ReactNode} from 'react';
import {useRouter} from 'next/navigation';
import {HeaderBackIcon} from '@/components/primitives';
import {designers,services,salons} from '@/lib/prototype/catalog';
import {hairNote,demoDates,availableBookingDates,clearClosedBookingDate,demoTimes,validBooking,completeBooking,type BookingDraft} from '@/lib/prototype/logic';
import {findArvoDesigner,offDaysLabel} from '@/lib/prototype/arvo';
import {bookingDateLabel,calendarCells,noteSections,selectBookingDate,selectBookingService} from '@/lib/prototype/booking-presentation';
import {readProfile,effectiveProfile} from '@/lib/analysis/profile';
import {usePrototype} from './store';
import styles from './booking.module.css';
import {HairNoteEditorial} from './hair-note-editorial';

const steps=['service','schedule','note','review'];
const labels=['시술 선택','날짜 및 시간','HAIR NOTE','예약 확인'];
const titles=['어떤 시술을 원하시나요?','언제 방문하고 싶으세요?','디자이너에게 전할 이야기','예약 내용을 확인해 주세요'];

function Check(){return <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function Arrow({right=false}:{right?:boolean}){return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" style={right?{transform:'rotate(180deg)'}:undefined}><path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function BookingPage({back,children,title='예약하기',historyBack=false}:{back:string;children:ReactNode;title?:string;historyBack?:boolean}){
 const router=useRouter();
  return <main id="main" className={styles.page}>
    <header className={`${styles.header} hairus-page-header`}><Link className="hairus-header-back" href={back} aria-label="뒤로 가기" onClick={event=>{if(historyBack&&window.history.length>1){event.preventDefault();router.back();}}}><HeaderBackIcon/></Link><span>{title}</span><span aria-hidden="true"/></header>
    {children}
  </main>;
}
function DesignerIdentity({id}:{id:string}){
  const designer=designers.find(person=>person.id===id);
  if(!designer)return null;
  return <div className={styles.designer}><img src={designer.image} alt="" width="44" height="48"/><div><strong>{designer.name} 디자이너</strong><span>{salons.find(salon=>salon.id===designer.salonId)?.name||(findArvoDesigner(id)?'아르보 성수':'')}</span></div></div>;
}
function NoteContent({note}:{note:string}){
  const sections=noteSections(note);
  return <dl className={styles.noteFields}>{sections.map((section,index)=><div key={index}>{section.label&&<dt>{section.label}</dt>}<dd>{section.value}</dd></div>)}</dl>;
}
function NotePreview({draft,editHref}:{draft:BookingDraft;editHref?:string}){
  const preview=noteSections(draft.note).map(section=>section.label?`${section.label}: ${section.value}`:section.value).join('\n');
  return <section className={styles.noteCard} aria-label="상담 노트 미리보기">
    <div className={styles.cardHeading}><h2 className={styles.editorial}>HAIR NOTE</h2>{editHref&&<Link className={styles.edit} href={editHref} aria-label="노트 수정">수정</Link>}</div>
    <p className={styles.preview}>{preview||'상담 노트를 작성해 주세요.'}</p>
    {draft.note&&<details className={styles.noteDetails}><summary>노트 전체 보기</summary><NoteContent note={draft.note}/></details>}
  </section>;
}
function BookingCalendar({dates,windowDates,value,onSelect}:{dates:string[];windowDates:string[];value:string;onSelect:(date:string)=>void}){
  const months=[...new Set(windowDates.map(date=>date.slice(0,7)))];
  const initial=dates.includes(value)?value.slice(0,7):dates[0]?.slice(0,7);
  const [view,setView]=useState(initial||months[0]);
  const month=months.includes(view)?view:initial||months[0];
  if(!month)return null;
  const position=months.indexOf(month);
  const [year,monthNumber]=month.split('-').map(Number);
  return <section className={styles.calendar} aria-label="예약 날짜 선택">
    <div className={styles.monthHeading}>
      <button type="button" aria-label="이전 달" disabled={position<=0} onClick={()=>setView(months[position-1])}><Arrow/></button>
      <h2 aria-live="polite">{year}년 {monthNumber}월</h2>
      <button type="button" aria-label="다음 달" disabled={position>=months.length-1} onClick={()=>setView(months[position+1])}><Arrow right/></button>
    </div>
    <div className={styles.weekdays} aria-hidden="true">{['일','월','화','수','목','금','토'].map(day=><span key={day}>{day}</span>)}</div>
    <div className={styles.days}>{calendarCells(month).map((date,index)=>date?<button type="button" key={date} disabled={!dates.includes(date)} aria-label={bookingDateLabel(date)} aria-pressed={value===date} onClick={()=>onSelect(date)}>{Number(date.slice(-2))}</button>:<span key={`empty-${index}`}/>)}</div>
  </section>;
}

export function BookingFlow({designerId,step,initialService,returnToReview=false}:{designerId:string;step:string;initialService?:string;returnToReview?:boolean}){
  const {state,update,ready}=usePrototype();
  const router=useRouter();
  const initialized=useRef('');
  const submitted=useRef(false);
  const [error,setError]=useState('');
  const [profileRevision,setProfileRevision]=useState(0);
  useEffect(()=>{const refresh=()=>setProfileRevision(v=>v+1);window.addEventListener('focus',refresh);window.addEventListener('storage',refresh);return()=>{window.removeEventListener('focus',refresh);window.removeEventListener('storage',refresh);};},[]);
  const [dates,setDates]=useState<string[]>([]);
  const [windowDates,setWindowDates]=useState<string[]>([]);
  const designer=designers.find(person=>person.id===designerId);
  const draft=state.draft?.designerId===designerId?state.draft:null;
  const prefix=`/reservation/${designerId}`;
  const index=steps.indexOf(step);
  const back=returnToReview?`${prefix}/review`:index>0?`${prefix}/${steps[index-1]}`:`/designers/${designerId}`;

  useEffect(()=>{
    const refresh=()=>{setDates(availableBookingDates(designerId));setWindowDates(demoDates());};
    refresh();
    window.addEventListener('focus',refresh);
    const timer=window.setInterval(refresh,60000);
    return ()=>{window.removeEventListener('focus',refresh);window.clearInterval(timer);};
  },[designerId]);
  useEffect(()=>{
    if(!ready||!designer||initialized.current===designerId)return;
    initialized.current=designerId;
    update(current=>{
      if(current.draft?.designerId===designerId&&!current.bookings.some(booking=>booking.id===current.draft?.id)){
        return services.some(service=>service.id===initialService)?{...current,draft:selectBookingService(current.draft,initialService!)}:current;
      }
      return {...current,draft:{id:crypto.randomUUID(),designerId,serviceId:services.some(service=>service.id===initialService)?initialService!:'',date:'',time:'',note:'',noteEdited:false}};
    });
  },[ready,designer,designerId,initialService,update]);
  useEffect(()=>{
    if(!ready||!draft||clearClosedBookingDate(draft)===draft)return;
    update(current=>({...current,draft:current.draft?.designerId===designerId?clearClosedBookingDate(current.draft):current.draft}));
    setError('선택했던 날짜가 정기 휴무일이에요. 다른 날짜를 선택해 주세요.');
  },[ready,draft,designerId,update]);
  // A query service is an entry choice; removing it prevents reapplying it on reload.
  useEffect(()=>{if(ready&&draft&&services.some(service=>service.id===initialService))router.replace(`${prefix}/${step}${returnToReview?'?return=review':''}`);},[ready,draft,initialService,router,prefix,step,returnToReview]);
  useEffect(()=>{
    if(ready&&draft&&(step==='note'||step==='review')&&draft.serviceId&&!draft.noteEdited){
      const profile=readProfile();
      const note=hairNote(profile?effectiveProfile(profile):null,state.preferences,draft.serviceId,draft.noteInput);
      if(note!==draft.note)update(current=>({...current,draft:current.draft?.designerId===designerId?{...current.draft,note}:current.draft}));
    }
  },[ready,draft,step,state.preferences,designerId,update,profileRevision]);
  useEffect(()=>{setError('');},[step]);
  function patchDraft(change:(value:BookingDraft)=>BookingDraft){
    setError('');
    update(current=>({...current,draft:current.draft?.designerId===designerId?change(current.draft):current.draft}));
  }
  if(!designer)return <BookingPage back="/explore?category=designer"><div className={styles.content}><h1>디자이너를 찾을 수 없어요.</h1><Link className={`${styles.primary} primary-cta`} href="/explore?category=designer">디자이너 선택하기</Link></div></BookingPage>;
  if(!ready||!draft)return <BookingPage back={`/designers/${designerId}`}><p className={styles.content} role="status">예약 내용을 불러오는 중이에요.</p></BookingPage>;
  if(index<0)return <BookingPage back={`/designers/${designerId}`}><div className={styles.content}><Link className={`${styles.primary} primary-cta`} href={`${prefix}/service`}>예약 시작하기</Link></div></BookingPage>;
  const service=services.find(service=>service.id===draft.serviceId);
  const dateValid=dates.includes(draft.date)&&demoTimes.includes(draft.time);
  const canContinue=index===0?!!service:index===1?!!service&&dateValid:index===2?!!service&&dateValid&&!!draft.note.trim():validBooking(draft);
  const person=findArvoDesigner(designerId);
  const editHref=(target:string)=>`${prefix}/${target}?return=review`;
  const continueBooking=()=>{
    if(!canContinue)return;
    if(index<3){router.push(`${prefix}/${returnToReview?'review':steps[index+1]}`);return;}
    if(submitted.current)return;
    try{
      submitted.current=true;
      update(current=>({...current,bookings:completeBooking(current.bookings,draft)}));
      router.replace(`/reservations/${draft.id}`);
    }catch(error){submitted.current=false;setError((error as Error).message);}
  };
  return <BookingPage back={back}>
    <div className={styles.content}>
      <ol className={styles.progress} aria-label={`예약 ${index+1} / 4단계`}>{steps.map((value,i)=><li key={value} data-active={i<=index} aria-current={i===index?'step':undefined}><span>0{i+1}</span>{labels[i]}</li>)}</ol>
      <DesignerIdentity id={designerId}/>
      <div className={styles.intro}><h1 tabIndex={-1}>{titles[index]}</h1>{index===2&&<p>나의 헤어를 바탕으로 상담 내용을 정리했어요.</p>}</div>
      {index===0&&<><div className={styles.services} role="group" aria-label="시술 선택">{services.map(service=><button type="button" className={styles.service} key={service.id} aria-pressed={draft.serviceId===service.id} onClick={()=>patchDraft(current=>selectBookingService(current,service.id))}><span><strong>{service.name}</strong><small>{service.price.toLocaleString('ko-KR')}원 · 약 {service.minutes}분</small></span><span className={styles.selection}>{draft.serviceId===service.id&&<Check/>}</span></button>)}</div><p className={styles.hint}>한 가지 시술을 선택해 주세요.</p></>}
      {index===1&&<div className={styles.schedule}>
        <BookingCalendar dates={dates} windowDates={windowDates} value={draft.date} onSelect={date=>patchDraft(current=>selectBookingDate(current,date))}/>
        <p className={styles.hint}>{person?`정기 휴무 · ${offDaysLabel(person).replace(' OFF','')}`:'선택 가능한 날짜만 표시했어요.'}<br/>방문 가능한 날짜를 선택해 주세요.</p>
        <section className={styles.timeSection} aria-labelledby="time-title"><div className={styles.cardHeading}><h2 id="time-title">시간 선택</h2><span className={styles.hint}>약 {service?.minutes||'—'}분 소요</span></div><p className={styles.dateCaption} aria-live="polite">{draft.date?bookingDateLabel(draft.date):'날짜를 먼저 선택해 주세요.'}</p><div className={styles.times} role="group" aria-label="예약 시간 선택">{demoTimes.map(time=><button type="button" key={time} disabled={!dates.includes(draft.date)} aria-pressed={draft.time===time} onClick={()=>patchDraft(current=>({...current,time}))}>{time}</button>)}</div></section>
        {!service&&<Link className={styles.textLink} href={`${prefix}/service`}>시술 먼저 선택하기</Link>}
      </div>}
      {index===2&&<HairNoteEditorial draft={draft} profileRevision={profileRevision} onChange={patchDraft} onRebuild={()=>{if(draft.noteEdited&&!window.confirm('최신 프로필로 노트를 다시 구성할까요? 직접 수정한 노트는 아래에 보존됩니다.'))return;const profile=readProfile();const noteInput={...draft.noteInput,...(draft.noteEdited?{preserved:draft.note}:{})};patchDraft(current=>({...current,noteInput,noteEdited:false,note:hairNote(profile?effectiveProfile(profile):null,state.preferences,current.serviceId,noteInput)}));}}/>}
      {index===3&&<><BookingSummary draft={draft} editPrefix={prefix}/><NotePreview draft={draft} editHref={editHref('note')}/><p className={styles.hint}>저장한 예약과 상담 노트는 MY에서 다시 볼 수 있어요.</p></>}
      {error&&<p role="status" className={styles.message}>{error}</p>}
      {index>0&&!canContinue&&<p className={styles.hint} role="status">{!service?<Link className={styles.textLink} href={editHref('service')}>시술을 선택해 주세요.</Link>:!dateValid?<Link className={styles.textLink} href={editHref('schedule')}>날짜와 시간을 선택해 주세요.</Link>:<Link className={styles.textLink} href={editHref('note')}>상담 노트를 작성해 주세요.</Link>}</p>}
    </div>
    <footer className={styles.footer}><button type="button" className={`${styles.primary} primary-cta`} disabled={!canContinue} onClick={continueBooking}>{index===3?'예약 정보 저장하기':returnToReview?'수정하고 예약 확인':index===2?'예약 정보 확인하기':'다음'}</button></footer>
  </BookingPage>;
}

export function BookingSummary({draft,editPrefix}:{draft:BookingDraft;editPrefix?:string}){
  const designer=designers.find(person=>person.id===draft.designerId);
  const service=services.find(service=>service.id===draft.serviceId);
  const salon=salons.find(salon=>salon.id===designer?.salonId)?.name||(findArvoDesigner(draft.designerId)?'아르보 성수':'');
  return <section className={styles.summary} aria-label="예약 요약">
    <div className={styles.summaryIdentity}><span className={styles.eyebrow}>YOUR APPOINTMENT</span><h2>{designer?.name} 디자이너</h2>{salon&&<p>{salon}</p>}</div>
    <dl>
      <div><dt>시술</dt><dd><strong>{service?.name||'시술 선택 전'}</strong>{editPrefix&&<Link className={styles.edit} href={`${editPrefix}/service?return=review`} aria-label="시술 수정">수정</Link>}</dd></div>
      <div><dt>일정</dt><dd><span>{bookingDateLabel(draft.date)}<strong className={styles.summaryTime}>{draft.time}</strong></span>{editPrefix&&<Link className={styles.edit} href={`${editPrefix}/schedule?return=review`} aria-label="일정 수정">수정</Link>}</dd></div>
      <div className={styles.total}><dt>예상 금액</dt><dd><strong>{service?`${service.price.toLocaleString('ko-KR')}원`:'—'}</strong></dd></div>
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
 return <article className={styles.appointment} key={booking.id}><p className={styles.savedStatus}>저장 완료</p><p className={styles.appointmentDate}>{bookingDateLabel(booking.date)} · {booking.time}</p><h2>{designer?.name} 디자이너</h2><p className={styles.appointmentSalon}>{salon}</p><div className={styles.appointmentService}><span>{service?.name}</span><span>{service?.price.toLocaleString('ko-KR')}원</span></div><Link className={`${styles.primary} primary-cta`} href={`/reservations/${booking.id}`}>상담 노트 및 상세 보기</Link></article>;
 }):<><p>아직 저장한 예약이 없어요.</p><Link className={`${styles.primary} primary-cta`} href="/explore?category=designer">디자이너 찾아보기</Link></>}
 </div></BookingPage>;
}
