'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {BottomNav} from '@/components/bottom-nav';
import {SectionHeading} from '@/components/primitives';
import {asset,styles,designers,salons,articles} from '@/lib/prototype/catalog';
import {Action,Card,Cards} from './shared';
import {HomePopup} from './home-popup';
import {usePrototype} from './store';
export function Home(){const {state,update,ready}=usePrototype();const [popup,setPopup]=useState(false);const [banner,setBanner]=useState(0);const [popupSlide,setPopupSlide]=useState(0);const [today,setToday]=useState('');useEffect(()=>{setToday(new Date().toLocaleDateString('en-CA'));},[]);useEffect(()=>{if(ready&&today&&state.popupDay!==today){try{if(!sessionStorage.getItem('hairus.popup.seen'))setPopup(true);}catch{setPopup(true);}}},[ready,today,state.popupDay]);function close(){setPopup(false);try{sessionStorage.setItem('hairus.popup.seen','1');}catch{}}return <><main id="main" className="prototype"><section className="hero"><img src={asset('d3c23.png')} alt="HAIRUS 커버 헤어 스타일"/><span className="wordmark hero-logo">HAIRUS</span><div className="hero-copy"><h1>HAIR IS<br/>WHO WE ARE</h1><p>우리의 취향을 가장 우리답게</p></div></section><section className="home-section"><SectionHeading title="In Focus" description="이번 주, 눈길이 머무는 스타일." action={<Link className="view-link" href="/in-focus/soft-bob">View ↗</Link>}/><Link href="/in-focus/soft-bob"><img className="editorial-photo" src={asset('83c13.png')} alt="소프트 보브"/><p className="caption-row">SOFT EXPRESSION ↗</p></Link></section><section className="home-section"><SectionHeading title="More to Discover" description="익숙한 취향 너머, 새로운 발견."/><div className="horizontal-cards">{styles.slice(0,4).map(s=><Card key={s.id} item={s}/>)}</div><Action secondary href="/explore">Explore all styles →</Action></section><section className="home-section"><SectionHeading title="Magazine" description="취향을 만드는 이야기." action={<Link className="view-link" href="/magazine">View all ↗</Link>}/><Link href={`/articles/${articles[banner].id}`}><img className="editorial-photo" src={articles[banner].image} alt={articles[banner].title}/><h3>{articles[banner].title}</h3><p>{articles[banner].subtitle}</p></Link><div className="banner-controls"><button aria-label="이전 배너" onClick={()=>setBanner((banner+articles.length-1)%articles.length)}>←</button><span>0{banner+1} / 0{articles.length}</span><button aria-label="다음 배너" onClick={()=>setBanner((banner+1)%articles.length)}>→</button></div></section><section className="home-section home-seat"><h2 className="section-title">A Seat for You</h2><p>변화는 한 자리에 앉는 순간부터 시작됩니다.<br/>오늘 당신을 위한 자리에 앉아보세요.</p><Link href="/salons/arvo"><img src={asset('4401b.png')} alt="나를 위한 살롱의 자리"/></Link><Action secondary href="/explore?category=salon">헤어샵 둘러보기 →</Action></section><section className="home-section"><SectionHeading title="People & Layers" description="마음에 든 스타일, 그 끝을 만든 사람."/><Cards items={designers}/><Action secondary href="/explore?category=designer">디자이너 모두 보기 →</Action></section><section className="home-section"><SectionHeading title="The Salon" description="취향이 머무는 공간."/><Card item={salons[0]}/></section><section className="match-banner"><h2>Meet Your Match</h2><p>당신의 취향을 이해하는 디자이너를 만나보세요.</p><Action href="/recommendation/intro">디자이너 추천 받기</Action><Action secondary href="/preferences/intro">나의 취향 알아보기</Action></section></main><BottomNav active="/home"/>
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
