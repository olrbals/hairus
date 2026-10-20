'use client';

import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {Button} from '@/components/primitives';
import {matchQuestions, designers, asset} from '@/lib/prototype/catalog';
import {getYoonaMatchReasons} from '@/lib/prototype/match-reasons';
import {PageHeader} from './page-header';
import {usePrototype} from './store';
import {Screen,Action} from './shared';
import css from './recommendation-result.module.css';

const matchedDesigner = designers.find(item => item.id === 'yoona');

const others = [
  {id:'sohee', name:'소희', image:'a91f5.png', expertise:'테슬컷 · 히피펌', salon:'아르보 성수', node:'1107:3066', imageNode:'1107:3067', nameNode:'1107:3069'},
  {id:'jisu', name:'지수', image:'d9387.png', expertise:'허쉬컷 · 히피펌', salon:'준오헤어 신논현점', node:'1107:3073', imageNode:'1107:3074', nameNode:'1107:3076'},
  {id:'gyunghyun', name:'경현', image:'3a62b.png', expertise:'허쉬컷 · 매트브라운', salon:'아르보 성수', node:'1107:3080', imageNode:'1107:3081', nameNode:'1107:3084'},
  {id:'seeun', name:'세은', image:'2dae9.png', expertise:'테슬컷 · 컬러리스트', salon:'청아하다 광교', node:'1107:3088', imageNode:'1107:3089', nameNode:'1107:3091'},
] as const;

/** Figma yourMatch 1107:2934 — always shows Yoona; only reasons adapt to answers. */
export function RecommendationResults() {
  const router = useRouter();
  const {state,ready} = usePrototype();
  if (!ready) return <Screen title="Your Match"><p>응답을 불러오는 중이에요.</p></Screen>;
  if (!matchQuestions.every(question => state.matching[question.key]?.length)) {
    return <Screen title="Your Match"><p>추천 설문을 마치면 선택한 답변에 맞춘 결과를 볼 수 있어요.</p><Action href="/recommendation/intro">추천 설문 시작하기</Action></Screen>;
  }
  if (!matchedDesigner) return <Screen title="Your Match"><p>디자이너 정보를 불러오지 못했어요.</p></Screen>;

  const reasons = getYoonaMatchReasons(state.matching,state.preferences);

  return <main id="main" className={css.resultPage} data-figma-node="1107:2934">
    <div className={css.header} data-figma-node="1107:2938">
      <PageHeader backFallbackHref="/recommendation/4"/>
    </div>
    <div className={css.content} data-figma-node="1107:3109">
      <div className={css.mainContent} data-figma-node="1107:3059">
        <h1 className={css.title} data-figma-node="1107:2940">YOUR MATCH</h1>
        <div className={css.matchBody} data-figma-node="1107:3058">
          {/* Featured match: black theme from photo through designer profile link. */}
          <div className={css.featuredMatch} data-figma-node="1107:3016">
            <div className={css.hero} data-figma-node="1107:3016">
              <img src={matchedDesigner.image} alt="윤아 디자이너" />
            </div>
            <div className={css.profileGroup} data-figma-node="1107:3102">
              <div className={css.profileInformation} data-figma-node="1107:3056">
                <div className={css.identity} data-figma-node="1107:3018">
                  <h2 data-figma-node="1107:3019">YOONA</h2>
                  <p data-figma-node="1107:3020">윤아 · 아르보 성수</p>
                </div>
                <section className={css.whySection} aria-labelledby="match-why-title" data-figma-node="1107:3055">
                  <h3 id="match-why-title" data-figma-node="1107:3033">WHY WE MATCH</h3>
                  <ol className={css.reasonList} data-figma-node="1107:3035">
                    <li className={css.reasonItem} data-figma-node="1107:3036">
                      <span className={css.reasonNumber} aria-hidden="true" data-figma-node="1107:3038">01</span>
                      <div className={css.reasonCopy} data-figma-node="1107:3039">
                        <span className={css.reasonLabel} data-figma-node="1107:3040">STYLE &amp; TASTE</span>
                        <p data-figma-node="1107:3042">{reasons.style}</p>
                      </div>
                    </li>
                    <li className={css.reasonItem} data-figma-node="1107:3043">
                      <span className={css.reasonNumber} aria-hidden="true" data-figma-node="1107:3045">02</span>
                      <div className={css.reasonCopy} data-figma-node="1107:3046">
                        <span className={css.reasonLabel} data-figma-node="1107:3047">CONSULTATION</span>
                        <p data-figma-node="1107:3049">{reasons.consultation}</p>
                      </div>
                    </li>
                  </ol>
                </section>
              </div>
              <Link className={css.profileLink} href="/designers/yoona" data-figma-node="1107:3051">
                <span data-figma-node="1107:3052">윤아 디자이너 프로필 바로가기</span>
              </Link>
            </div>
          </div>
          <section className={css.others} aria-labelledby="other-designers-heading" data-figma-node="1107:3061">
              <div className={css.othersHeading} data-figma-node="1107:3062">
                <h3 id="other-designers-heading" data-figma-node="1107:3063">Other Matched Designers</h3>
                <p data-figma-node="1107:3064">나에게 추천된 다른 디자이너들도 확인 해보세요</p>
              </div>
              <div className={css.othersRail} aria-label="다른 디자이너 목록" data-figma-node="1107:3065">
                {others.map(designer => {
                  const details = <><span className={css.otherImage} data-figma-node={designer.imageNode}><img src={asset(designer.image)} alt="" loading="lazy"/></span>
                    <span className={css.otherText}><strong data-figma-node={designer.nameNode}>{designer.name}</strong><span className={css.otherMeta}><span>{designer.expertise}</span><span>{designer.salon}</span></span></span></>;
                  return designer.id === 'sohee'
                    ? <Link key={designer.id} className={css.otherCard} href="/designers/sohee" data-figma-node={designer.node} aria-label="소희 디자이너 상세 보기">{details}</Link>
                    : <article key={designer.id} className={css.otherCard} data-figma-node={designer.node} aria-label={designer.name+' 디자이너 (탐색용 정보)'}>{details}</article>;
                })}
              </div>
          </section>
        </div>
      </div>
      <div className={css.footer} data-figma-node="1107:3108">
        <Button className={css.homeButton} onClick={() => router.push('/home')} data-figma-node="1107:2925">홈</Button>
        <button type="button" className={css.restartButton} onClick={() => router.push('/recommendation/1')} data-figma-node="1107:3106">다른 조건으로 다시 추천 받기</button>
      </div>
    </div>
  </main>;
}
