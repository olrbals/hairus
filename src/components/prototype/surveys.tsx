'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {asset,preferenceQuestions,matchQuestions,styles,itemHref} from '@/lib/prototype/catalog';
import {toggleChoice,recommend} from '@/lib/prototype/logic';
import {readProfile,effectiveProfile} from '@/lib/analysis/profile';
import {readEntry} from '@/lib/entry-state';
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
    <Button disabled={!ready||selected.length===0} onClick={()=>router.push(`${prefix}/2`)}>다음</Button>
    <Action secondary href={`${prefix}/intro`}>이전 단계</Action>
   </div>
  </main>;
 }
 if(kind==='preferences'&&index>=1&&index<=3){
  const selectOption=(option:string)=>{
   if(!selected.includes(option)&&selected.length>=question.max&&question.max>1){setMessage(`최대 ${question.max}개까지 선택할 수 있어요.`);return;}
   setMessage('');
   update(s=>{
    let next=toggleChoice(s.preferences[question.key]||[],option,question.max);
    if(option==='특별한 고민 없음')next=['특별한 고민 없음'];
    else next=next.filter(value=>value!=='특별한 고민 없음');
    return {...s,preferences:{...s.preferences,[question.key]:next}};
   });
  };
  const goNext=()=>{
   if(index===questions.length-1){
    update(s=>({...s,preferenceComplete:true}));
    router.push('/preferences/loading');
   }else router.push(`${prefix}/${index+2}`);
  };
  const title=index===2?<>어떤 분위기의 스타일을<br/>좋아하나요?</>:index===3?<>지금 가장 바꾸고 싶은<br/>부분은 무엇인가요?</>:question.title;
  const description=index===1?'최대 3개까지 선택 가능해요':index===2?'마음에 드는 분위기를 최대 2개 선택해주세요.':null;
  const renderedOptions=index===3
   ? question.options.flatMap((option,itemIndex)=>itemIndex===8?[{label:'손질 편의성',value:'손질 편의성 (스타일)'},{label:option,value:option}]:[{label:option,value:option}])
   : question.options.map(option=>({label:option,value:option}));
  return <main id="main" className={`preference-survey-step preference-survey-step--${index+1}`} data-figma-node={index===1?'939:8528':index===2?'939:8597':'939:8639'}>
   <header className="preference-survey-step__header">
    <button type="button" className="preference-survey-step__back" aria-label="이전 화면" onClick={()=>router.push(`${prefix}/${index}`)}>
     <img src="/assets/figma/v1/30ced.svg" alt=""/>
    </button>
    <div className="preference-survey-step__progress" aria-label={`취향 질문 ${index+1} / ${questions.length}`}>
     {questions.map((item,itemIndex)=><span key={item.key} className={itemIndex<=index?'active':undefined}/>) }
    </div>
   </header>
   <section className="preference-survey-step__question" aria-labelledby="preference-survey-step-heading">
    <h1 id="preference-survey-step-heading">{title}</h1>
    {description&&<p>{description}</p>}
   </section>
   {images?<div className="preference-survey-step__images" role="group" aria-label={question.title}>
    {renderedOptions.map(({label,value},itemIndex)=><button type="button" disabled={!ready} key={value} aria-pressed={selected.includes(value)} onClick={()=>selectOption(value)}>
     <span><img src={asset(images[itemIndex])} alt=""/></span>
     <strong>{label}</strong>
    </button>)}
   </div>:<div className="preference-survey-step__chips chip-options" role="group" aria-label={question.title}>
    {renderedOptions.map(({label,value})=><button type="button" disabled={!ready} key={value} aria-pressed={selected.includes(value)} onClick={()=>selectOption(value)}>{label}</button>)}
   </div>}
   <p role="status" className="preference-survey-step__validation">{message}</p>
   <div className="preference-survey-step__actions">
    <Button disabled={!ready||selected.length===0} onClick={goNext}>{index===questions.length-1?'헤어 프로필 완성하기':'다음'}</Button>
   </div>
  </main>;
 }
 return <Screen title={kind==='preferences'?'My Preference':'Meet Your Match'} back={prefix+'/intro'}><div className="progress" aria-label={`${index+1} / ${questions.length}`}>{questions.map((q,i)=><span key={q.key} className={i<=index?'active':''}/>)}</div><div className="question"><p className="eyebrow">0{index+1} / 0{questions.length}</p><h2>{question.title}</h2><p>{question.max===1?'가장 가까운 한 가지를 선택해 주세요.':`최대 ${question.max}개까지 선택할 수 있어요.`}</p></div><div className={images?`image-choices ${images.length===6?'three':''}`:'chips survey-chips'}>{question.options.map((option,i)=><button disabled={!ready} key={option} aria-pressed={selected.includes(option)} onClick={()=>{if(!selected.includes(option)&&selected.length>=question.max&&question.max>1){setMessage(`최대 ${question.max}개까지 선택할 수 있어요.`);return;}setMessage('');update(s=>{let next=toggleChoice(s[kind][question.key]||[],option,question.max);if(option==='특별한 고민 없음')next=['특별한 고민 없음'];else next=next.filter(v=>v!=='특별한 고민 없음');return {...s,[kind]:{...s[kind],[question.key]:next}};});}}>{images&&<span><img src={asset(images[i])} alt=""/></span>}{option}</button>)}</div><p role="status" className="validation">{message}</p><div className="survey-actions"><Button disabled={!ready||selected.length===0} onClick={()=>{if(index===questions.length-1){if(kind==='preferences')update(s=>({...s,preferenceComplete:true}));router.push(kind==='preferences'?'/preferences/loading':'/recommendation/results');}else router.push(`${prefix}/${index+2}`);}}>{index===questions.length-1?'결과 보기':'다음'}</Button><Action secondary href={index?`${prefix}/${index}`:`${prefix}/intro`}>이전 단계</Action></div></Screen>;}
