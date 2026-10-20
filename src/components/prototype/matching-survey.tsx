'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {goBack} from '@/lib/navigation-history';
import {useNickname} from '@/lib/use-nickname';
import {Button,HeaderBackIcon} from '@/components/primitives';
import {matchQuestions} from '@/lib/prototype/catalog';
import {toggleChoice} from '@/lib/prototype/logic';
import {usePrototype} from './store';
import {PageHeader} from './page-header';
import css from './matching-survey.module.css';
import '@/styles/preference-transition.css';

const titles = [
  '선호하는 디자이너의 성별을\n알려주세요',
  '어떤 강점을 가진 디자이너를\n만나고 싶나요?',
  '어떤 방식의 상담을\n선호하시나요?',
];
const descriptions: Record<string, string> = {
  '원하는 스타일 경험': '비슷한 시술 · 스타일 작업을 우선해요',
  '충분한 상담': '설명하고 함께 결정하는 분을 찾아요',
  '손질하기 쉬운 결과': '집에서도 재현하기 쉬운 작업을 해요',
};

export function MatchingSurvey({step}: {step: string}) {
  const router = useRouter();
  const nickname = useNickname();
  const {state, update, ready} = usePrototype();
  const [message, setMessage] = useState('');
  const [limitAttempt,setLimitAttempt] = useState(0);
  const index = Number(step) - 1;
  const intro = step === 'intro';
  const question = matchQuestions[index];
  const selected = question ? (state.matching[question.key] || []).filter(value=>question.options.includes(value)) : [];
  const choose = (option: string) => {
    if (!question) return;
    if (!selected.includes(option) && selected.length >= question.max && question.max > 1) {
      setLimitAttempt(attempt=>attempt+1);setMessage(`최대 ${question.max}개까지 선택할 수 있어요.`); return;
    }
    setMessage('');
    update(current => ({...current, matching: {...current.matching,
      [question.key]: toggleChoice((current.matching[question.key] || []).filter(value=>question.options.includes(value)), option, question.max)}}));
  };
  if (!intro && !question) return <main id="main" className={css.page}><p>해당 단계를 찾을 수 없어요.</p><Button onClick={() => router.push('/recommendation/intro')}>설문 처음으로</Button></main>;

  // Figma matchIntro 1107:2841 (430 × 874). Keep the shared PageHeader and primary Button.
  if (intro) return <main id="main" className={css.intro} data-matching-survey data-figma-node="1107:2841">
    <div className={css.introHeader} data-figma-node="1107:2847">
      <PageHeader backFallbackHref="/home"/>
    </div>
    <div className={css.introLayout} data-figma-node="1107:2843">
      <section className={css.introHeading} aria-labelledby="matching-intro-title" data-figma-node="1107:2848">
        <p className={css.introEyebrow} data-figma-node="1107:2849">FIND YOUR MATCH</p>
        <div className={css.introHeadingText} data-figma-node="1107:2850">
          <h1 id="matching-intro-title" className={css.introTitle} data-figma-node="1107:2851">
            {nickname}님에게 잘 맞는<br/>디자이너를 찾아볼까요 ?
          </h1>
          <p className={css.introDescription} data-figma-node="1107:2853">
            몇 가지 간단한 질문을 통해<br/>잘 맞는 디자이너를 찾아드릴게요.
          </p>
        </div>
      </section>
      <section className={css.introJourney} aria-label="디자이너 추천 과정" data-figma-node="1107:2890">
        <ol className={css.introSteps} data-figma-node="1107:2867">
          <li className={css.introStep} data-figma-node="1107:2868">
            <span className={css.introStepNumber} aria-hidden="true" data-figma-node="1107:2870">01</span>
            <div className={css.introStepCopy} data-figma-node="1107:2871">
              <span className={css.introStepLabel} data-figma-node="1107:2872">YOUR PREFERENCES</span>
              <p className={css.introStepDescription} data-figma-node="1107:2874">선호하는 조건과 상담 방식을 선택해요.</p>
            </div>
          </li>
          <li className={css.introStep} data-figma-node="1107:2875">
            <span className={css.introStepNumber} aria-hidden="true" data-figma-node="1107:2877">02</span>
            <div className={css.introStepCopy} data-figma-node="1107:2878">
              <span className={css.introStepLabel} data-figma-node="1107:2879">YOUR MATCH</span>
              <p className={css.introStepDescription} data-figma-node="1107:2881">나에게 잘 맞는 디자이너를 만나보세요.</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
    <div className={css.introActions} data-figma-node="1107:2858">
      <Button disabled={!ready} onClick={() => router.push('/recommendation/1')}>시작하기</Button>
    </div>
  </main>;
  return <main id="main" className={css.page} data-matching-survey data-step={index+1} data-answered={selected.length>0}>
    <header className={`${css.header} hairus-page-header`}><button type="button" className="hairus-header-back" aria-label="이전 화면" onClick={() => goBack(router, index ? `/recommendation/${index}` : '/recommendation/intro')}><HeaderBackIcon/></button></header>
    {!intro && <div className={css.progress} aria-label={`${index + 1} / ${matchQuestions.length}`}>{matchQuestions.map((q, i) => <span key={q.key} aria-current={i === index ? 'step' : undefined}/>)}</div>}
    <section className={css.question}>
      <h1>{titles[index].split('\n').map((line, i) => <span key={i}>{line}</span>)}</h1>{index === 2 && <p key={limitAttempt} className={message?'preference-limit-feedback':undefined} data-limit-exceeded={!!message}>최대 3개까지 선택 가능해요</p>}
    </section>
    {!intro && <>
      {index === 0 ? <div className={css.gender}>{question.options.slice(0,2).map((option,i) => <button key={option} disabled={!ready} aria-pressed={selected.includes(option)} className={css.person} onClick={() => choose(option)}><span className={css.portrait}><span className={css.portraitFill}><img src={`/assets/figma/match-survey/${i===0?'female':'male'}.png`} alt=""/></span></span>{option}</button>)}</div>
      : index === 1 ? <div className={css.strengths}>{question.options.map((option,i) => <button key={option} disabled={!ready} aria-pressed={selected.includes(option)} onClick={() => choose(option)}><img src={`/assets/figma/match-survey/${['experience','consultation','styling'][i]}.png`} alt=""/><span><strong>{option}</strong><small>{descriptions[option]}</small></span></button>)}</div>
      : <div className={css.consultGrid} role="group" aria-label={question.title}>{question.options.map(option=><button type="button" key={option} disabled={!ready} aria-pressed={selected.includes(option)} onClick={()=>choose(option)}>{option}</button>)}</div>}
      <p role="status" className={index>=2?'preference-survey-step__validation':css.validation}>{message&&<span key={limitAttempt}>{message}<span className="sr-only"> (초과 선택 {limitAttempt}회)</span></span>}</p>
    </>}
    <div className={css.actions}><Button data-final={index===2} disabled={!ready || !selected.length} onClick={() => router.push(index === 2 ? '/designers/yoona' : `/recommendation/${index + 2}`)}>{index === 2 ? '디자이너 추천 받기' : '다음'}</Button></div>

  </main>;
}
