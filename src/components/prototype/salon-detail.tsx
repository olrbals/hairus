'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect,useRef,useState,type MouseEvent,type CSSProperties} from 'react';
import {asset,findItem} from '@/lib/prototype/catalog';
import {arvoTeam,findArvoDesigner,offDaysLabel,arvoPriceGroups,arvoInterior,type ArvoDesigner} from '@/lib/prototype/arvo';
import {arvoReviews} from '@/lib/prototype/reviews';
import {ReviewSection} from './reviews';
import {SaveButton} from './shared';
import {usePrototype} from './store';
import {HeaderBackIcon} from '@/components/primitives';
import designerStyles from './designer-detail.module.css';
import styles from './salon-detail.module.css';

const sections=[['notice','공지'],['price','가격'],['designers','디자이너'],['reviews','후기'],['information','정보']] as const;
const salonSectionOffset=112; // 64px shared header + 48px section navigation.
const localAsset=(name:string)=>`/assets/figma/salon-arvo/${name}`;

function SalonHeader({title,back,save=false}:{title:string;back:string;save?:boolean}){
  const router=useRouter();
  return <header className={`${designerStyles.header} hairus-page-header`}>
    <button type="button" className="hairus-header-back" aria-label="이전 화면" onClick={()=>window.history.length>1?router.back():router.push(back)}><HeaderBackIcon/></button>
    <span>{title}</span>
    {save?<div className={designerStyles.saveControl}><SaveButton item={findItem('salon','arvo')!}/></div>:<span/>}
  </header>;
}

function BookingLink({className}:{className?:string}){
  return <Link className={`${styles.bookingLink} primary-cta ${className||''}`} href="/salons/arvo/designers">예약하기</Link>;
}

