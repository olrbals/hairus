'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {BottomNav} from '@/components/bottom-nav';
import {SectionHeading} from '@/components/primitives';

import {
  asset,
  homeDiscoverStyles,
} from '@/lib/prototype/catalog';

import {Card} from './shared';
import {MagazineCarousel} from './magazine-carousel';
import {HomePopup} from './home-popup';
import {usePrototype} from './store';

const discoverOrder = homeDiscoverStyles.filter(s=>s.id!=='fringe'&&s.id!=='discover-hush');
discoverOrder.splice(5,0,homeDiscoverStyles.find(s=>s.id==='fringe')!);
discoverOrder.push(homeDiscoverStyles.find(s=>s.id==='discover-hush')!);

const homePopularDesigners: {
  name: string;
  image: string;
  specialty: string;
  salon: string;
  href?: string;
}[] = [
  {
    name: "윤아",
    image: "31628.png",
    specialty: "레이어드컷 · 샌드펌",
    salon: "아르보 성수",
    href: "/designers/yoona",
  },
  {
    name: "지수",
    image: "d9387.png",
    specialty: "허쉬컷 · 히피펌",
    salon: "준오헤어 신논현점",
  },
  {
    name: "경현",
    image: "3a62b.png",
    specialty: "허쉬컷 · 매트브라운",
    salon: "아르보 성수",
  },
  {
    name: "세은",
    image: "2dae9.png",
    specialty: "테슬컷 · 컬러리스트",
    salon: "청아하다 광교",
  },
];

export function Home(){
 const seatIntroRef=useRef<HTMLDivElement>(null);
 const focusCardRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const intro=seatIntroRef.current;
  if(!intro)return;
  const lines=Array.from(intro.querySelectorAll<HTMLElement>('.home-seat-lines > span'));
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let frame=0;
  const update=()=>{
   const rect=intro.getBoundingClientRect();
   const viewport=window.innerHeight;
   const progress=Math.max(0,Math.min(1,(viewport*.8-rect.top)/(viewport*.6)));
   lines.forEach((line,index)=>{
    const filled=Math.max(0,Math.min(1,progress*lines.length-index));
    line.style.opacity=String(.4+.6*filled);
   });
  };
  const schedule=()=>{
   if(frame)return;
   frame=window.requestAnimationFrame(()=>{frame=0;update();});
  };
  update();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  return ()=>{window.cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);lines.forEach(line=>line.style.removeProperty('opacity'));};
 },[]);
 const discoverTrack=useRef<HTMLDivElement>(null);const moveDiscover=(direction:-1|1)=>{const track=discoverTrack.current;if(!track)return;const first=track.firstElementChild as HTMLElement|null;const gap=parseFloat(getComputedStyle(track).gap)||0;track.scrollBy({left:direction*((first?.getBoundingClientRect().width||track.clientWidth)+gap),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};const {state,update,ready}=usePrototype();const [popup,setPopup]=useState(false);const [popupSlide,setPopupSlide]=useState(0);const [today,setToday]=useState('');useEffect(()=>{setToday(new Date().toLocaleDateString('en-CA'));},[]);useEffect(()=>{
  if(!ready||!today||state.popupDay===today)return;
  try{if(sessionStorage.getItem('hairus.popup.seen'))return;}catch{/* Storage may be unavailable. */}
  const focus=focusCardRef.current;
  if(!focus)return;
  const showPopup=()=>{
   try{if(sessionStorage.getItem('hairus.popup.seen'))return;}catch{/* Continue for this visit. */}
   setPopup(true);
  };
  if(typeof IntersectionObserver==='undefined'){
   const onScroll=()=>{
    const rect=focus.getBoundingClientRect(),middle=window.innerHeight*.5;
    if(rect.top<=middle&&rect.bottom>=middle){window.removeEventListener('scroll',onScroll);showPopup();}
   };
   window.addEventListener('scroll',onScroll,{passive:true});
   onScroll();
   return ()=>window.removeEventListener('scroll',onScroll);
  }
  // Opening waits until In Focus reaches the middle area of the viewport.
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();showPopup();}
  },{rootMargin:'-30% 0px -30% 0px',threshold:.3});
  observer.observe(focus);
  return ()=>observer.disconnect();
 },[ready,today,state.popupDay]);function close(){setPopup(false);try{sessionStorage.setItem('hairus.popup.seen','1');}catch{}}return <><main id="main" className="prototype"><section className="hero"><img src={asset('d3c23.png')} alt="HAIRUS 커버 헤어 스타일"/><span className="wordmark hero-logo">HAIRUS</span><div className="hero-copy"><h1>HAIR IS<br/>WHO WE ARE</h1><p>우리의 취향을 가장 우리답게</p></div></section><section className="home-section"><SectionHeading title="In Focus" description="지금 주목해야 할 헤어스타일"/>
<div className="in-focus-card" ref={focusCardRef}>
  <Link href="/in-focus/soft-bob">
    <img
      className="editorial-photo"
      src={asset('83c13.png')}
      alt="소프트 보브"
    />
    <div className="in-focus-caption">
      <strong>짧은 기장, 부드러운 웨이브</strong>
      <span>Soft bob · Shape</span>
    </div>
  </Link>
</div>
</section>

