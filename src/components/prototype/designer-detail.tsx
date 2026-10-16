'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {useNickname} from '@/lib/use-nickname';
import {HeaderBackIcon} from '@/components/primitives';
import {asset,findItem,salons,services} from '@/lib/prototype/catalog';
import {recommend} from '@/lib/prototype/logic';
import {SaveButton} from './shared';
import {usePrototype} from './store';
import styles from './designer-detail.module.css';
import {ReviewSection} from './reviews';
import {designerReviews} from '@/lib/prototype/reviews';

const profileTags=['꼼꼼한 상담','편안한 소통','세심한 시술'];
// Figma prototype comparison pairs. These images illustrate the matching UX only.
const matchComparisons=[
  {work:'5a15e.png',saved:'ad0de.png',tags:['긴 기장','가벼운 레이어','자연스러운 볼륨']},
  {work:'f66bd.png',saved:'d7b6a.png',tags:['긴 기장','웨이브','풍성한 볼륨']},
  {work:'bd491.png',saved:'31628.png',tags:['짧은 기장','얼굴선 레이어','차분한 실루엣']},
];
const designerSectionIds=['match','works','service','reviews','salon'] as const;
const stickyNavigationOffset=64+68; // Header plus section navigation, including its 20px bottom padding.

export function DesignerPage({id}:{id:string}){
  const router=useRouter();
  const {state,update}=usePrototype();
  const userName=useNickname();
  const [matchIndex,setMatchIndex]=useState(0);
  const [activeSection,setActiveSection]=useState<string>('match');
  const touchStartX=useRef<number|null>(null);
  const stepMatch=(direction:number)=>setMatchIndex(index=>(index+direction+matchComparisons.length)%matchComparisons.length);
  useEffect(()=>{
    // Keep the tab underline in sync with the section currently below the sticky nav.
    const updateActiveSection=()=>{
      let current='match';
      for(const sectionId of designerSectionIds){
        const section=document.getElementById(sectionId);
        if(section&&section.getBoundingClientRect().top<=stickyNavigationOffset+4)current=sectionId;
      }
      // The salon is near the page end and may not reach the sticky bar on short pages.
      if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-2&&document.getElementById('salon'))current='salon';
      setActiveSection(previous=>previous===current?previous:current);
    };
    window.addEventListener('scroll',updateActiveSection,{passive:true});
    updateActiveSection();
    return()=>window.removeEventListener('scroll',updateActiveSection);
  },[]);
  const item=findItem('designer',id);
  useEffect(()=>{if(item)update(current=>({...current,recent:[`designer:${id}`,...current.recent.filter(value=>value!==`designer:${id}`)].slice(0,30)}));},[id,item,update]);
  if(!item)return <main id="main" className={styles.missing}><p>이 디자이너를 찾을 수 없어요.</p><Link href="/explore?category=designer">디자이너 탐색으로</Link></main>;
  const salon=salons.find(candidate=>candidate.id===item.salonId);
  const result=recommend(state.matching,state.preferences).find(entry=>entry.designer.id===item.id);
  const hero=item.id==='sohee'?asset('a91f5.png'):item.image;
  const reviewCount=item.id==='sohee'?513:623;
  const introduction=`“ 작은 변화로도, 고객님의 가장 자연스러운 매력을 찾을 수 있도록 함께 고민하는 ${item.name} 디자이너입니다. ”`;
  const userLabel=`${userName}님이`;
  const matchComparison=matchComparisons[matchIndex];

  return <main id="main" className={styles.page}>
    <header className={`${styles.header} hairus-page-header`}>
      <button type="button" className="hairus-header-back" aria-label="이전 화면" onClick={()=>window.history.length>1?router.back():router.push('/recommendation/results')}><HeaderBackIcon/></button>
      <span>{item.id==='yoona'?'윤아 디자이너':'디자이너'}</span>
      <div className={styles.saveControl}><SaveButton item={item}/></div>
    </header>

    <img className={styles.hero} src={hero} alt={`${item.name} 디자이너 대표 작업`}/>

    <section className={styles.profile} aria-labelledby="designer-name">
      <h1 id="designer-name">{item.english}</h1>
      <h2>{item.name} · {salon?.name||item.location}</h2>
      <div className={styles.tags}>{profileTags.map(tag=><span key={tag}>{tag}</span>)}</div>
      <div className={styles.identity}>
        <Link href={`/designers/${item.id}/reviews`}>★ 4.9&nbsp; · &nbsp;리뷰 {reviewCount}</Link>
        <p>{introduction}</p>
      </div>
    </section>

    <nav className={styles.sectionNav} aria-label="디자이너 상세 섹션">
      <a href="#match" aria-current={activeSection==='match'?'location':undefined} onClick={()=>setActiveSection('match')}>매칭</a>
      <a href="#works" aria-current={activeSection==='works'?'location':undefined} onClick={()=>setActiveSection('works')}>스타일</a>
      <a href="#service" aria-current={activeSection==='service'?'location':undefined} onClick={()=>setActiveSection('service')}>메뉴</a>
      <a href="#reviews" aria-current={activeSection==='reviews'?'location':undefined} onClick={()=>setActiveSection('reviews')}>후기</a>
      <a href="#salon" aria-current={activeSection==='salon'?'location':undefined} onClick={()=>setActiveSection('salon')}>살롱</a>
    </nav>

    <section id="match" className={styles.match} aria-labelledby="match-title">
      <h2 id="match-title">WHY WE MATCH</h2>
      <p>{userLabel} 저장한 스타일과 {item.name} 디자이너의 작업에서<br/>공통된 디테일을 발견했어요.</p>
      <div className={styles.matchImages} role="group" aria-label={result?.reasons.join(' ')||`${item.name} 디자이너 추천 비교`}
        onTouchStart={event=>{touchStartX.current=event.touches[0]?.clientX??null;}}
        onTouchEnd={event=>{
          if(touchStartX.current===null)return;
          const distance=event.changedTouches[0].clientX-touchStartX.current;
          touchStartX.current=null;
          if(Math.abs(distance)>40)stepMatch(distance<0?1:-1);
        }}
        onTouchCancel={()=>{touchStartX.current=null;}}>
        <figure><figcaption>{item.name} 디자이너의 실제 작업</figcaption><img src={asset(matchComparison.work)} alt={`${item.name} 디자이너의 실제 작업 예시`}/></figure>
        <figure><figcaption>내가 저장한 스타일</figcaption><img src={asset(matchComparison.saved)} alt="저장한 스타일 비교 예시"/></figure>
      </div>
      <div className={styles.matchPager} aria-label="매칭 비교 슬라이드">
        <button type="button" aria-label="이전 비교 보기" onClick={()=>stepMatch(-1)}>←</button>
        <span aria-live="polite" aria-atomic="true">{String(matchIndex+1).padStart(2,'0')} / {String(matchComparisons.length).padStart(2,'0')}</span>
        <button type="button" aria-label="다음 비교 보기" onClick={()=>stepMatch(1)}>→</button>
      </div>
      <div className={styles.tags}>{matchComparison.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
    </section>

    <section id="works" className={styles.works} aria-labelledby="works-title">
      <div><h2 id="works-title">SELECTED WORKS</h2><p>또 다른 스타일을 만나보세요</p></div>
      <Link href={`/designers/${item.id}/portfolio`}>VIEW ALL ↗</Link>
      <div className={styles.workGrid}>
        <img src={asset('bd491.png')} alt="쇼트 레이어드 스타일"/>
        <div><img src={asset('d7b6a.png')} alt="롱 레이어드 스타일 정면"/><img src={asset('f66bd.png')} alt="롱 레이어드 스타일 뒷모습"/></div>
      </div>
    </section>

    <section id="service" className={styles.serviceSection} aria-labelledby="service-title">
      <div className={styles.sectionHeading}><h2 id="service-title">SERVICE &amp; PRICE</h2><p>시술과 가격을 확인해 보세요.</p></div>
      <div className={styles.serviceList}>{services.map((service,index)=><details className={styles.service} key={service.id} open={index===0}>
        <summary><span>{service.name}</span><span>{service.price.toLocaleString()}원{index>0?' ~':''}<i aria-hidden="true"/></span></summary>
        <div className={styles.serviceBody}>
          <p>{service.description}</p>
          <dl><div><dt><img src={asset('b5458.svg')} alt=""/>소요 시간</dt><dd>{service.minutes}분</dd></div><div><dt><span aria-hidden="true">＄</span>기장 추가</dt><dd>없음</dd></div></dl>
          <Link href={`/reservation/${item.id}/service?service=${service.id}`}>이 시술 예약하기</Link>
        </div>
      </details>)}</div>
    </section>

    <ReviewSection data={designerReviews(item.id,item.name)} allReviewsHref={`/designers/${item.id}/reviews`} variant="refined"/>

    {salon&&<section id="salon" className={styles.salon} aria-labelledby="salon-title">
      <h2 id="salon-title">THE SALON</h2>
      <img src={salon.image} alt={salon.name}/>
      <h3>{salon.name}</h3><p>{salon.location}</p>
      <Link className={styles.textLink} href={`/salons/${salon.id}`}>자세히 보기 →</Link>
    </section>}

    <div className={styles.booking}><Link className="primary-cta" href={`/reservation/${item.id}/service`}>예약하기</Link></div>
  </main>;
}
