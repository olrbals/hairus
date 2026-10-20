"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {goBackTo} from "@/lib/navigation-history";
import {useEffect,useRef,useState} from "react";
import {writeEntry} from "@/lib/entry-state";
import {Button} from "@/components/primitives";
import {arvoTeam} from "@/lib/prototype/arvo";
import styles from "./onboarding.module.css";
import {LoginScreen} from "./login-screen";

const stories = [
  {title:"Understand & Explore", body:<>나의 헤어를 분석하고,<br/>취향에 맞는 스타일을 발견해요.</>},
  {title:"Meet Your Match", body:<>나의 헤어와 취향에 맞는<br/>디자이너를 추천받아요.</>},
  {title:"The Hair Note", body:<>나의 헤어 정보를 담아,<br/>예약까지 간편하게 이어가요.</>},
];
const asset = "/assets/figma/v1/";
const previewDesigners = ["yoona","hana","sohee","gyunghyun","jonghun"]
  .map(id=>arvoTeam.find(designer=>designer.id===id))
  .filter(designer=>designer!==undefined);

// Editorial examples only: never read or write user hair or appointment data.
function HairProfilePreview() {
  return <div className={styles.profilePreview}>
    <div className={styles.phone} aria-hidden="true"><span className={styles.speaker}/></div>
    <div className={`${styles.card} ${styles.profileCard}`}>
      <h2>MY HAIR PROFILE</h2>
      <p className={styles.profileMood}>NATURAL</p>
      <p className={styles.profileSummary}>계란형 · 긴 기장 · 반곱슬 · 흑갈색 모</p>
      <p className={styles.profileKeywords}># 내추럴<span> # 퓨어</span><span> # 웨이브</span></p>
    </div>
    <div className={styles.recommendedStyles}>
      <p>STYLES FOR YOU</p>
      <div className={styles.styleImages}>
        <div className={styles.styleImage}><img src={`${asset}5582e.png`} alt="에어리 레이어드 스타일" draggable={false}/></div>
        <div className={styles.styleImage}><img src={`${asset}05be4.png`} alt="테슬컷 스타일" draggable={false}/></div>
        <div className={styles.styleImage}><img src={`${asset}03042.png`} alt="샌드펌 스타일" draggable={false}/></div>
      </div>
    </div>
  </div>;
}
function DesignerPreview() {
  // Static editorial coverflow; identities come from the existing salon team.
  return <div className={styles.designerPreview}>
    {previewDesigners.map((designer,index)=><div key={designer.id} data-distance={Math.abs(index-2)} className={`${styles.card} ${styles.designerCard} ${designer.id==="sohee"?styles.bestMatch:""}`}>
      <img src={designer.image} alt={`${designer.name} ${designer.title}`} draggable={false}/>
      <div className={styles.designerIdentity}>
        {designer.id==="sohee"&&<span className={styles.matchLabel}>BEST MATCH</span>}
        <p className={styles.designerName}>{designer.name} {designer.title}</p>
        <p className={styles.specialty}>{designer.specialty}</p>
      </div>
    </div>)}
  </div>;
}
function HairNotePreview() {
  return <div className={styles.hairNotePreview}>
    <div className={`${styles.card} ${styles.hairNote}`}><h2>HAIR NOTE</h2><dl>
      <div><dt>MY HAIR</dt><dd>긴 레이어드 · 반곱슬 · 흑갈색</dd></div>
      <div><dt>DESIRED STYLE</dt><dd>에어리 레이어드 컷</dd></div>
      <div><dt>MY REQUEST</dt><dd>자연스러운 볼륨과 가벼운 레이어드</dd></div>
    </dl></div>
    <div className={`${styles.card} ${styles.appointment}`}><h3>MY APPOINTMENT</h3>
      <p className={styles.designer}>소희 디자이너</p><p className={styles.salon}>아르보 성수</p>
      <p className={styles.date}>11월 24일 <span>오후 4:00</span></p><p className={styles.ready}>예약 준비 완료</p>
    </div>
  </div>;
}
type Step=1|2|3;
type Destination=Step|"login";

