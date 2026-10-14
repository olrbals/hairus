'use client';

import Link from 'next/link';
import {useState} from 'react';
import './popup-detail.css';

const base = '/assets/figma/popup-detail/';
const experiences = [
  {title:'DISCOVER', copy:<>나의 모발과 취향을<br/>살펴보고, 지금 나에게<br/>어울리는 헤어 무드를<br/>찾아보세요.</>, image:'discover.png', alt:'헤어스타일을 탐색하는 세 가지 헤어 무드'},
  {title:'TRY', copy:<>차홍의 스타일러와<br/>케어 제품으로 나만의<br/>스타일링을 경험해보세요.</>, image:'try.png', alt:'차홍 헤어 케어 제품', flip:true},
  {title:'TOUCH', copy:<>컬과 볼륨, 텍스처.<br/>직접 만져보며 차이를<br/>느껴보세요.</>, image:'touch.png', alt:'헤어 스타일링 체험',},
  {title:'SAVE', copy:<>오늘의 경험을<br/>카드 안에 담고<br/>언제든지 확인해보세요.</>, image:'save.png', alt:'팝업 경험을 기록하는 카드',flip:true}
];

export function PopupDetail() {
  const [notice,setNotice] = useState<'coupon'|'session'|null>(null);
  return <main className="hairus-popup-detail">
    <header className="pd-header"><Link href="/home" aria-label="홈으로 돌아가기" className="pd-back">‹</Link><span>POPUP 공지</span><span aria-hidden="true"/></header>
    <section className="pd-hero" aria-label="HAIRUS 차홍룸 팝업">
      <h1>HAIRUS ×<br/>CHAHONG ROOM</h1>
      <img src={base+'hero.png'} alt="차홍룸 팝업 매장 조감도" className="pd-hero-image"/>
      <div className="pd-hero-bottom"><span>POP-UP / SEONGSU, SEOUL</span><strong>11.06</strong></div>
    </section>
    <section className="pd-experience">
      <h2>From screen to real</h2>
      <div className="pd-experience-list">{experiences.map(e=><article key={e.title} className={'pd-experience-item'+(e.flip?' pd-flip':'')}>
        <img src={base+e.image} alt={e.alt}/>
        <div className="pd-experience-copy"><h3>{e.title}</h3><p>{e.copy}</p></div>
      </article>)}</div>
    </section>
    <section className="pd-benefits" aria-label="팝업 특별 혜택">
      <div className="pd-benefit"><img src={base+'benefit1.png'} alt="HAIRUS 앱 다운로드 시 차홍 제품 15% 할인 안내"/><button aria-label="15% 할인 쿠폰 받기 안내" onClick={()=>setNotice('coupon')}/></div>
      <div className="pd-benefit"><img src={base+'benefit2.png'} alt="차홍룸 디자이너 1대1 헤어 컨설팅 응모 안내"/><button aria-label="디자이너 세션 응모 안내" onClick={()=>setNotice('session')}/></div>
    </section>
    <section className="pd-coming"><h2>Coming Soon</h2><p>11.06 — 11.20 / SEONGSU, SEOUL</p>
      <img className="pd-space-wide" src={base+'space1.png'} alt="팝업 매장 조감도"/>
      <div className="pd-space-row"><img src={base+'space2.png'} alt="차홍룸 팝업 내부 공간"/><img src={base+'space3.png'} alt="HAIRUS 차홍룸 외부 전경"/></div>
      <span className="pd-space-caption">A SPACE FOR YOU</span>
    </section>
    <footer className="pd-footer"><h2>Your style,<br/>in real life</h2><p>HAIRUS를 성수에서 경험해보세요.</p><small>11.06 — 11.20 / SEONGSU, SEOUL<br/>12:00 — 20:00 · 예약 없이 자유롭게 입장</small></footer>
    {notice&&<div className="pd-dialog-backdrop" onClick={()=>setNotice(null)}><section role="dialog" aria-modal="true" aria-label="팝업 혜택 안내" className="pd-dialog" onClick={e=>e.stopPropagation()}><button className="pd-dialog-close" onClick={()=>setNotice(null)} aria-label="닫기">×</button><h2>{notice==='coupon'?'15% 할인 쿠폰':'디자이너 세션'}</h2><p>{notice==='coupon'?'팝업 현장 구매 한정 혜택입니다. 실제 쿠폰 발급 기능은 준비 중입니다.':'1:1 헤어 컨설팅은 추첨을 통해 진행됩니다. 실제 응모 기능은 준비 중입니다.'}</p><button className="pd-dialog-confirm" onClick={()=>setNotice(null)}>확인</button></section></div>}
  </main>;
}
