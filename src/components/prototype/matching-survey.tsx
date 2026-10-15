'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {BottomSheet} from '@/components/bottom-sheet';
import {Button} from '@/components/primitives';
import {asset, matchQuestions} from '@/lib/prototype/catalog';
import {toggleChoice} from '@/lib/prototype/logic';
import {usePrototype} from './store';
import css from './matching-survey.module.css';

const titles = [
  '선호하는 디자이너의 성별을\n알려주세요',
  '주로 활동하는 지역을\n입력해주세요',
  '어떤 강점을 가진 디자이너를\n만나고 싶나요?',
  '어떤 방식의 상담을\n선호하시나요?',
  '불편했던 경험을 선택해주세요',
];
const avoidCards = [
 ['과한 시술 권유','고가 약제 ·\n추가 시술 권유','1bf0e.svg'],
 ['긴 대기 시간','예약 지연','e9b6e.svg'],
 ['예상 밖 추가금','기장 추가 ·\n현장 추가금','57952.svg'],
 ['불편한 응대','부담스러운 대화 ·\n무뚝뚝한 분위기','d92ea.svg'],
 ['부족한 설명','주의 사항 · 가격\n설명 부족','5fde7.svg'],
 ['아쉬운 결과','요청과 다른 길이 ·\n컬러','024da.svg'],
];
const consultRows = [['친절한','다양한 스타일 추천','솔직한'],['단호한','꼼꼼한','추가 시술 권유 없는'],['핵심만 빠르게','긍정적인','취향 존중'],['공감 위주의','돌려 말하는','대신 결정'],['충분한 대화','상담 필요 없음']];
const descriptions: Record<string, string> = {
  '원하는 스타일 경험': '비슷한 시술 · 스타일 작업을 우선해요',
  '충분한 상담': '설명하고 함께 결정하는 분을 찾아요',
  '손질하기 쉬운 결과': '집에서도 재현하기 쉬운 작업을 해요',
};

export function MatchingSurvey({step}: {step: string}) {
  const router = useRouter();
  const {state, update, ready} = usePrototype();
  const [locationOpen, setLocationOpen] = useState(false);
  const [message, setMessage] = useState('');
  const index = Number(step) - 1;
  const intro = step === 'intro';
  const question = matchQuestions[index];
  const selected = question ? state.matching[question.key] || [] : [];
  const choose = (option: string) => {
    if (!question) return;
    if (!selected.includes(option) && selected.length >= question.max && question.max > 1 && !(question.key==='avoid'&&option==='특별한 경험 없음')) {
      setMessage(`최대 ${question.max}개까지 선택할 수 있어요.`); return;
    }
    setMessage('');
    update(current => ({...current, matching: {...current.matching,
      [question.key]: question.key==='avoid'&&option==='특별한 경험 없음'?(current.matching.avoid?.includes(option)?[]:[option]):toggleChoice((current.matching[question.key] || []).filter(value=>question.key!=='avoid'||value!=='특별한 경험 없음'), option, question.max)}}));
  };
  if (!intro && !question) return <main id="main" className={css.page}><p>해당 단계를 찾을 수 없어요.</p><Button onClick={() => router.push('/recommendation/intro')}>설문 처음으로</Button></main>;
  if (intro) return <main id="main" className={css.intro} data-matching-survey><div className={css.introArt}><img src="/assets/figma/match-survey/intro.png" alt=""/><div className={css.introCopy}><div><h1>Meet Your Match</h1><p>The right style. The right designer.<br/>Just for you.</p></div><button type="button" disabled={!ready} onClick={()=>router.push('/recommendation/1')}>맞춤 추천 받기</button></div></div></main>;
  return <main id="main" className={css.page} data-matching-survey data-step={index+1} data-answered={selected.length>0}>
    <header className={css.header}><button type="button" aria-label="이전 화면" onClick={() => router.push(index ? `/recommendation/${index}` : '/recommendation/intro')}><img src={asset('30ced.svg')} alt=""/></button></header>
    {!intro && <div className={css.progress} aria-label={`${index + 1} / 5`}>{matchQuestions.map((q, i) => <span key={q.key} aria-current={i === index ? 'step' : undefined}/>)}</div>}
    <section className={css.question}>
      <h1>{titles[index].split('\n').map((line, i) => <span key={i}>{line}</span>)}</h1>{index === 1 && <p>집, 직장 등 미용실 가기 편한 위치를 선택해주세요</p>}{index === 3 && <p>최대 3개까지 선택 가능해요</p>}{index === 4 && <p>선택한 내용을 바탕으로<br/>나와 잘 맞는 디자이너를 찾아드려요.</p>}
    </section>
    {!intro && <>
      {index === 0 ? <div className={css.gender}>{question.options.slice(0,2).map((option,i) => <button key={option} disabled={!ready} aria-pressed={selected.includes(option)} className={css.person} onClick={() => choose(option)}><span className={css.portrait}><img src={`/assets/figma/match-survey/${i===0?'female':'male'}.png`} alt=""/></span>{option}</button>)}</div>
      : index === 1 ? <div className={css.location}><button type="button" disabled={!ready} data-selected={selected.length>0} aria-label="활동 지역 선택" aria-haspopup="dialog" onClick={() => setLocationOpen(true)}><img src={asset('7ecd5.svg')} alt=""/><span>{selected[0] || '지역을 선택해주세요'}</span><img src={asset('4a10a.svg')} alt=""/></button></div>
      : index === 2 ? <div className={css.strengths}>{question.options.map((option,i) => <button key={option} disabled={!ready} aria-pressed={selected.includes(option)} onClick={() => choose(option)}><img src={`/assets/figma/match-survey/${['experience','consultation','styling'][i]}.png`} alt=""/><span><strong>{option}</strong><small>{descriptions[option]}</small></span></button>)}</div>
      : index === 4 ? <><div className={css.avoidCards}>{avoidCards.map(([option,description,icon])=><button key={option} disabled={!ready} aria-pressed={selected.includes(option)} onClick={()=>choose(option)}><img src={asset(icon)} alt=""/><strong>{option}</strong><small>{description}</small></button>)}</div><button className={css.noExperience} disabled={!ready} type="button" aria-pressed={selected.includes('특별한 경험 없음')} onClick={()=>choose('특별한 경험 없음')}>특별한 경험 없음</button></>
      : <div className={css.choices}>{consultRows.map((row,i)=><div className={css.choiceRow} key={i}>{row.map(option => <button key={option} disabled={!ready} aria-pressed={selected.includes(option)} onClick={() => choose(option)}>{option}</button>)}</div>)}</div>}
      <p role="status" className={css.validation}>{message}</p>
    </>}
    <div className={css.actions}><Button data-final={index===4} disabled={!ready || !selected.length} onClick={() => router.push(index === 4 ? '/recommendation/results' : `/recommendation/${index + 2}`)}>{index === 4 ? '디자이너 추천 받기' : '다음'}</Button></div>
    <BottomSheet open={locationOpen} onClose={() => setLocationOpen(false)} title="활동 지역 선택"><div className={css.regionOptions}>{matchQuestions[1].options.map(option => <button key={option} aria-pressed={selected.includes(option)} onClick={() => {choose(option); setLocationOpen(false);}}>{option}</button>)}</div></BottomSheet>
  </main>;
}
