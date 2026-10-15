'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {readProfile,effectiveProfile,type Values} from '@/lib/analysis/profile';
import {findItem,designers,salons,articles,events,type Kind} from '@/lib/prototype/catalog';
import {readEntry} from '@/lib/entry-state';
import {BottomNav} from '@/components/bottom-nav';
import {usePrototype} from './store';
import {Screen,Action,Card,DemoNotice} from './shared';
import {BookingSummary} from './booking';

const myAsset=(name:string)=>`/assets/figma/my/${name}`;

function bookingDateLabel(date:string,time:string){
 const [month,day]=date.split('-').slice(1).map(Number);
 const [hour,minute]=time.split(':').map(Number);
 const period=hour<12?'오전':'오후';
 const displayHour=hour%12||12;
 return `${month}월 ${String(day).padStart(2,'0')}일 · ${period} ${displayHour}:${String(minute).padStart(2,'0')}`;
}

function Arrow({name,alt=''}:{name:string;alt?:string}){return <img className="my-arrow" src={myAsset(name)} alt={alt}/>;}

export function My({view}:{view?:string}){
 const {state,update,ready}=usePrototype();
 const [name,setName]=useState('게스트');
 const [profile,setProfile]=useState<Values|null>(null);

 useEffect(()=>{
  setName(readEntry().name||'게스트');
  const savedProfile=readProfile();
  setProfile(savedProfile?effectiveProfile(savedProfile):null);
 },[]);

 if(view==='reservations')return <Screen title="My Appointments" back="/my"><DemoNotice>이 브라우저에서 완료한 데모 예약입니다. 실제 예약 내역이 아니에요.</DemoNotice>{!ready?<p>불러오는 중이에요.</p>:state.bookings.length?state.bookings.map(b=><article className="appointment" key={b.id}><p className="eyebrow">DEMO · 저장 완료</p><BookingSummary draft={b}/><Action href={`/reservations/${b.id}`}>상담 노트 및 상세 보기</Action></article>):<div className="empty-state"><p>아직 데모 예약이 없어요.</p><Action href="/explore?category=designer">디자이너 찾아보기</Action></div>}</Screen>;

 if(view==='recent')return <Screen title="Recently Viewed" back="/my">{!state.recent.length?<p>최근 조회한 콘텐츠가 없어요.</p>:state.recent.map(key=>{const [kind,id]=key.split(':');if(kind==='article'){const article=[...articles,...events].find(a=>a.id===id);return article?<Link key={key} className="list-link" href={`/articles/${id}`}>{article.title} ↗</Link>:null;}if(kind==='focus')return <Link key={key} className="list-link" href="/in-focus/soft-bob">IN FOCUS · SOFT EXPRESSION ↗</Link>;const item=findItem(kind as Kind,id);return item?<Card key={key} item={item}/>:null;})}</Screen>;

 if(view==='settings')return <Screen title="Settings" back="/my"><h2>알림</h2><label className="list-link">데모 알림 설정<input style={{width:24}} type="checkbox" checked={state.notifications} onChange={e=>update(s=>({...s,notifications:e.target.checked}))}/></label><label className="list-link">저장 시 SAVENOTE 자동 표시<input style={{width:24}} type="checkbox" disabled={!ready} checked={state.saveNoteEnabled!==false} onChange={e=>update(s=>({...s,saveNoteEnabled:e.target.checked}))}/></label><DemoNotice>설정만 저장되며 실제 푸시 알림은 전송되지 않아요.</DemoNotice><h2>결제 수단</h2><p>프로토타입에서는 카드 등록이나 결제를 지원하지 않아요.</p><h2>데이터 보관</h2><p>프로필, 취향, 저장 메모와 예약은 이 브라우저에 보관됩니다. 촬영 사진은 영구 저장하거나 서버로 전송하지 않아요.</p><Action secondary href="/onboarding/1">온보딩 다시 보기</Action></Screen>;

 const preferenceTags=Object.values(state.preferences).flat().slice(0,3);
 const booking=[...state.bookings].sort((a,b)=>`${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
 const profileTitle=profile?[profile.length,profile.cut].filter(Boolean).join(' '):'';
 const profileSubtitle=profile?.texture||'';
 const profileMeta=profile?[profile.length,profile.texture,profile.color].filter(Boolean):[];

 return <><main id="main" className="my-page"><div className="my-page-content"><h1>MY</h1><div className="my-dashboard" data-figma-node="945:9545">
  <section className="my-user-info" aria-label="사용자 정보">
   <img className="my-avatar" src={myAsset('avatar.png')} alt=""/>
   <div>
    <h2>{name}</h2>
    <p className="my-edit-label">내 정보 수정 <Arrow name="edit-chevron.svg"/></p>
   </div>
  </section>

  <Link className="my-profile-card" href={profile?'/analysis/result?from=my':'/analysis/guide'}>
   <div className="my-profile-main">
    <div className="my-card-label"><span>MY HAIR PROFILE</span><Arrow name="profile-arrow.svg"/></div>
    {profile?<div className="my-profile-copy"><h2><span>{profileTitle||'헤어 정보 미입력'}</span>{profileSubtitle&&<span>{profileSubtitle}</span>}</h2><p>{profileMeta.join(' · ')}</p></div>:<div className="my-profile-copy"><h2>아직 헤어 프로필이 없어요</h2><p>프로필을 만들고 나에게 맞는 스타일을 확인해 보세요.</p></div>}
   </div>
   <div className="my-preference"><p className="my-card-label">MY PREFERENCE</p>{preferenceTags.length?<div className="my-tag-list">{preferenceTags.map(tag=><span key={tag}># {tag}</span>)}</div>:<p className="my-empty-preference">아직 취향 설문을 완료하지 않았어요.</p>}</div>
  </Link>

  <section className="my-upcoming">
   <Link className="my-section-link" href="/my/reservations"><span>다가오는 예약</span><Arrow name="section-chevron.svg"/></Link>
   {booking?<Link className="my-booking-card" href={`/reservations/${booking.id}`}><strong>{bookingDateLabel(booking.date,booking.time)}</strong><p>{(() => {const designer=designers.find(item=>item.id===booking.designerId);return `${designer?.name||'디자이너'} 디자이너 · ${salons.find(item=>item.id===designer?.salonId)?.name||'살롱'}`;})()}</p></Link>:<p className="my-booking-empty">다가오는 예약이 없어요.</p>}
  </section>

  <section className="my-menu-section" aria-labelledby="my-activity">
   <div className="my-menu-title"><h2 id="my-activity">MY ACTIVITY</h2><p>나의 활동</p></div>
   <Link className="my-menu-row" href="/my/reservations"><span>예약 내역</span><Arrow name="row-chevron.svg"/></Link>
   <Link className="my-menu-row" href="/my/recent"><span>최근 조회한 콘텐츠</span><Arrow name="row-chevron.svg"/></Link>
  </section>

  <section className="my-menu-section" aria-labelledby="my-settings">
   <div className="my-menu-title"><h2 id="my-settings">SETTINGS</h2><p>설정</p></div>
   <Link className="my-menu-row" href="/my/settings"><span>알림</span><Arrow name="row-chevron.svg"/></Link>
   <Link className="my-menu-row" href="/my/settings"><span>결제 수단</span><Arrow name="row-chevron.svg"/></Link>
  </section>
 </div></div></main><BottomNav active="/my"/></>;
}