function OnboardingPanel({step,progressStep=step,previousStep,onSkip,onNext,onSelect}:{step:Step;progressStep?:Step;previousStep?:Step;onSkip:()=>void;onNext:()=>void;onSelect:(step:Step)=>void}){
 const story=stories[step-1];
 return <>
  <header className={styles.header}><Link href="/ui" className="wordmark" aria-label="HAIRUS UI 샘플">HAIRUS</Link><button type="button" onClick={onSkip}>건너뛰기</button></header>
  <div className={styles.visual} aria-label="서비스 미리보기 예시"><div className={styles.visualViewport}><div className={styles.canvas}>{step===1?<HairProfilePreview/>:step===2?<DesignerPreview/>:<HairNotePreview/>}</div></div></div>
  <div className={styles.copy}><h1>{story.title}</h1><p>{story.body}</p></div>
  <footer className={styles.footer}>
   <nav className={styles.progress} aria-label="온보딩 단계">{([1,2,3] as const).map(n=><Link key={n} href={"/onboarding/"+n} aria-current={n===progressStep?"step":undefined} data-previous={n===previousStep||undefined} aria-label={"온보딩 "+n} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();onSelect(n);}}><span/></Link>)}</nav>
   <Button variant={step===3?"primary":"glass"} className={styles.next+" "+(step===3?styles.nextPrimary:styles.nextOutlined)} onClick={onNext}>{step===3?"시작하기":"다음"}</Button>
  </footer>
 </>;
}

export function Onboarding({step}:{step:Step}){
 const router=useRouter();
 const [incoming,setIncoming]=useState<Destination|null>(null);
 const touchStart=useRef<{x:number;y:number}|null>(null);
 useEffect(()=>{writeEntry({onboardingStep:step});setIncoming(null);},[step]);
 function finish(){writeEntry({onboardingDone:true});router.push("/login");}
 function navigate(destination:Destination){if(destination==="login")finish();else if(destination<step)goBackTo(router,"/onboarding/"+destination);else router.push("/onboarding/"+destination);}
 function advance(destination:Destination){
  if(incoming!==null||destination===step)return;
  if(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){navigate(destination);return;}
  setIncoming(destination);
 }
 const next:Destination=step===3?"login":((step+1) as 2|3);
 return <main id="main" className={"entry-screen "+styles.screen} data-direction={typeof incoming==="number"&&incoming<step?"back":"forward"}
  onTouchStart={event=>{if((event.target as Element).closest("a,button")){touchStart.current=null;return;}const touch=event.touches[0];touchStart.current={x:touch.clientX,y:touch.clientY};}}
  onTouchCancel={()=>{touchStart.current=null;}}
  onTouchEnd={event=>{const start=touchStart.current;touchStart.current=null;if(!start)return;const touch=event.changedTouches[0],dx=touch.clientX-start.x,dy=touch.clientY-start.y;if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.5)return;if(dx<0)advance(next);else if(step>1)advance((step-1) as Step);}}>
  <div className={styles.slidePage+" "+(incoming!==null?styles.slideOut:"")} aria-hidden={incoming!==null} inert={incoming!==null}>
   <OnboardingPanel step={step} progressStep={typeof incoming==="number"?incoming:step} onSkip={finish} onNext={()=>advance(next)} onSelect={advance}/>
  </div>
  {incoming!==null&&<div className={styles.slidePage+" "+styles.slideIncoming+" "+(incoming==="login"?styles.slideLogin:"")} aria-hidden="true" inert
   onAnimationEnd={event=>{if(event.target===event.currentTarget&&event.animationName.includes("onboardingSlideIn"))navigate(incoming);}}>
   {incoming==="login"?<LoginScreen asSlide/>:<OnboardingPanel step={incoming} previousStep={step} onSkip={finish} onNext={()=>{}} onSelect={()=>{}}/>}
  </div>}
 </main>;
}
