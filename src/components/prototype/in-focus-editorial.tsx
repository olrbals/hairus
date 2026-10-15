'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {BottomNav} from '@/components/bottom-nav';
import {EditorialBookmarkButton} from './editorial-bookmark';
import {findEditorial} from '@/lib/prototype/editorials';
import bookmark from './editorial-bookmark.module.css';
import './in-focus-editorial.css';

const imageBase = '/assets/figma/in-focus-detail/';

export function InFocusEditorial() {
  const router = useRouter();

  return <>
    <main id="main" className="ifd-page">
      <header className="ifd-header">
        <button type="button" className="ifd-back" aria-label="이전 화면으로" onClick={() => window.history.length > 1 ? router.back() : router.push('/home')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 5-7 7 7 7"/>
          </svg>
        </button>
      </header>

      <section className="ifd-opening" aria-labelledby="ifd-title">
        <div className={`ifd-cover ${bookmark.cover}`}>
          <EditorialBookmarkButton item={findEditorial('focus', 'soft-bob')!}/>
          <img className="ifd-cover-photo" src="/assets/figma/v1/83c13.png" alt="짧은 기장의 부드러운 웨이브 보브, 정면 모습" />
          <div className="ifd-cover-caption">
            <h1 id="ifd-title"><span>SOFTLY,</span><span>IN MOTION.</span></h1>
            <div className="ifd-cover-subtitle">
              <p>짧은 기장, 부드러운 웨이브</p>
              <span>SOFT BOB × HIPPIE PERM</span>
            </div>
          </div>
        </div>
        <div className="ifd-style-intro">
          <h2>단정함에 더해진 자유로움.</h2>
          <p>단정하게 떨어지는 보브의 실루엣에 히피펌 특유의 자유로운 컬을 더했습니다.</p>
          <p>짧은 기장에서 더욱 선명하게 드러나는 웨이브의 움직임. 자연스럽게 흩어지는 머릿결이 편안하면서도 감각적인 분위기를 완성합니다.</p>
        </div>
      </section>

      <section className="ifd-details" aria-labelledby="ifd-details-title">
        <div className="ifd-details-heading">
          <h2 id="ifd-details-title">ALL IN THE DETAILS.</h2>
          <p>짧은 기장 속에 담긴 섬세한 차이.</p>
        </div>

        <article className="ifd-detail-row ifd-detail-row--side">
          <img src={imageBase+'silhouette-side.png'} alt="부드러운 보브 커트의 측면 실루엣" loading="lazy" />
          <div className="ifd-detail-caption">
            <span className="ifd-ordinal">01 / SILHOUETTE</span>
            <h3>가볍게 감싸는<br/>실루엣</h3>
            <p>얼굴을 따라 부드럽게 이어지는 보브 라인.<br/>짧은 기장에 부드러운 볼륨을 더합니다.</p>
          </div>
        </article>

        <article className="ifd-detail-row ifd-detail-row--rear">
          <div className="ifd-detail-caption">
            <span className="ifd-ordinal">02 / TEXTURE</span>
            <h3>부드럽게 흩어지는 결</h3>
            <p>너무 무겁지도, 지나치게 가볍지도 않은 질감.<br/>자연스럽게 흩어지는 모발의 결이 스타일을 완성합니다.</p>
          </div>
          <img src={imageBase+'texture-rear.png'} alt="자연스러운 웨이브 텍스처의 뒷모습" loading="lazy" />
        </article>

        <article className="ifd-wave">
          <img src={imageBase+'wave-close-up.png'} alt="부드러운 보브 웨이브의 머릿결 클로즈업" loading="lazy" />
          <div className="ifd-wave-caption">
            <span className="ifd-ordinal">03 / WAVE</span>
            <h3>자유롭게 흐르는 컬</h3>
            <p>일정하게 정돈하기보다 자연스러운 움직임을 살린 웨이브.<br/>짧은 보브에 경쾌한 분위기를 더합니다.</p>
          </div>
        </article>
      </section>

      <section className="ifd-designer" aria-labelledby="ifd-designer-title">
        <div className="ifd-designer-content">
          <div className="ifd-designer-heading">
            <h2 id="ifd-designer-title">BEHIND THE STYLE.</h2>
            <p>자연스러움에 자신만의 균형을 더하는 사람.</p>
          </div>
          <div className="ifd-designer-profile">
            <img src={imageBase+'designer-sohee.png'} alt="소희 디자이너 프로필" loading="lazy" />
            <div>
              <strong>SOHEE</strong>
              <span>소희 실장 / 아르보 성수</span>
            </div>
          </div>
        </div>

        <div className="ifd-interview">
          <div className="ifd-interview-lead">
            <h3>정돈된 라인부터 자유로운 컬까지.</h3>
            <p>서로 다른 스타일 속에서 자신만의 균형을 찾아가는 소희 디자이너. HAIRUS가 그녀에게 이번 소프트 보브에 담긴 생각을 물었습니다.</p>
          </div>
          <div className="ifd-qa">
            <div className="ifd-question">
              <h4><span>Q / 01</span>짧은 보브에 히피펌을 더한 이유는 무엇인가요?</h4>
              <p>“짧은 머리에서는 컬의 움직임이 더 선명하게 보여요. 단정한 실루엣에 자유로운 웨이브를 더해 자연스러운 분위기를 표현하고 싶었어요.”</p>
            </div>
            <div className="ifd-question">
              <h4><span>Q / 02</span>이번 스타일에서 가장 중요하게 생각한 부분은요?</h4>
              <p>“컬이 과하게 부풀지 않도록 균형을 잡았어요. 얼굴 주변에는 부드러운 움직임을, 끝부분에는 자연스럽게 흩어지는 결을 살렸죠.”</p>
            </div>
          </div>
          <Link className="ifd-designer-link" href="/designers/sohee">소희 디자이너 프로필 바로가기</Link>
        </div>
      </section>

      <footer className="ifd-epilogue">
        <span>EPILOGUE</span>
        <div>
          <h2>GOOD HAIR,<br/>GOOD DAY.</h2>
          <p>좋은 머릿결은 하루아침에 완성되지 않아요.<br/>오늘의 작은 습관이 쌓여, 좋은 머릿결을 유지합니다.</p>
        </div>
      </footer>
    </main>
    <BottomNav active="/explore"/>
  </>;
}
