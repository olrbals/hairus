'use client';

import Link from 'next/link';
import {useState, type CSSProperties, type ReactNode} from 'react';
import {useHorizontalScroll} from '@/lib/use-horizontal-scroll';
import {useNickname} from '@/lib/use-nickname';
import {useRouter} from 'next/navigation';
import {goBack} from '@/lib/navigation-history';
import {BottomNav} from '@/components/bottom-nav';
import {HeaderBackIcon} from '@/components/primitives';
import {styles} from '@/lib/prototype/catalog';
import {SaveButton} from './shared';
import './airy-layered-detail.css';

type StyleDetailId = 'airy' | 'tassel' | 'sand';
type GalleryPhoto = {src:string; alt:string; crop?:CSSProperties; fit?:'contain'};
type Guide = {number:string; title:string; description:string};
type DetailConfig = {label:string; title:string; gallery:GalleryPhoto[]; headline:string; description:ReactNode; keywords:string; guidelines:Guide[]; moreStyles:{id:string;name:string;image:string}[]};

const airyGallery: GalleryPhoto[] = [
  {src:'/assets/figma/v1/5582e.png',crop:undefined,alt:'에어리 레이어드 정면 스타일'},
  {src:'/assets/figma/discover-airy/angles-original.png',crop:{width:`${100 / .2367880791425705}%`,left:`${-100 * .746972918510437 / .2367880791425705}%`,top:`${-100 * -3.7201353109139745e-12}%`},alt:'에어리 레이어드 측면 스타일'},
  {src:'/assets/figma/discover-airy/angles-original.png',crop:{width:`${100 / .23675724864006042}%`,left:`${-100 * .5123750567436218 / .23675724864006042}%`,top:`${-100 * -.00013220928667578846}%`},alt:'에어리 레이어드 뒷모습'},
  {src:'/assets/figma/discover-airy/angles-original.png',crop:{width:`${100 / .2367880791425705}%`,left:`${-100 * .2630881369113922 / .2367880791425705}%`,top:`${-100 * .00021716451738029718}%`},alt:'에어리 레이어드 반대쪽 측면 스타일'},
];

const airyGuidelines: Guide[] = [
  {number:'01',title:'기장은 그대로',description:'긴 기장은 유지해도 충분히 잘 어울려요.'},
  {number:'02',title:'레이어드는 가볍게',description:'가볍게 층을 내어 하관의 무게감을 덜어줘요.'},
  {number:'03',title:'레이어드 펌을 더하다',description:'얼굴선을 감싸는 자연스러운 C컬로 부드러운 실루엣을 만들어줘요.'},
];

const airyMoreStyles = [
  {id:'sand',name:'샌드펌',image:'/assets/figma/v1/03042.png'},
  {id:'tassel',name:'테슬컷',image:'/assets/figma/v1/05be4.png'},
  {id:'straight',name:'스트레이트 레이어드 컷',image:'/assets/figma/v1/cf399.png'},
];

const details: Record<StyleDetailId, DetailConfig> = {
  airy: {label:'STYLE 01',title:'Airy Layered',gallery:airyGallery,headline:'Airy Layered',description:<>긴 기장에 가벼운 레이어를 더한 스타일.<br/>얼굴선을 따라 자연스럽게 흐르는 층이<br/>전체 실루엣을 한층 가볍게 만들어줘요.</>,keywords:'Natural  ·  Calm  ·  Delicate',guidelines:airyGuidelines,moreStyles:airyMoreStyles},
  // Figma 920:4557 — https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T?node-id=920-4557
  tassel: {label:'STYLE 01',title:'Tassel Cut',gallery:[
    {src:'/assets/figma/v1/05be4.png',crop:{width:'102.34%',height:'109%',left:'.03%',top:'-6.73%'},alt:'테슬컷 정면 스타일'},
    {src:'/assets/figma/v1/fe1ae.png',crop:{width:'300%',height:'115.45%',left:'-100%',top:'0'},alt:'테슬컷 오른쪽 스타일'},
    {src:'/assets/figma/v1/fe1ae.png',crop:{width:'300%',height:'115.45%',left:'0',top:'0'},alt:'테슬컷 뒷모습'},
    {src:'/assets/figma/v1/fe1ae.png',crop:{width:'300%',height:'115.45%',left:'-200%',top:'0'},alt:'테슬컷 왼쪽 스타일'},
  ],headline:'Simply, Defined.',description:<>군더더기 없는 실루엣과 또렷한 끝선.<br/>심플할수록 돋보이는 세련된 분위기.</>,keywords:'Clean  ·  Sleek  ·  Modern',guidelines:[
    {number:'01',title:'기장은 턱선 아래로',description:'턱선 아래로 떨어지는 길이로 얼굴선을 자연스럽게 정리해요.'},
    {number:'02',title:'끝선은 또렷하게',description:'무거운 일자 라인을 살려 깔끔한 실루엣을 만들어요.'},
    {number:'03',title:'볼륨은 차분하게',description:'옆 볼륨을 과하게 살리지 않아 시니컬한 분위기를 유지해요.'},
  ],moreStyles:[{id:'sand',name:'샌드펌',image:'/assets/figma/v1/03042.png'},{id:'straight',name:'스트레이트 레이어드 컷',image:'/assets/figma/v1/cf399.png'},{id:'hush',name:'허쉬컷',image:'/assets/figma/v1/deb8c.png'}]},
  // Figma 920:4729 — https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T?node-id=920-4729
  sand: {label:'STYLE 01',title:'Sand Perm',gallery:[
    {src:'/assets/figma/v1/03042.png',fit:'contain',alt:'샌드펌 정면 스타일'},
    {src:'/assets/figma/v1/c8564.png',crop:{width:'422.32%',height:'100%',left:'-315.46%',top:'0'},alt:'샌드펌 오른쪽 스타일'},
    {src:'/assets/figma/v1/c8564.png',crop:{width:'422.37%',height:'100%',left:'-216.41%',top:'.01%'},alt:'샌드펌 뒷모습'},
    {src:'/assets/figma/v1/c8564.png',crop:{width:'422.32%',height:'100%',left:'-111.11%',top:'-.02%'},alt:'샌드펌 왼쪽 스타일'},
  ],headline:'Softly, In Motion.',description:<>느슨하게 흐르는 웨이브와 부드러운 볼륨.<br/>자연스러운 움직임이 만드는 여유로운 분위기.</>,keywords:'Soft  ·  Flowing  ·  Relaxed',guidelines:[
    {number:'01',title:'컬은 굵고 자연스럽게',description:'느슨한 웨이브로 얼굴선을 부드럽게 감싸줘요.'},
    {number:'02',title:'볼륨은 가볍게',description:'광대부터 자연스럽게 볼륨을 더해 균형을 잡아요.'},
    {number:'03',title:'결은 부드럽게',description:'컬을 가지런히 맞추기보다 자연스럽게 흩어진 결을 살려요.'},
  ],moreStyles:[{id:'sand',name:'샌드펌',image:'/assets/figma/v1/03042.png'},{id:'straight',name:'스트레이트 레이어드 컷',image:'/assets/figma/v1/cf399.png'},{id:'hush',name:'허쉬컷',image:'/assets/figma/v1/deb8c.png'}]},
};

