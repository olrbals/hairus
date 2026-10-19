'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {readProfile,effectiveProfile,type Values} from '@/lib/analysis/profile';
import {findItem,designers,salons,articles,events,type Kind} from '@/lib/prototype/catalog';
import {useNickname} from '@/lib/use-nickname';
import {BottomNav} from '@/components/bottom-nav';
import {usePrototype} from './store';
import {Screen,Action,Card,DemoNotice} from './shared';
import {BookingAppointments} from './booking';

const myAsset=(name:string)=>`/assets/figma/my/${name}`;

function bookingDateLabel(date:string,time:string){
 const [month,day]=date.split('-').slice(1).map(Number);
 const [hour,minute]=time.split(':').map(Number);
 const period=hour<12?'오전':'오후';
 const displayHour=hour%12||12;
 return `${month}월 ${String(day).padStart(2,'0')}일 · ${period} ${displayHour}:${String(minute).padStart(2,'0')}`;
}

function Arrow({name}:{name:string}){return <span className={`my-arrow-slot my-arrow-slot--${name.replace('.svg','')}`} aria-hidden="true"><span><img className="my-arrow" src={myAsset(name)} alt=""/></span></span>;}

export function My({view}:{view?:string}){
 const {state,update,ready}=usePrototype();
 const name=useNickname();
 const [profile,setProfile]=useState<Values|null>(null);

 useEffect(()=>{
  const savedProfile=readProfile();
  setProfile(savedProfile?effectiveProfile(savedProfile):null);
 },[]);

 if(view==='reservations')return <BookingAppointments/>;

 if(view==='recent')return <Screen title="Recently Viewed" back="/my">{!state.recent.length?<p>최근 조회한 콘텐츠가 없어요.</p>:state.recent.map(key=>{const [kind,id]=key.split(':');if(kind==='article'){const article=[...articles,...events].find(a=>a.id===id);return article?<Link key={key} className="list-link" href={`/articles/${id}`}>{article.title} ↗</Link>:null;}if(kind==='focus')return <Link key={key} className="list-link" href="/in-focus/soft-bob">IN FOCUS · SOFT EXPRESSION ↗</Link>;const item=findItem(kind as Kind,id);return item?<Card key={key} item={item}/>:null;})}</Screen>;

 if(view==='settings')return <Screen title="Settings" back="/my"><h2>알림</h2><label className="list-link">데모 알림 설정<input style={{width:24}} type="checkbox" checked={state.notifications} onChange={e=>update(s=>({...s,notifications:e.target.checked}))}/></label><label className="list-link">저장 시 SAVENOTE 자동 표시<input style={{width:24}} type="checkbox" disabled={!ready} checked={state.saveNoteEnabled!==false} onChange={e=>update(s=>({...s,saveNoteEnabled:e.target.checked}))}/></label><DemoNotice>설정만 저장되며 실제 푸시 알림은 전송되지 않아요.</DemoNotice><h2>결제 수단</h2><p>프로토타입에서는 카드 등록이나 결제를 지원하지 않아요.</p><h2>데이터 보관</h2><p>프로필, 취향, 저장 메모와 예약은 이 브라우저에 보관됩니다. 촬영 사진은 영구 저장하거나 서버로 전송하지 않아요.</p><Action secondary href="/onboarding/1">온보딩 다시 보기</Action></Screen>;

 const savedPreferenceTags=Object.values(state.preferences).flat().slice(0,3);
 const preferenceTags=savedPreferenceTags.length?savedPreferenceTags:['웨이브','내추럴 무드','최근 커트'];
 const booking=[...state.bookings].sort((a,b)=>`${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
 const profileTitle=profile?[profile.length,profile.cut].filter(Boolean).join(' '):'';
 const profileSubtitle=profile?.texture||'';
 const profileMeta=profile?[profile.length,profile.texture,profile.color].filter(Boolean):[];

 return <><main id="main" className="my-page"><div className="my-page-content"><h1>MY</h1><div className="my-dashboard" data-figma-node="945:9545">
  <section className="my-user-info" aria-label="사용자 정보">
   <img className="my-avatar" src={myAsset('avatar.png')} alt=""/>
   <div>
    <h2>{name}</h2>
    <p className="my-edit-label"><span>내 정보 수정</span><Arrow name="edit-chevron.svg"/></p>
   </div>
  </section>

  <div className="my-dashboard-sections">
  <div className="my-profile-card" data-figma-node="939:9458">
   <Link className="my-profile-main" href={profile?'/analysis/result?from=my':'/analysis/guide'}>
    <div className="my-card-label"><span>MY HAIR PROFILE</span><Arrow name="profile-arrow.svg"/></div>
    {profile?<div className="my-profile-copy"><h2><span>{profileTitle||'헤어 정보 미입력'}</span>{profileSubtitle&&<span>{profileSubtitle}</span>}</h2><p>{profileMeta.join(' · ')}</p></div>:<div className="my-profile-copy"><h2><span>긴 레이어드</span><span>자연스러운 웨이브</span></h2><p>허리 기장 · 반곱슬 · 흑갈색</p></div>}
   </Link>
   <div className="my-preference"><p className="my-card-label">MY PREFERENCE</p><div className="my-tag-list">{preferenceTags.map(tag=><span key={tag}># {tag}</span>)}</div></div>
  </div>

  <section className="my-upcoming">
   <div className="my-section-link"><span>다가오는 예약</span><Arrow name="section-chevron.svg"/></div>
   {booking?<div className="my-booking-card"><strong>{bookingDateLabel(booking.date,booking.time)}</strong><p>{(() => {const designer=designers.find(item=>item.id===booking.designerId);return `${designer?.name||'디자이너'} 디자이너 · ${salons.find(item=>item.id===designer?.salonId)?.name||'살롱'}`;})()}</p></div>:<div className="my-booking-card"><strong>11월 04일 · 오후 2:00</strong><p>윤아 디자이너 · 아르보 성수</p></div>}
  </section>

  <section className="my-menu-section" aria-labelledby="my-activity">
   <div className="my-menu-title"><h2 id="my-activity">MY ACTIVITY</h2><p>나의 활동</p></div>
   <Link className="my-menu-row" href="/my/reservations"><span>예약 내역</span><Arrow name="row-chevron.svg"/></Link>
   <div className="my-menu-row"><span>최근 조회한 콘텐츠</span><Arrow name="row-chevron.svg"/></div>
  </section>

  <section className="my-menu-section" aria-labelledby="my-settings">
   <div className="my-menu-title"><h2 id="my-settings">SETTINGS</h2><p>설정</p></div>
   <div className="my-menu-row"><span>알림</span><Arrow name="row-chevron.svg"/></div>
   <div className="my-menu-row"><span>결제 수단</span><Arrow name="row-chevron.svg"/></div>
  </section>
 </div></div></div></main><BottomNav active="/my"/></>;
}