<section className="home-section home-discover">
  <SectionHeading
    title="More to Discover"
    description="몰랐던 나의 취향을 발견하다"
    action={<Link className="view-link" href="/explore">View all ↗</Link>}
  />

  <div
    className="horizontal-cards"
    ref={discoverTrack}
    onMouseDown={(e) => {
      if (e.button !== 0) return;

      const el = e.currentTarget;
      el.dataset.dragging = "true";
      el.dataset.startX = String(e.clientX);
      el.dataset.startScrollLeft = String(el.scrollLeft);
      el.dataset.dragMoved = "false";
    }}
    onMouseMove={(e) => {
      const el = e.currentTarget;

      if (el.dataset.dragging !== "true") return;

      if ((e.buttons & 1) === 0) {
        el.dataset.dragging = "false";
        el.style.scrollSnapType = "";
        return;
      }

      const distance = e.clientX - Number(el.dataset.startX);

      if (Math.abs(distance) <= 6) return;

      el.dataset.dragMoved = "true";
      el.style.scrollSnapType = "none";
      el.scrollLeft =
        Number(el.dataset.startScrollLeft) - distance;
    }}
    onMouseUp={(e) => {
      e.currentTarget.dataset.dragging = "false";
      e.currentTarget.style.scrollSnapType = "";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.dataset.dragging = "false";
      e.currentTarget.style.scrollSnapType = "";
    }}
    onDragStartCapture={(e) => {
      e.preventDefault();
    }}
    onClickCapture={(e) => {
      if (e.currentTarget.dataset.dragMoved === "true") {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.dataset.dragMoved = "false";
      }
    }}
  >
    {discoverOrder.map((s) => (
      <Card key={s.id} item={s} linked={['airy','tassel','sand'].includes(s.id)} showSave={false} />
    ))}
  </div>
  <div className="banner-controls" aria-label="More to Discover 카드 이동"><span className="sr-only">좌우 화살표로 스타일 카드를 이동할 수 있어요.</span><button type="button" aria-label="이전 스타일" onClick={()=>moveDiscover(-1)}>←</button><button type="button" aria-label="다음 스타일" onClick={()=>moveDiscover(1)}>→</button></div>
 </section>

  <section className="home-section home-magazine"><SectionHeading title="Magazine" description="당신의 스타일링을 위한 헤어 가이드" action={<Link className="view-link" href="/magazine">View all ↗</Link>}/>

<MagazineCarousel/></section><section className="home-section home-seat">
  <div className="home-seat-intro" ref={seatIntroRef}>
    <h2 className="section-title">A Seat for You</h2>
    <p className="home-seat-lines">
      <span>변화는 한 자리에 앉는 순간부터 시작됩니다.</span>
      <span>어떤 모습이 되고 싶은지,</span>
      <span>어떤 분위기가 나다운지</span>
      <span>오늘 당신을 위한 자리에 앉아보세요.</span>
    </p>
  </div>
  <div className="home-seat-photo">
    <img src={asset("4401b.png")} alt="나를 위한 살롱의 자리" />
  </div>
  <div className="home-seat-designers">
    <header className="home-seat-designers-heading">
      <h3>Popular Designers</h3>
      <p>지금 가장 많이 찾는 디자이너를 만나보세요</p>
    </header>

<div
  className="home-seat-designers-track"
  aria-label="인기 디자이너"
  onMouseDown={(e) => {
    if (e.button !== 0) return;

    const el = e.currentTarget;
    el.dataset.dragging = "true";
    el.dataset.startX = String(e.clientX);
    el.dataset.startScrollLeft = String(el.scrollLeft);
    el.dataset.dragMoved = "false";
  }}
  onMouseMove={(e) => {
    const el = e.currentTarget;

    if (el.dataset.dragging !== "true") return;

    if ((e.buttons & 1) === 0) {
      el.dataset.dragging = "false";
      return;
    }

    const distance = e.clientX - Number(el.dataset.startX);

    if (Math.abs(distance) <= 6) return;

    el.dataset.dragMoved = "true";
    el.style.scrollSnapType = "none";
    el.scrollLeft =
      Number(el.dataset.startScrollLeft) - distance;
  }}
  onMouseUp={(e) => {
    e.currentTarget.dataset.dragging = "false";
    e.currentTarget.style.scrollSnapType = "";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.dataset.dragging = "false";
    e.currentTarget.style.scrollSnapType = "";
  }}
  onDragStartCapture={(e) => {
    e.preventDefault();
  }}
  onClickCapture={(e) => {
    if (e.currentTarget.dataset.dragMoved === "true") {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.dataset.dragMoved = "false";
    }
  }}
>

      {homePopularDesigners.map((designer) => {
        const identity = (
          <>
            <img className="home-seat-designer-photo" src={asset(designer.image)} alt={`${designer.name} 디자이너`} loading="lazy" />
            <span className="home-seat-designer-name">{designer.name}</span>
          </>
        );
        return (
          <article className="home-seat-designer-card" key={designer.name}>
            {designer.href ? (
              <Link className="home-seat-designer-identity" href={designer.href}>{identity}</Link>
            ) : (
              <div className="home-seat-designer-identity">{identity}</div>
            )}
            <p>{designer.specialty}<br />{designer.salon}</p>
          </article>
        );
      })}
    </div>
  </div>
</section>
<section className="match-banner" aria-labelledby="match-banner-title">
  <div className="match-banner-copy">
    <h2 id="match-banner-title">Meet Your Match</h2>
    <p>The right style. The right designer.<br />Just for you.</p>
  </div>
  <Link className="match-banner-cta" href="/recommendation/intro">
    <span>맞춤 추천 받기</span>
    <span className="match-banner-cta-arrow" aria-hidden="true">↗</span>
  </Link>
</section></main><BottomNav active="/home"/>
<HomePopup
  open={popup}
  slide={popupSlide}
  onSlideChange={setPopupSlide}
  onClose={close}
  onDismissToday={() => {
    update(s => ({ ...s, popupDay: today }));
    close();
  }}
/>
</>;}
