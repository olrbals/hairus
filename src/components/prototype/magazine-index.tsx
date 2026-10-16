import Link from 'next/link';
import {asset} from '@/lib/prototype/catalog';
import {PageHeader} from './page-header';
import css from './magazine-index.module.css';

export function MagazineIndex() {
  return <main id="main" className={css.page} data-figma-node="920:4397">
    <PageHeader backFallbackHref="/home"/>
    <div className={css.content}>
      <div className={css.heading}><p>HAIRUS MAGAZINE</p><h1>EDITORIAL</h1></div>
      <div className={css.stories}>
        <Link href="/articles/care" className={css.cover}>
          <div className={css.coverImage}><img src="/assets/figma/magazine/4d389.png" alt="거울 앞에서 긴 머리를 정돈하는 모습"/></div>
          <div className={css.coverCopy}><div><p className={css.volume}>VOL. 01</p><h2>머릿결에도<br/>루틴이 필요해.</h2></div><p className={css.description}>좋은 머릿결을 만드는 매일의 작은 습관.</p></div>
        </Link>
        <div className={css.grid}>
          <Link href="/articles/story" className={css.gridStory}>
            <div className={css.gridImage}><img src={asset('48a15.png')} alt="브러시와 드라이기로 볼륨을 만드는 모습" loading="lazy"/></div>
            <div><p className={css.volume}>VOL. 02</p><h2>드라이만 잘 해도<br/>달라지는 머리</h2></div>
          </Link>
          <Link href="/articles/color" className={css.gridStory}>
            <div className={`${css.gridImage} ${css.colorImage}`}><img src={asset('6b945.png')} alt="금빛으로 염색한 머리를 반묶음한 모습" loading="lazy"/></div>
            <div><p className={css.volume}>VOL. 03</p><h2>처음 색 그대로,<br/>오래 유지하는 법</h2></div>
          </Link>
        </div>
        <Link href="/articles/fringe" className={css.feature}>
          <div className={css.featureImage}><img src={asset('5f044.png')} alt="앞머리와 얼굴 주변의 헤어스타일" loading="lazy"/></div>
          <div className={css.featureCopy}><div><p className={css.volume}>VOL. 04</p><h2>나에게 어울리는<br/>앞머리는 따로 있다</h2></div><p className={css.description}>얼굴형과 분위기에 따라 달라지는 앞머리 선택법</p></div>
        </Link>
      </div>
    </div>
  </main>;
}
