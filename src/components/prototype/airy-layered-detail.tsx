'use client';

import Link from 'next/link';
import {useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {BottomNav} from '@/components/bottom-nav';
import {styles} from '@/lib/prototype/catalog';
import {SaveButton} from './shared';
import './airy-layered-detail.css';

const gallery = [
  {src:'/assets/figma/v1/5582e.png',alt:'에어리 레이어드 정면 스타일'},
  {src:'/assets/figma/discover-airy/side.png',alt:'에어리 레이어드 측면 스타일'},
  {src:'/assets/figma/discover-airy/back.png',alt:'에어리 레이어드 뒷모습'},
  {src:'/assets/figma/discover-airy/other-side.png',alt:'에어리 레이어드 반대쪽 측면 스타일'},
];

const guidelines = [
  {number:'01',title:'기장은 그대로',description:'긴 기장은 유지해도 충분히 잘 어울려요.'},
  {number:'02',title:'레이어드는 가볍게',description:'가볍게 층을 내어 하관의 무게감을 덜어줘요.'},
  {number:'03',title:'레이어드 펌을 더하다',description:'얼굴선을 감싸는 자연스러운 C컬로 부드러운 실루엣을 만들어줘요.'},
];

const moreStyles = [
  {id:'sand',name:'샌드펌',image:'/assets/figma/v1/03042.png'},
  {id:'straight',name:'스트레이트 레이어드 컷',image:'/assets/figma/v1/cf399.png'},
  {id:'hush',name:'허쉬컷',image:'/assets/figma/v1/deb8c.png'},
];

export function AiryLayeredDetail() {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex,setActiveIndex] = useState(0);
  const item = styles.find(style => style.id === 'airy');

  const goTo = (index:number) => {
    const slider = sliderRef.current;
    if (!slider || index < 0 || index >= gallery.length) return;
    setActiveIndex(index);
    slider.scrollTo({left: slider.clientWidth * index,behavior:'smooth'});
  };

  const updateSlide = () => {
    const slider = sliderRef.current;
    if (!slider || !slider.clientWidth) return;
    setActiveIndex(Math.max(0,Math.min(gallery.length - 1,Math.round(slider.scrollLeft / slider.clientWidth))));
  };

  return <>
    <main id="main" className="airy-detail">
      <header className="airy-header">
        <button className="airy-back" type="button" aria-label="이전 화면으로" onClick={() => window.history.length > 1 ? router.back() : router.push('/explore')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>
        </button>
        {item&&<div className="airy-save"><SaveButton item={item}/></div>}
      </header>

      <div className="airy-heading">
        <span>STYLE 01</span>
        <h1>Airy Layered</h1>
      </div>

      <section className="airy-gallery" aria-label="에어리 레이어드 여러 각도에서 보기">
        <div className="airy-gallery-track" ref={sliderRef} onScroll={updateSlide} role="region" aria-roledescription="carousel" aria-label="스타일 사진 4장" tabIndex={0}>
          {gallery.map((photo,index)=>
            <div className="airy-slide" role="group" aria-roledescription="slide" aria-label={`${index+1} / ${gallery.length}`} key={photo.alt}>
              <img src={photo.src} alt={photo.alt} draggable={false} loading={index===0?'eager':'lazy'}/>
            </div>
          )}
        </div>
        <div className="airy-progress" role="group" aria-label="갤러리 사진 선택">
          {gallery.map((photo,index)=>
            <button type="button" key={photo.alt} className={`airy-progress-button${activeIndex===index?' is-active':''}`} aria-label={`${index+1}번째 사진 보기`} aria-pressed={activeIndex===index} onClick={()=>goTo(index)}><span/></button>
          )}
        </div>
      </section>

      <section className="airy-description" aria-labelledby="airy-story-title">
        <h2 id="airy-story-title">Airy Layered</h2>
        <p>긴 기장에 가벼운 레이어를 더한 스타일.<br/>얼굴선을 따라 자연스럽게 흐르는 층이<br/>전체 실루엣을 한층 가볍게 만들어줘요.</p>
        <span>Natural&nbsp; · &nbsp;Calm&nbsp; · &nbsp;Delicate</span>
      </section>

      <section className="airy-for-you" aria-labelledby="airy-for-title">
        <div className="airy-section-heading">
          <h2 id="airy-for-title">For You</h2>
          <p>제니님에게 맞춘 스타일 가이드</p>
        </div>
        <div className="airy-guide-list">
          {guidelines.map(guide=>
            <div className="airy-guide" key={guide.number}>
              <span className="airy-guide-number">{guide.number}</span>
              <div>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="airy-more" aria-labelledby="airy-more-title">
        <div className="airy-section-heading">
          <h2 id="airy-more-title">More Styles</h2>
          <p>많이 찾는 스타일</p>
        </div>
        <div className="airy-more-scroll" aria-label="다른 스타일 가로 탐색">
          {moreStyles.map(style=>
            <Link className="airy-more-card" href={`/styles/${style.id}`} key={style.id}>
              <img src={style.image} alt={style.name} loading="lazy"/>
              <span>{style.name}</span>
            </Link>
          )}
        </div>
      </section>
    </main>
    <BottomNav active="/explore"/>
  </>;
}