export function ProfileComplete(){
 const router=useRouter();
 const [name,setName]=useState('민서');
 const [profileSummary,setProfileSummary]=useState('계란형 · 긴 기장 · 반곱슬 · 흑갈색 모');
 useEffect(()=>{
  const entry=readEntry();
  if(entry.name.trim())setName(entry.name.trim());
  const profile=readProfile();
  if(!profile)return;
  const values=effectiveProfile(profile);
  const length=values.length?.includes('쇼트')?'짧은 기장':values.length?.includes('단발')?'단발 기장':values.length?.includes('미디엄')?'중간 기장':values.length?'긴 기장':null;
  const summary=[values.face,length,values.texture,values.color?`${values.color} 모`:null].filter(Boolean).join(' · ');
  if(summary)setProfileSummary(summary);
 },[]);
 return <main id="main" className="preference-complete" data-figma-node="939:8783">
  <header className="preference-complete__header">
   <button type="button" aria-label="이전 화면" onClick={()=>window.history.length>1?router.back():router.push('/preferences/4')}>
    <img src="/assets/figma/v1/30ced.svg" alt=""/>
   </button>
  </header>
  <section className="preference-complete__intro" aria-labelledby="preference-complete-title">
   <p>PROFILE COMPLETED</p>
   <h1 id="preference-complete-title">{name}님의 헤어 프로필이<br/>완성됐어요 !</h1>
   <p>이제 나에게 어울리는 스타일을 만나보세요.</p>
  </section>
  <article className="preference-complete__card" aria-label="완성된 헤어 프로필">
   <div className="preference-complete__hero">
    <div className="preference-complete__copy">
     <h2>NATURAL</h2>
     <p>자연스러운 결이 만들어내는<br/>편안하고 세련된 분위기</p>
     <div className="preference-complete__tags" aria-label="프로필 키워드">
      <span># 내추럴</span><span># 퓨어</span><span># 웨이브</span>
     </div>
    </div>
    <span className="preference-complete__portrait"><img src="/assets/figma/preference-complete/62141.png" alt="내추럴 무드의 긴 웨이브 헤어"/></span>
    <span className="preference-complete__flower" aria-hidden="true"><img src="/assets/figma/preference-complete/d36a0.png" alt=""/></span>
   </div>
   <div className="preference-complete__details">
    <section>
     <h3>ABOUT ME</h3>
     <p>{profileSummary}</p>
    </section>
    <section>
     <h3>A NOTE FOR YOU</h3>
     <div className="preference-complete__note">
      <span aria-hidden="true"><img src="/assets/figma/preference-complete/c7db1.png" alt=""/></span>
      <p>자연스러운 결이 가장 큰 매력이에요.<br/>긴 머리에 부드러운 레이어와 웨이브를 더해보세요.<br/>차분한 흑갈색이 내추럴한 분위기를 더욱 살려줄 거예요.</p>
     </div>
    </section>
   </div>
  </article>
  <div className="preference-complete__actions">
   <button type="button" onClick={()=>router.push('/preferences/1')}>다시 하기</button>
   <button type="button" onClick={()=>router.push('/home')}>홈으로 가기</button>
  </div>
 </main>;
}
export function RecommendationResults(){const {state,ready}=usePrototype();const ranked=recommend(state.matching,state.preferences);if(!ready)return <Screen title="Your Match"><p>응답을 불러오는 중이에요.</p></Screen>;if(!matchQuestions.every(q=>state.matching[q.key]?.length))return <Screen title="Your Match"><p>추천 설문을 마치면 선택한 답변에 맞춘 결과를 볼 수 있어요.</p><Action href="/recommendation/intro">추천 설문 시작하기</Action></Screen>;const top=ranked[0];return <Screen title="Your Match"><DemoNotice>설문과 샘플 디자이너 특징을 비교한 규칙 기반 데모 추천이에요. AI 매칭률은 제공하지 않아요.</DemoNotice><h2>당신의 취향에서 시작한 추천</h2><p>{(state.preferences.mood||[]).join(' · ')||'새로운 스타일'}를 위한 첫 번째 만남</p><Card item={top.designer}/><section><h2 className="section-title">WHY WE MATCH</h2>{top.reasons.map(r=><p className="reason" key={r}>{r}</p>)}{state.matching.avoid?.length>0&&<p className="reason">상담에서 미리 나눌 내용: {state.matching.avoid.join(', ')}. 해당 경험이 없을 것이라고 보장하는 추천은 아니에요.</p>}<p className="muted">현재 샘플은 성수 지역 여성 디자이너 2명이에요. 다른 지역·성별을 선택했다면 정확한 조건 일치 결과는 없으며, 취향 비교용 후보를 보여드려요.</p></section><h2 className="section-title">SELECTED WORKS</h2><div className="proto-grid">{styles.filter(s=>s.designerId===top.designer.id).slice(0,2).map(s=><Card key={s.id} item={s}/>)}</div><Action href={itemHref(top.designer)}>디자이너 상세 보기</Action><Action href={`/reservation/${top.designer.id}/service`}>예약하기 · 데모</Action><h2 className="section-title">ALSO FOR YOU</h2>{ranked.slice(1).map(r=><Card key={r.designer.id} item={r.designer}/>)}<Action secondary href="/recommendation/1">추천 설문 다시 하기</Action></Screen>;}
