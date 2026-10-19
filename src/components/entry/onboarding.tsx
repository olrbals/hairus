"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect,useState} from "react";
import {writeEntry} from "@/lib/entry-state";
import {Button} from "@/components/primitives";
import styles from "./onboarding.module.css";
import {LoginScreen} from "./login-screen";

const stories = [
  {title:"Understand My Hair", body:<>나의 헤어 정보를 분석하고,<br/>나에게 맞는 스타일을 추천받아요.</>},
  {title:"Explore Your Style", body:<>다양한 헤어스타일을 탐색하고,<br/>마음에 드는 스타일을 발견해요.</>},
  {title:"The Hair Note", body:<>나의 헤어 정보를 담아,<br/>예약까지 간편하게 이어가요.</>},
];
const asset = "/assets/figma/onboarding/";

// Editorial examples only: never read or write user hair or appointment data.
function HairProfilePreview() {
  return <div className={styles.profilePreview}>
    <div className={`${styles.card} ${styles.natural}`}>
      <div className={styles.naturalCopy}><h2>NATURAL</h2><p>자연스러운 결이 만들어내는<br/>편안하고 세련된 분위기</p>
        <div className={styles.keywords}>{["# 내추럴","# 퓨어","# 웨이브"].map(label=><span key={label}>{label}</span>)}</div>
      </div>
      <div className={styles.naturalImage}><img src={`${asset}natural.png`} alt="자연스러운 긴 웨이브 헤어"/></div>
    </div>
    <div className={`${styles.card} ${styles.about}`}>
      <h3>ABOUT ME</h3><p className={styles.aboutSummary}>계란형 · 긴 기장 · 반곱슬 · 흑갈색 모</p><h3>A NOTE FOR YOU</h3>
      <div className={styles.noteRow}><div className={styles.noteImage}><img src={`${asset}note.png`} alt=""/></div>
        <p>자연스러운 결이 가장 큰 매력이에요.<br/>긴 머리에 부드러운 레이어와 웨이브를 더해보세요. 차분한 흑갈색이 내추럴한 분위기를 더욱 살려줄 거예요.</p>
      </div>
    </div>
  </div>;
}
function StylePreview() {
  // Figma 736:2662 — https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T?node-id=736-2662
  // Reuses the HOME Weekly Editorial asset.
  return <div className={styles.stylePreview}><img src="/assets/figma/v1/88ad2.png" alt="HAIRUS Weekly Editorial"/></div>;
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
type Destination=2|3|"login";

function OnboardingPanel({step,onSkip,onNext}:{step:Step;onSkip:()=>void;onNext:()=>void}){
 const story=stories[step-1];
 return <>
  <header className={styles.header}><Link href="/ui" className="wordmark" aria-label="HAIRUS UI 샘플">HAIRUS</Link><button type="button" onClick={onSkip}>건너뛰기</button></header>
  <div className={styles.visual} aria-label="서비스 미리보기 예시"><div className={styles.canvas+(step===3?" "+styles.canvasHairNote:"")}>{step===1?<HairProfilePreview/>:step===2?<StylePreview/>:<HairNotePreview/>}</div></div>
  <div className={styles.copy}><h1>{story.title}</h1><p>{story.body}</p></div>
  <footer className={styles.footer}>
   <nav className={styles.progress} aria-label="온보딩 단계">{[1,2,3].map(n=><Link key={n} href={"/onboarding/"+n} aria-current={n===step?"step":undefined} aria-label={"온보딩 "+n}><span/></Link>)}</nav>
   <Button variant={step===3?"primary":"glass"} className={styles.next+" "+(step===3?styles.nextPrimary:styles.nextOutlined)} onClick={onNext}>{step===3?"시작하기":"다음"}</Button>
  </footer>
 </>;
}

export function Onboarding({step}:{step:Step}){
 const router=useRouter();
 const [incoming,setIncoming]=useState<Destination|null>(null);
 useEffect(()=>{writeEntry({onboardingStep:step});setIncoming(null);},[step]);
 function finish(){writeEntry({onboardingDone:true});router.push("/login");}
 function navigate(destination:Destination){if(destination==="login")finish();else router.push("/onboarding/"+destination);}
 function advance(destination:Destination){
  if(incoming!==null)return;
  if(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){navigate(destination);return;}
  setIncoming(destination);
 }
 const next:Destination=step===3?"login":((step+1) as 2|3);
 return <main id="main" className={"entry-screen "+styles.screen}>
  <div className={styles.slidePage+" "+(incoming!==null?styles.slideOut:"")} aria-hidden={incoming!==null} inert={incoming!==null}>
   <OnboardingPanel step={step} onSkip={finish} onNext={()=>advance(next)}/>
  </div>
  {incoming!==null&&<div className={styles.slidePage+" "+styles.slideIncoming+" "+(incoming==="login"?styles.slideLogin:"")} aria-hidden="true" inert
   onAnimationEnd={event=>{if(event.target===event.currentTarget&&event.animationName==="onboardingSlideIn")navigate(incoming);}}>
   {incoming==="login"?<LoginScreen asSlide/>:<OnboardingPanel step={incoming} onSkip={finish} onNext={()=>{}}/>}
  </div>}
 </main>;
}
