'use client';

import {useRouter} from 'next/navigation';
import './article-homecare.css';

const photos = '/assets/figma/article-homecare/';

function StepHeading({number,title}:{number:string;title:string}) {
  return <div className="hc-step-heading">
    <span className="hc-eyebrow">{number}</span>
    <h2>{title}</h2>
  </div>;
}

function HairTip({children}:{children:React.ReactNode}) {
  return <aside className="hc-hair-tip">
    <span>HAIRUS TIP</span>
    <p>{children}</p>
  </aside>;
}

export function HairCareArticle() {
  const router = useRouter();

  return <main id="main" className="hc-article">
    <header className="hc-header">
      <button type="button" className="hc-back" aria-label="뒤로 가기" onClick={() => window.history.length > 1 ? router.back() : router.push('/magazine')}><img src="/assets/figma/v1/30ced.svg" alt="" aria-hidden="true"/></button>
      <span>ARTICLE</span>
      <span aria-hidden="true"/>
    </header>

    <section className="hc-cover" aria-label="THE ART OF HAIR CARE">
      <img src={photos+'cover.png'} alt="욕실에서 긴 머리를 손질하는 여성" />
      <div className="hc-cover-content">
        <p>HAIRUS EDITORIAL / VOL. 01</p>
        <h1>THE ART OF<br/>HAIR CARE</h1>
      </div>
    </section>

    <section className="hc-intro">
      <div className="hc-intro-heading">
        <span className="hc-eyebrow">THE ROUTINE</span>
        <h2>머릿결을 바꾸는 건,<br/>매일의 작은 습관.</h2>
      </div>
      <p>좋은 머릿결을 위해 특별한 관리만 필요한 건 아니에요. 머리를 감고, 말리고, 빗는 매일의 순간에도 차이는 만들어집니다.</p>
      <p>오늘부터 실천할 수 있는 네 가지 홈케어 루틴을 소개합니다.</p>
    </section>

    <div className="hc-body">
      <div className="hc-steps">
        <section className="hc-step">
          <StepHeading number="01 / PREPARE" title="케어는 빗질에서 시작된다." />
          <div className="hc-prepare-row">
            <div className="hc-media hc-prepare-media"><img src={photos+'prepare.png'} alt="나무 브러시로 젖은 모발을 빗는 모습" loading="lazy" /></div>
            <p>머리를 적시기 전, 모발 끝부터 부드럽게 빗어 엉킴을 풀어주세요.<br/><br/>샴푸 중 발생하는 불필요한 마찰과 끊어짐을 줄일 수 있어요.</p>
          </div>
          <HairTip>엉킨 부분을 억지로 당기지 말고, 끝에서부터 조금씩 위로 올라가며 풀어주세요.</HairTip>
        </section>

        <section className="hc-step">
          <StepHeading number="02 / WASH" title="좋은 머릿결은 두피와도 관련이 있다." />
          <div className="hc-wash-photos">
            <div className="hc-media hc-wash-small"><img src={photos+'wash-small.png'} alt="손으로 두피를 마사지하는 모습" loading="lazy" /></div>
            <div className="hc-media hc-wash-large"><img src={photos+'wash-large.png'} alt="두피와 모발을 샴푸로 씻는 모습" loading="lazy" /></div>
          </div>
          <p className="hc-wash-copy">미지근한 물로 두피를 충분히 적신 뒤, 손톱이 아닌 손끝으로 부드럽게 마사지하듯 씻어주세요.</p>
          <HairTip>샴푸는 두피를 중심으로 사용하고, 모발 끝은 거품으로 가볍게 씻어주세요. 귀 뒤와 목덜미까지 꼼꼼하게 헹구는 것도 잊지 마세요.</HairTip>
        </section>

        <section className="hc-step">
          <StepHeading number="03 / NOURISH" title="모발 끝까지, 섬세하게." />
          <div className="hc-media hc-nourish-wide"><img src={photos+'nourish-wide.png'} alt="샴푸 후 젖은 머릿결을 관리하는 모습" loading="lazy" /></div>
          <div className="hc-nourish-row">
            <p>샴푸 후 물기를 가볍게 짜낸 뒤 트리트먼트를 모발 중간부터 끝까지 발라주세요.<br/><br/>건조하고 손상되기 쉬운 부분에 집중하는 것이 좋아요.</p>
            <div className="hc-media hc-nourish-detail"><img src={photos+'nourish-detail.png'} alt="트리트먼트를 모발 끝에 바르는 모습" loading="lazy" /></div>
          </div>
          <HairTip>트리트먼트는 제품의 권장 시간에 맞춰 사용하고, 드라이 전에는 모발에 맞는 리브인 케어나 열 보호 제품을 발라주세요.</HairTip>
        </section>

        <section className="hc-step hc-step--dry">
          <StepHeading number="04 / DRY &amp; FINISH" title="바람의 방향이 머릿결을 바꾼다." />
          <div className="hc-dry-row">
            <div className="hc-media hc-dry-main"><img src={photos+'dry-main.png'} alt="드라이기로 머리카락을 말리는 모습" loading="lazy" /></div>
            <p>수건으로 모발을 비비지 말고 가볍게 눌러 물기를 제거해주세요.<br/><br/>드라이는 너무 뜨겁지 않은 바람으로 두피부터 말리고, 모발은 위에서 아래 방향으로 정돈해 주세요.</p>
          </div>
          <div className="hc-dry-finish">
            <div className="hc-media hc-dry-detail"><img src={photos+'dry-detail.png'} alt="드라이 마무리용 브러시" loading="lazy" /></div>
            <HairTip>드라이기를 한곳에 오래 고정하지 말고 움직여주세요. 마지막에 찬바람으로 식혀주면 스타일을 정돈하는 데 도움이 돼요.</HairTip>
          </div>
        </section>
      </div>

      <footer className="hc-epilogue">
        <span className="hc-eyebrow">EPILOGUE</span>
        <div>
          <h2>GOOD HAIR,<br/>GOOD DAY.</h2>
          <p><span>좋은 머릿결은 하루아침에 완성되지 않아요.</span><span>오늘의 작은 습관이 쌓여, 좋은 머릿결을 유지합니다.</span></p>
        </div>
      </footer>
    </div>
  </main>;
}