export function ArvoSalonPage(){
  const {update,ready}=usePrototype();
  const [expanded,setExpanded]=useState(false);
  const [active,setActive]=useState<string>('notice');
  const [benefitMessage,setBenefitMessage]=useState('');
  const pageRef=useRef<HTMLElement>(null);
  useEffect(()=>{
    if(ready)update(current=>({...current,recent:['salon:arvo',...current.recent.filter(value=>value!=='salon:arvo')].slice(0,30)}));
  },[ready,update]);
  useEffect(()=>{
    // Same scroll-spy pattern as DesignerPage, with resize tracking for NOTICE.
    let frame=0;
    const sync=()=>{
      frame=0;
      let current:string='notice';
      for(const [id] of sections){
        const section=document.getElementById(id);
        if(section&&section.getBoundingClientRect().top<=salonSectionOffset+16)current=id;
      }
      if(window.scrollY>0&&window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-2)current='information';
      setActive(previous=>previous===current?previous:current);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(sync);};
    const observer=new ResizeObserver(schedule);
    if(pageRef.current)observer.observe(pageRef.current);
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    window.addEventListener('hashchange',schedule);
    sync();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);window.removeEventListener('hashchange',schedule);};
  },[]);
  function goToSection(event:MouseEvent<HTMLAnchorElement>,id:string){
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
    const section=document.getElementById(id);
    if(!section)return;
    event.preventDefault();
    // Preserve Next's history state and the previous page's back navigation.
    window.history.replaceState(window.history.state,'',`#${id}`);
    setActive(id);
    window.scrollTo({top:window.scrollY+section.getBoundingClientRect().top-salonSectionOffset,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  const firstDesigner=arvoTeam[0];
  return <main id="main" className={`${styles.page} ${styles.salonPage}`} ref={pageRef}>
    <SalonHeader title="아르보 성수" back="/explore?category=salon" save/>
    <img className={styles.hero} src={arvoInterior[0].src} alt="아르보 성수의 햇빛이 드는 매장 내부" fetchPriority="high"/>
    <div className={styles.profile}>
      <h1>아르보 성수</h1>
      <p>성수역 2번 출구 도보 3분 · 서울시 성동구 연무장길</p>
      <a href="#reviews" onClick={event=>goToSection(event,'reviews')}>★ 4.89&nbsp; · &nbsp;리뷰 2,004<span className={styles.srOnly}> · 데모 수치</span></a>
      <BookingLink/>
    </div>
    <nav className={styles.sectionNav} aria-label="매장 상세 섹션">{sections.map(([id,label])=><a key={id} href={`#${id}`} aria-current={active===id?'location':undefined} onClick={event=>goToSection(event,id)}>{label}</a>)}</nav>

    <section id="notice" className={styles.notice} aria-labelledby="notice-title">
      <div className={styles.sectionHeading}><h2 id="notice-title">NOTICE</h2><p>방문 전에 알아두세요</p></div>
      <dl className={styles.quickInfo}><div><dt>주차</dt><dd>2시간 무료</dd></div><div><dt>반려 동물</dt><dd>동반 불가</dd></div><div><dt>예약 취소</dt><dd>당일 취소 불가</dd></div></dl>
      <div className={styles.hours}>
        <div className={styles.hoursRow}><span>운영시간</span><span>매일</span><span>10:00 ~ 21:00</span></div>
        <button type="button" className={styles.hoursRow} aria-expanded={expanded} aria-controls="designer-days-off" aria-label="디자이너별 휴무일" onClick={()=>setExpanded(value=>!value)}><span>휴무일</span><span>{firstDesigner.name} {firstDesigner.title}</span><span>{offDaysLabel(firstDesigner)}<i aria-hidden="true">{expanded?'−':'+'}</i></span></button>
        <dl id="designer-days-off" className={styles.daysOff} hidden={!expanded}>{arvoTeam.map(person=><div key={person.id}><dt>{person.name} {person.title}</dt><dd>{offDaysLabel(person)}</dd></div>)}</dl>
      </div>
      <div className={styles.benefits}>
        <h3>방문 고객 혜택</h3>
        {[['첫 방문 최대 30% 할인','커트 · 클리닉 제외'],['VIP 50만원 선 결제시, 시술 1회 무료','해당 시술에는 커트 · 클리닉만 포함 됩니다.']].map(([title,description])=><button key={title} type="button" className={styles.benefit} onClick={()=>setBenefitMessage('프로토타입 혜택입니다. 실제 쿠폰 발급은 준비 중이에요.')} aria-label={`${title} 혜택 안내`}><span className={styles.benefitLogo} role="img" aria-label="ARVO" data-figma-node="945:9579"><span>ARVO</span></span><span><strong>{title}</strong><small>{description}</small></span><img src={localAsset('download.svg')} alt="" width="24" height="24"/></button>)}
        {benefitMessage&&<p className={styles.benefitMessage} role="status">{benefitMessage}</p>}
      </div>
    </section>

    <section id="price" className={styles.price} aria-labelledby="price-title">
      <div className={styles.sectionHeading}><h2 id="price-title">SERVICE &amp; PRICE</h2><p>시술과 가격을 확인해 보세요.</p></div>
      <div className={styles.priceList}>{arvoPriceGroups.map(group=><div className={styles.priceGroup} key={group.category} style={{'--category-width':`${group.category.length*12+28}px`} as CSSProperties}><span className={styles.category}>{group.category}</span><dl>{group.rows.map(row=><div key={row.name}><dt>{row.name}</dt><dd>{row.price.toLocaleString('ko-KR')}원{row.from?' ~':''}</dd></div>)}</dl></div>)}</div>
    </section>

    <section id="designers" className={styles.designers} aria-labelledby="designers-title">
      <div className={styles.sectionHeading}><h2 id="designers-title">DESIGNERS</h2><p>아르보 성수의 디자이너들을 만나보세요.</p></div>
      <div className={styles.featuredDesigners}>{['yoona','sohee'].map(id=>{const person=findArvoDesigner(id)!;return <Link className={styles.featuredDesigner} key={id} href={`/designers/${id}`}><img src={person.image} alt={`${person.name} ${person.title}`} width="64" height="88"/><span><strong>{person.name} {person.title}</strong><small>{id==='yoona'?'레이어드컷 · 샌드펌 전문':'테슬컷 · 그레이스펌 전문'}</small></span></Link>;})}</div>
      <Link className={styles.allDesigners} href="/salons/arvo/designers">전체 디자이너 6명 · 전문분야 보기 <img src={localAsset('arrow-right.svg')} alt="" width="16" height="16"/></Link>
    </section>

    <ReviewSection data={arvoReviews} allReviewsHref="/salons/arvo/reviews" variant="refined"/>

    <section id="information" className={styles.information} data-figma-node="929:3737" aria-labelledby="information-title">
      <h2 id="information-title">INFORMATION</h2>
      <h3>매장 내부</h3>
      <div className={styles.interior}><img src={arvoInterior[0].src} alt={arvoInterior[0].alt} width="382" height="257" loading="lazy"/><div>{arvoInterior.slice(1).map((photo,index)=><img key={photo.src} src={photo.src} alt={photo.alt} width={[119,121,126][index]} height={[169,169,168][index]} loading="lazy"/>)}</div></div>
      <div className={styles.social}><h3>SNS</h3><ul>
        <li><button type="button" disabled><img src={localAsset('kakao-original.svg')} alt="" width="32" height="32"/><span>카카오톡 오픈 채팅</span></button></li>
        <li><button type="button" disabled><span className={styles.naver}><img src={localAsset('naver-mark.svg')} alt="" width="14" height="14"/></span><span>네이버 블로그</span></button></li>
        <li><button type="button" disabled><img src={localAsset('instagram.svg')} alt="" width="31.0085" height="31"/><span>인스타그램</span></button></li>
      </ul></div>
    </section>
    <footer className={styles.booking}><BookingLink/></footer>
  </main>;
}

function DesignerRow({person}:{person:ArvoDesigner}){
  return <article className={styles.designerRow}>
    <Link className={styles.designerIdentity} href={`/designers/${person.id}`}><img src={person.image} alt={`${person.name} ${person.title}`} width="64" height="76"/><span><span className={styles.designerName}><strong>{person.name} {person.title}</strong><small>{offDaysLabel(person)}</small></span><span className={styles.specialty}>{person.specialty}</span></span></Link>
    {person.id==='yoona'
      ?<Link className={styles.reserveDesigner} href={`/reservation/${person.id}/service`} aria-label={`${person.name} ${person.title} 예약하기`}>예약하기</Link>
      :<button type="button" className={styles.reserveDesigner} disabled aria-label={`${person.name} ${person.title} 예약하기`}>예약하기</button>}
  </article>;
}

export function ArvoDesignersPage(){
  const groups=[{title:'컬과 볼륨을 더하고 싶다면',ids:['sohee','hana']},{title:'층·끝선을 바꾸고 싶다면',ids:['soyul']},{title:'맨즈 스타일을 찾는다면',ids:['gyunghyun','jonghun']}];
  return <main id="main" className={`${styles.page} ${styles.teamPage}`} data-figma-node="929:3947">
    <SalonHeader title="아르보 성수 디자이너" back="/salons/arvo"/>
    <div className={styles.teamContent}>
      <h1>같은 공간,<br/>서로 다른 강점</h1>
      <p className={styles.teamIntro}>아르보 성수 · 6명의 디자이너<br/>전문 분야를 보고 상담·예약을 시작해 보세요.</p>
      <section className={styles.recommended}><h2>내 취향에서 먼저 살펴볼 디자이너</h2><DesignerRow person={findArvoDesigner('yoona')!}/></section>
      {groups.map(group=><section className={styles.designerGroup} key={group.title}><h2>{group.title}</h2><div>{group.ids.map(id=><DesignerRow key={id} person={findArvoDesigner(id)!}/>)}</div></section>)}
    </div>
  </main>;
}

export function ArvoReviewsPage(){
  return <main id="main" className={styles.page}><SalonHeader title="아르보 성수 후기" back="/salons/arvo#reviews"/><ReviewSection data={arvoReviews}/><footer className={styles.booking}><Link className={`${styles.bookingLink} primary-cta`} href="/salons/arvo#reviews">매장 상세로 돌아가기</Link></footer></main>;
}
