'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {readProfile,effectiveProfile,type Values} from '@/lib/analysis/profile';
import {findItem,designers,salons,articles,events,type Kind} from '@/lib/prototype/catalog';
import {useNickname} from '@/lib/use-nickname';
import {BottomNav} from '@/components/bottom-nav';
import {usePrototype} from './store';
import {bookingServicesLabel,type Booking} from '@/lib/prototype/logic';
import {readEntry,writeEntry} from '@/lib/entry-state';
import {Screen,Action,Card,DemoNotice} from './shared';

const myAsset=(name:string)=>`/assets/figma/my/${name}`;

function bookingDateLabel(date:string,time:string){
 const [month,day]=date.split('-').slice(1).map(Number);
 const [hour,minute]=time.split(':').map(Number);
 const period=hour<12?'오전':'오후';
 const displayHour=hour%12||12;
 return `${month}월 ${String(day).padStart(2,'0')}일 · ${period} ${displayHour}:${String(minute).padStart(2,'0')}`;
}

const localDate=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
/* Demo booking stays in the near future: five days ahead, skipping the salon's regular closed days (Tue, Fri). */
function demoBookingDate(from:Date){const date=new Date(from.getFullYear(),from.getMonth(),from.getDate()+5);while([2,5].includes(date.getDay()))date.setDate(date.getDate()+1);return localDate(date);}

function dDay(date:string,today:string){
 if(!date||!today)return '';
 const days=Math.round((new Date(`${date}T00:00:00`).getTime()-new Date(`${today}T00:00:00`).getTime())/86400000);
 return days<=0?'D-DAY':`D-${days}`;
}
function designerLine(designerId:string){const designer=designers.find(item=>item.id===designerId);return `${designer?.name||'디자이너'} 디자이너 · ${salons.find(item=>item.id===designer?.salonId)?.name||'살롱'}`;}

function BookingCard({date,time,designerId,detail,href,today}:{date:string;time:string;designerId:string;detail:string;href:string;today:string}){
 return <Link className="my-booking-card" href={href}>
  <div className="my-booking-top"><strong>{date?bookingDateLabel(date,time):'\u00a0'}</strong>{date&&today&&<span className="my-dday">{dDay(date,today)}</span>}</div>
  <p>{designerLine(designerId)}</p>
  <p className="my-booking-detail">{detail}</p>
 </Link>;
}

function NameField(){
 const [value,setValue]=useState('');
 useEffect(()=>setValue(readEntry().name),[]);
 return <label className="my-name-field"><span>이름 또는 닉네임</span><input value={value} maxLength={20} placeholder="이름 또는 닉네임" autoComplete="nickname" onChange={e=>{setValue(e.target.value);writeEntry({name:e.target.value.trim()});}}/></label>;
}

function Arrow({name}:{name:string}){return <span className={`my-arrow-slot my-arrow-slot--${name.replace('.svg','')}`} aria-hidden="true"><span><img className="my-arrow" src={myAsset(name)} alt=""/></span></span>;}