export function AiryLayeredDetail({styleId='airy'}:{styleId?:StyleDetailId}) {
  const router = useRouter();
  const sliderRef = useHorizontalScroll();
  const moreRef = useHorizontalScroll();
  const nickname = useNickname();
  const [activeIndex,setActiveIndex] = useState(0);
  const detail = details[styleId];
  const item = styles.find(style => style.id === styleId);

  const goTo = (index:number) => {
    const slider = sliderRef.current;
    if (!slider || index < 0 || index >= detail.gallery.length) return;
    setActiveIndex(index);
    slider.scrollTo({left: slider.clientWidth * index,behavior:'smooth'});
  };

  const updateSlide = () => {
    const slider = sliderRef.current;
    if (!slider || !slider.clientWidth) return;
    setActiveIndex(Math.max(0,Math.min(detail.gallery.length - 1,Math.round(slider.scrollLeft / slider.clientWidth))));
  };

  return <>
    <main id="main" className="airy-detail">
      <header className="airy-header hairus-page-header">
        <button className="airy-back hairus-header-back" type="button" aria-label="이전 화면으로" onClick={() => goBack(router, '/explore')}>
          <HeaderBackIcon/>
        </button>
        {item&&<div className="airy-save"><SaveButton item={item}/></div>}
      </header>

      <div className="airy-heading">
        <span>{detail.label}</span>
        <h1>{detail.title}</h1>
      </div>

      <section className="airy-gallery" aria-label={`${item?.name||detail.title} 여러 각도에서 보기`}>
        <div className="airy-gallery-track" ref={sliderRef} onScroll={updateSlide} role="region" aria-roledescription="carousel" aria-label={`스타일 사진 ${detail.gallery.length}장`} tabIndex={0}>
          {detail.gallery.map((photo,index)=>
            <div className="airy-slide" role="group" aria-roledescription="slide" aria-label={`${index+1} / ${detail.gallery.length}`} key={photo.alt}>
              <img style={photo.fit ? {...photo.crop,objectFit:photo.fit} : photo.crop} src={photo.src} alt={photo.alt} draggable={false} loading={index===0?'eager':'lazy'}/>
            </div>
          )}
        </div>
        <div className="airy-progress" role="group" aria-label="갤러리 사진 선택">
          {detail.gallery.map((photo,index)=>
            <button type="button" key={photo.alt} className={`airy-progress-button${activeIndex===index?' is-active':''}`} aria-label={`${index+1}번째 사진 보기`} aria-pressed={activeIndex===index} onClick={()=>goTo(index)}><span/></button>
          )}
        </div>
      </section>

      <section className="airy-description" aria-labelledby={`${styleId}-story-title`}>
        <h2 id={`${styleId}-story-title`}>{detail.headline}</h2>
        <p>{detail.description}</p>
        <span>{detail.keywords}</span>
      </section>

      <section className="airy-for-you" aria-labelledby={`${styleId}-for-title`}>
        <div className="airy-section-heading">
          <h2 id={`${styleId}-for-title`}>For You</h2>
          <p>{nickname}님에게 맞춘 스타일 가이드</p>
        </div>
        <div className="airy-guide-list">
          {detail.guidelines.map(guide=>
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

      <section className="airy-more" aria-labelledby={`${styleId}-more-title`}>
        <div className="airy-section-heading">
          <h2 id={`${styleId}-more-title`}>More Styles</h2>
          <p>많이 찾는 스타일</p>
        </div>
        <div className="airy-more-scroll" ref={moreRef} tabIndex={0} aria-label="다른 스타일 가로 탐색">
          {detail.moreStyles.map(style=>
            style.id==='straight' || (styleId!=='airy' && style.id==='hush') ? <div className="airy-more-card" key={style.id}><div className="airy-more-image"><img src={style.image} alt={style.name} loading="lazy" draggable={false}/></div><span>{style.name}</span></div> : <Link className="airy-more-card" href={`/styles/${style.id}`} key={style.id}>
              <div className="airy-more-image"><img src={style.image} alt={style.name} loading="lazy" draggable={false}/></div>
              <span>{style.name}</span>
            </Link>
          )}
        </div>
      </section>
    </main>
    <BottomNav active="/explore"/>
  </>;
}
