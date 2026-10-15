'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {asset,preferenceQuestions,matchQuestions,styles,itemHref} from '@/lib/prototype/catalog';
import {toggleChoice,recommend} from '@/lib/prototype/logic';
import {readProfile,effectiveProfile} from '@/lib/analysis/profile';
import {Button} from '@/components/primitives';
import {Screen,Action,Chips,Card,DemoNotice} from './shared';
import {usePrototype} from './store';
import {MatchingSurvey} from './matching-survey';
export function Survey({kind,step}:{kind:'preferences'|'matching';step:string}){return kind==='matching'?<MatchingSurvey key={step} step={step}/>:<PreferenceSurvey kind={kind} step={step}/>;}
function PreferenceSurvey({kind,step}:{kind:'preferences'|'matching';step:string}){const router=useRouter();const {state,update,ready}=usePrototype();const [message,setMessage]=useState('');const questions=kind==='preferences'?preferenceQuestions:matchQuestions;const prefix=kind==='preferences'?'/preferences':'/recommendation';const index=Number(step)-1;const question=questions[index];if(step==='intro')return <Screen title={kind==='preferences'?'Your Preference':'Meet Your Match'}><div className="intro-block"><p className="eyebrow">{kind==='preferences'?'나의 취향을 알아가는 시간':'나를 이해하는 디자이너'}</p><h2>{kind==='preferences'?'취향을 알려주시면, 더 나다운 헤어를 찾을 수 있어요.':'당신의 취향에 귀 기울이는 디자이너를 만나보세요.'}</h2><p>{questions.length}개의 짧은 질문 · 선택한 내용은 저장돼요.</p></div><Action href={`${prefix}/1`}>시작하기</Action></Screen>;
 if(!question)return <Screen title="설문"><p>해당 단계를 찾을 수 없어요.</p><Action href={`${prefix}/intro`}>설문 처음으로</Action></Screen>;
 const selected=state[kind][question.key]||[];const images=question.images;
 // This layout is intentionally scoped to the first hair-preference question.
 // Other survey steps continue to use the existing shared Screen and actions.
 if(kind==='preferences'&&index===0){
  return <main id="main" className="preference-first-step" data-figma-node="939:8564">
   <header className="preference-first-step__header">
    <button type="button" className="preference-first-step__back" aria-label="이전 화면" onClick={()=>window.history.length>1?router.back():router.push(`${prefix}/intro`)}>
     <img src="/assets/figma/v1/30ced.svg" alt=""/>
    </button>
    <div className="preference-first-step__progress" aria-label={`취향 질문 ${index+1} / ${questions.length}`}>
     {questions.map((q,i)=><span key={q.key} className={i<=index?'active':undefined}/>)}
    </div>
   </header>
   <section className="preference-first-step__question" aria-labelledby="preference-first-step-heading">
    <h1 id="preference-first-step-heading">평소 머리를 어떻게<br/>손질하나요?</h1>
    <p>평소 가장 자주 하는 방법을 선택해주세요</p>
   </section>
   <div className="preference-first-step__choices" role="group" aria-label={question.title}>
    {question.options.map((option,i)=><button type="button" className="preference-first-step__choice" disabled={!ready} key={option} aria-pressed={selected.includes(option)} onClick={()=>{
     setMessage('');
     update(s=>({...s,preferences:{...s.preferences,[question.key]:toggleChoice(s.preferences[question.key]||[],option,question.max)}}));
    }}>
     <span className="preference-first-step__image"><img src={asset(images![i])} alt=""/></span>
     <span className="preference-first-step__choice-label">{option}</span>
    </button>)}
   </div>
   <div className="preference-first-step__actions">
    <Action secondary href={`${prefix}/intro`}>이전 단계</Action>
    <Button variant="glass" disabled={!ready||selected.length===0} onClick={()=>router.push(`${prefix}/2`)}>다음</Button>
   </div>
  </main>;
 }
 return <Screen title={kind==='preferences'?'My Preference':'Meet Your Match'} back={prefix+'/intro'}><div className="progress" aria-label={`${index+1} / ${questions.length}`}>{questions.map((q,i)=><span key={q.key} className={i<=index?'active':''}/>)}</div><div className="question"><p className="eyebrow">0{index+1} / 0{questions.length}</p><h2>{question.title}</h2><p>{question.max===1?'가장 가까운 한 가지를 선택해 주세요.':`최대 ${question.max}개까지 선택할 수 있어요.`}</p></div><div className={images?`image-choices ${images.length===6?'three':''}`:'chips survey-chips'}>{question.options.map((option,i)=><button disabled={!ready} key={option} aria-pressed={selected.includes(option)} onClick={()=>{if(!selected.includes(option)&&selected.length>=question.max&&question.max>1){setMessage(`최대 ${question.max}개까지 선택할 수 있어요.`);return;}setMessage('');update(s=>{let next=toggleChoice(s[kind][question.key]||[],option,question.max);if(option==='특별한 고민 없음')next=['특별한 고민 없음'];else next=next.filter(v=>v!=='특별한 고민 없음');return {...s,[kind]:{...s[kind],[question.key]:next}};});}}>{images&&<span><img src={asset(images[i])} alt=""/></span>}{option}</button>)}</div><p role="status" className="validation">{message}</p><div className="survey-actions"><Button disabled={!ready||selected.length===0} onClick={()=>{if(index===questions.length-1){if(kind==='preferences')update(s=>({...s,preferenceComplete:true}));router.push(kind==='preferences'?'/preferences/loading':'/recommendation/results');}else router.push(`${prefix}/${index+2}`);}}>{index===questions.length-1?'결과 보기':'다음'}</Button><Action secondary href={index?`${prefix}/${index}`:`${prefix}/intro`}>이전 단계</Action></div></Screen>;}