export function My({view}:{view?:string}){
 const {state,update,ready}=usePrototype();
 const name=useNickname();
 const [profile,setProfile]=useState<Values|null>(null);
 const [today,setToday]=useState('');

 useEffect(()=>{
  const savedProfile=readProfile();
  setToday(localDate(new Date()));
  setProfile(savedProfile?effectiveProfile(savedProfile):null);
 },[]);

 const sortedBookings=[...state.bookings].sort((a,b)=>`${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
 const upcoming=sortedBookings.filter(item=>!today||item.date>=today);
 const booking=upcoming[0];
 const demoDate=today?demoBookingDate(new Date(`${today}T00:00:00`)):'';

 if(view==='recent')return <Screen title="Recently Viewed" back="/my">{!state.recent.length?<p>최근 조회한 콘텐츠가 없어요.</p>:state.recent.map(key=>{const [kind,id]=key.split(':');if(kind==='article'){const article=[...articles,...events].find(a=>a.id===id);return article?<Link key={key} className="list-link" href={`/articles/${id}`}>{article.title} ↗</Link>:null;}if(kind==='focus')return <Link key={key} className="list-link" href="/in-focus/soft-bob">IN FOCUS · SOFT EXPRESSION ↗</Link>;const item=findItem(kind as Kind,id);return item?<Card key={key} item={item}/>:null;})}</Screen>;

 if(view==='bookings')return <Screen title="Reservations" back="/my"><div className="my-booking-list">{sortedBookings.length?[...upcoming,...sortedBookings.filter(item=>!upcoming.includes(item)).reverse()].map((item:Booking)=><div key={item.id} className={upcoming.includes(item)?undefined:'my-booking-past'}><BookingCard date={item.date} time={item.time} designerId={item.designerId} detail={bookingServicesLabel(item)} href={`/reservations/${item.id}`} today={upcoming.includes(item)?today:''}/></div>):<><BookingCard date={demoDate} time="14:00" designerId="yoona" detail="여성 디자인 컷 · 예시 예약" href="/designers/yoona" today={today}/><DemoNotice>아직 직접 만든 예약이 없어 예시 예약을 보여드려요.</DemoNotice></>}</div></Screen>;

 if(view==='settings')return <Screen title="Settings" back="/my"><h2>내 정보</h2><NameField/><h2>알림</h2><label className="list-link">데모 알림 설정<input style={{width:24}} type="checkbox" checked={state.notifications} onChange={e=>update(s=>({...s,notifications:e.target.checked}))}/></label><label className="list-link">저장 시 SAVENOTE 자동 표시<input style={{width:24}} type="checkbox" disabled={!ready} checked={state.saveNoteEnabled!==false} onChange={e=>update(s=>({...s,saveNoteEnabled:e.target.checked}))}/></label><DemoNotice>설정만 저장되며 실제 푸시 알림은 전송되지 않아요.</DemoNotice><h2>결제 수단</h2><p>프로토타입에서는 카드 등록이나 결제를 지원하지 않아요.</p><h2>데이터 보관</h2><p>프로필, 취향, 저장 메모와 예약은 이 브라우저에 보관됩니다. 촬영 사진은 영구 저장하거나 서버로 전송하지 않아요.</p><Action secondary href="/onboarding/1">온보딩 다시 보기</Action></Screen>;

 const preferenceTags=['내추럴','퓨어','웨이브'];
 const profileTitle=profile?[profile.length,profile.cut].filter(Boolean).join(' '):'';
 const profileSubtitle=profile?.texture||'';
 const profileMeta=profile?[profile.length,profile.texture,profile.color].filter(Boolean):[];

 return <><main id="main" className="my-page"><div className="my-page-content"><h1>MY</h1><div className="my-dashboard" data-figma-node="945:9545">
  <Link className="my-user-info" href="/my/settings" aria-label={`${name}, 내 정보 수정`}>
   <img className="my-avatar" src={myAsset('avatar.png')} alt=""/>
   <div>
    <h2>{name}</h2>
    <p className="my-edit-label"><span>내 정보 수정</span><Arrow name="edit-chevron.svg"/></p>
   </div>
  </Link>

  <div className="my-dashboard-sections">
  <section className="my-upcoming" aria-labelledby="my-upcoming-title">
   <Link className="my-section-link" href="/my/bookings"><span id="my-upcoming-title">다가오는 예약</span><Arrow name="section-chevron.svg"/></Link>
   {booking?<BookingCard date={booking.date} time={booking.time} designerId={booking.designerId} detail={bookingServicesLabel(booking)} href={`/reservations/${booking.id}`} today={today}/>:<BookingCard date={demoDate} time="14:00" designerId="yoona" detail="여성 디자인 컷" href="/designers/yoona" today={today}/>}
  </section>

  <div className="my-profile-card" data-figma-node="939:9458">
   <Link className="my-profile-main" href={profile?'/analysis/result?from=my':'/analysis/guide'}>
    <div className="my-card-label"><span>MY HAIR PROFILE</span><Arrow name="profile-arrow.svg"/></div>
    <p className="my-profile-type">NATURAL</p>
    {profile?<div className="my-profile-copy"><h2><span>{profileTitle||'헤어 정보 미입력'}</span>{profileSubtitle&&<span>{profileSubtitle}</span>}</h2><p>{profileMeta.join(' · ')}</p></div>:<div className="my-profile-copy"><h2><span>긴 레이어드</span><span>자연스러운 웨이브</span></h2><p>허리 기장 · 반곱슬 · 흑갈색</p></div>}
   </Link>
   <div className="my-preference"><p className="my-card-label">MY PREFERENCE</p><div className="my-tag-list">{preferenceTags.map(tag=><span key={tag}># {tag}</span>)}</div></div>
  </div>

  <section className="my-menu-section" aria-labelledby="my-activity">
   <div className="my-menu-title"><h2 id="my-activity">MY ACTIVITY</h2><p>나의 활동</p></div>
   <Link className="my-menu-row" href="/my/bookings"><span>예약 내역</span><span className="my-menu-meta">{state.bookings.length?`${state.bookings.length}건`:'예시 1건'}<Arrow name="row-chevron.svg"/></span></Link>
   <Link className="my-menu-row" href="/my/recent"><span>최근 조회한 콘텐츠</span><span className="my-menu-meta">{state.recent.length}개<Arrow name="row-chevron.svg"/></span></Link>
   <Link className="my-menu-row" href="/saved"><span>저장한 콘텐츠</span><span className="my-menu-meta">{state.saved.length}개<Arrow name="row-chevron.svg"/></span></Link>
  </section>

  <section className="my-menu-section" aria-labelledby="my-settings">
   <div className="my-menu-title"><h2 id="my-settings">SETTINGS</h2><p>설정</p></div>
   <Link className="my-menu-row" href="/my/settings"><span>알림</span><span className="my-menu-meta">{state.notifications?'켜짐':'꺼짐'}<Arrow name="row-chevron.svg"/></span></Link>
   <Link className="my-menu-row" href="/my/settings"><span>결제 수단</span><span className="my-menu-meta">미등록<Arrow name="row-chevron.svg"/></span></Link>
  </section>
 </div></div></div></main><BottomNav active="/my"/></>;
}
