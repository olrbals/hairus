'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {BottomNav} from '@/components/bottom-nav';
import {SectionHeading} from '@/components/primitives';

import {
  asset,
  homeDiscoverStyles,
  articles,
  inFocusStyle
} from '@/lib/prototype/catalog';

import {Action,Card} from './shared';
import {HomePopup} from './home-popup';
import {usePrototype} from './store';

const discoverOrder = homeDiscoverStyles.filter(s=>s.id!=='fringe'&&s.id!=='discover-hush');
discoverOrder.splice(5,0,homeDiscoverStyles.find(s=>s.id==='fringe')!);
discoverOrder.push(homeDiscoverStyles.find(s=>s.id==='discover-hush')!);

const magazineCopy = [
  {
    title: "머릿결에도 루틴이 필요해",
    subtitle: "집에서도 실천할 수 있는 헤어케어 노하우",
  },
  {
    title: "드라이만 잘 해도 달라지는 스타일",
    subtitle: "집에서도 쉽게 따라하는 볼륨 드라이 방법",
  },
  {
    title: "처음 색 그대로, 염색 후 오래 유지하기",
    subtitle: "컬러가 쉽게 빠지지 않는 데일리 케어 팁",
  },
  {
    title: "나에게 어울리는 앞머리는 따로 있다",
    subtitle: "얼굴형과 분위기에 따라 달라지는 앞머리 선택법",
  },
];

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

export function Home(){const {state,update,ready}=usePrototype();const [popup,setPopup]=useState(false);const [banner,setBanner]=useState(0);const [popupSlide,setPopupSlide]=useState(0);const [today,setToday]=useState('');useEffect(()=>{setToday(new Date().toLocaleDateString('en-CA'));},[]);useEffect(()=>{if(ready&&today&&state.popupDay!==today){try{if(!sessionStorage.getItem('hairus.popup.seen'))setPopup(true);}catch{setPopup(true);}}},[ready,today,state.popupDay]);function close(){setPopup(false);try{sessionStorage.setItem('hairus.popup.seen','1');}catch{}}return <><main id="main" className="prototype"><section className="hero"><img src={asset('d3c23.png')} alt="HAIRUS 커버 헤어 스타일"/><span className="wordmark hero-logo">HAIRUS</span><div className="hero-copy"><h1>HAIR IS<br/>WHO WE ARE</h1><p>우리의 취향을 가장 우리답게</p></div></section><section className="home-section"><SectionHeading title="In Focus" description="지금 주목해야 할 헤어스타일"/>
<div className="in-focus-card">
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
  />

  <div
    className="horizontal-cards"
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
      <Card key={s.id} item={s} linked={['airy','tassel','sand'].includes(s.id)} />
    ))}
  </div>

  <Action secondary href="/explore">
    Explore all styles →
  </Action>
</section>

  <section className="home-section home-magazine"><SectionHeading title="Magazine" description="당신의 스타일링을 위한 헤어 가이드" action={<Link className="view-link" href="/magazine">View all ↗</Link>}/>

<div
  className="magazine-track"
  onPointerDown={(e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const el = e.currentTarget;
    el.dataset.startX = String(e.clientX);
    el.dataset.startY = String(e.clientY);
    el.dataset.swipeReady = "true";
    el.dataset.dragMoved = "false";
  }}

onPointerMove={(e) => {
  const el = e.currentTarget;

  if (el.dataset.swipeReady !== "true") return;

  const dx = e.clientX - Number(el.dataset.startX);
  const dy = e.clientY - Number(el.dataset.startY);

  if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
    if (!el.hasPointerCapture(e.pointerId)) {
      el.setPointerCapture(e.pointerId);
    }
  }
}}

  onPointerUp={(e) => {
    const el = e.currentTarget;

    if (el.dataset.swipeReady !== "true") return;
    el.dataset.swipeReady = "false";

    const dx = e.clientX - Number(el.dataset.startX);
    const dy = e.clientY - Number(el.dataset.startY);

    if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy)) {
      return;
    }

    el.dataset.dragMoved = "true";

    setBanner((prev) =>
      (prev + (dx < 0 ? 1 : -1) + articles.length) %
      articles.length
    );
  }}
  onPointerCancel={(e) => {
    e.currentTarget.dataset.swipeReady = "false";
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

  {[banner, (banner + 1) % articles.length].map(
    (index, position) => (
      <Link
        key={articles[index].id}
        href={`/articles/${articles[index].id}`}
className={`magazine-card magazine-card--${articles[index].id} ${
  position === 0
    ? "magazine-card--active"
    : "magazine-card--peek"
}`}

      >
        <img
          src={articles[index].image}
          alt={magazineCopy[index].title}
          draggable={false}
        />

        <div className="magazine-caption">
          <h3>{magazineCopy[index].title}</h3>
          <p>{magazineCopy[index].subtitle}</p>
        </div>
      </Link>
    )
  )}
</div>
<div className="banner-controls"><button aria-label="이전 배너" onClick={()=>setBanner((banner+articles.length-1)%articles.length)}>←</button><button aria-label="다음 배너" onClick={()=>setBanner((banner+1)%articles.length)}>→</button></div></section><section className="home-section home-seat">
  <div className="home-seat-intro">
    <h2 className="section-title">A Seat for You</h2>
    <p>
      변화는 한 자리에 앉는 순간부터 시작됩니다.
      <br />
      <br />
      어떤 모습이 되고 싶은지,
      <br />
      어떤 분위기가 나다운지
      <br />
      <br />
      오늘 당신을 위한 자리에 앉아보세요.
    </p>
  </div>
  <Link className="home-seat-photo" href="/salons/arvo" aria-label="아르보 성수 살롱 자세히 보기">
    <img src={asset("4401b.png")} alt="나를 위한 살롱의 자리" />
  </Link>
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
    맞춤 추천 받기
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