export function ProfileComplete(){const {state}=usePrototype();const [summary,setSummary]=useState('');useEffect(()=>{const p=readProfile();if(p){const v=effectiveProfile(p);setSummary([v.length,v.cut,v.face].filter(Boolean).join(' · '));}},[]);return <Screen title="Naturally You"><p className="eyebrow">MY HAIR PROFILE</p><h2>나를 알아가는 첫걸음,<br/>헤어 프로필이 완성됐어요.</h2><div className="summary-panel"><p>{summary||'헤어 정보는 마이페이지에서 추가할 수 있어요.'}</p>{preferenceQuestions.map(q=><div className="summary-row" key={q.key}><span>{q.title}</span><strong>{(state.preferences[q.key]||[]).join(' · ')||'미입력'}</strong></div>)}</div><Action href="/home">홈으로 가기</Action><Action href="/recommendation/intro" secondary>헤어 추천 받기</Action></Screen>;}
export function RecommendationResults(){const {state,ready}=usePrototype();const ranked=recommend(state.matching,state.preferences);if(!ready)return <Screen title="Your Match"><p>응답을 불러오는 중이에요.</p></Screen>;if(!matchQuestions.every(q=>state.matching[q.key]?.length))return <Screen title="Your Match"><p>추천 설문을 마치면 선택한 답변에 맞춘 결과를 볼 수 있어요.</p><Action href="/recommendation/intro">추천 설문 시작하기</Action></Screen>;const top=ranked[0];return <Screen title="Your Match"><DemoNotice>설문과 샘플 디자이너 특징을 비교한 규칙 기반 데모 추천이에요. AI 매칭률은 제공하지 않아요.</DemoNotice><h2>당신의 취향에서 시작한 추천</h2><p>{(state.preferences.mood||[]).join(' · ')||'새로운 스타일'}를 위한 첫 번째 만남</p><Card item={top.designer}/><section><h2 className="section-title">WHY WE MATCH</h2>{top.reasons.map(r=><p className="reason" key={r}>{r}</p>)}{state.matching.avoid?.length>0&&<p className="reason">상담에서 미리 나눌 내용: {state.matching.avoid.join(', ')}. 해당 경험이 없을 것이라고 보장하는 추천은 아니에요.</p>}<p className="muted">현재 샘플은 성수 지역 여성 디자이너 2명이에요. 다른 지역·성별을 선택했다면 정확한 조건 일치 결과는 없으며, 취향 비교용 후보를 보여드려요.</p></section><h2 className="section-title">SELECTED WORKS</h2><div className="proto-grid">{styles.filter(s=>s.designerId===top.designer.id).slice(0,2).map(s=><Card key={s.id} item={s}/>)}</div><Action href={itemHref(top.designer)}>디자이너 상세 보기</Action><Action href={`/reservation/${top.designer.id}/service`}>예약하기 · 데모</Action><h2 className="section-title">ALSO FOR YOU</h2>{ranked.slice(1).map(r=><Card key={r.designer.id} item={r.designer}/>)}<Action secondary href="/recommendation/1">추천 설문 다시 하기</Action></Screen>;}
