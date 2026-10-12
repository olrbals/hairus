from pathlib import Path
files={
'src/lib/entry-state.ts':'''export type EntryState={version:1;onboardingStep:1|2|3;onboardingDone:boolean;loginMode:"guest"|"demo";name:string;analysis:"not-started"|"skipped"};
export const emptyEntry:EntryState={version:1,onboardingStep:1,onboardingDone:false,loginMode:"guest",name:"",analysis:"not-started"};
const key="hairus.entry.v1";
export function readEntry():EntryState {try{const raw=JSON.parse(localStorage.getItem(key)||"null");if(!raw||raw.version!==1)return {...emptyEntry};return {...emptyEntry,onboardingStep:[1,2,3].includes(raw.onboardingStep)?raw.onboardingStep:1,onboardingDone:raw.onboardingDone===true,loginMode:raw.loginMode==="demo"?"demo":"guest",name:typeof raw.name==="string"?raw.name.slice(0,20):"",analysis:raw.analysis==="skipped"?"skipped":"not-started"};}catch{return {...emptyEntry};}}
export function writeEntry(patch:Partial<Omit<EntryState,"version">>):EntryState {const next={...readEntry(),...patch};try{localStorage.setItem(key,JSON.stringify(next));}catch{/* 저장이 제한되어도 현재 화면의 여정은 계속한다. */}return next;}
''',
'src/components/entry/splash.tsx':'''"use client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {readEntry} from "@/lib/entry-state";
export function Splash(){const router=useRouter();useEffect(()=>{const state=readEntry();const target=state.loginMode==="demo"?"/welcome":state.onboardingDone?"/login":`/onboarding/${state.onboardingStep}`;const timer=setTimeout(()=>router.replace(target),900);return()=>clearTimeout(timer);},[router]);return <main id="main" className="entry-screen splash"><h1>HAIRUS</h1><p>HAIR IS WHO WE ARE</p><Link href="/onboarding/1">시작하기</Link></main>;}
''',
'src/app/page.tsx':'''import {Splash} from "@/components/entry/splash";
export default function Page(){return <Splash/>;}
''',
'src/components/entry/onboarding.tsx':'''"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {writeEntry} from "@/lib/entry-state";
import {Button} from "@/components/primitives";
const stories=[{title:"My Hair",eyebrow:"01 / UNDERSTAND",heading:"지금의 나를, 먼저.",body:"현재 헤어의 특징을 살펴보고, 나만의 헤어 프로필로 정리해요.",note:"나를 이해하는 헤어 경험"},{title:"My Taste",eyebrow:"02 / DISCOVER",heading:"취향은 발견하는 것.",body:"눈길이 가는 스타일을 모아보세요. 나다운 헤어의 방향이 조금씩 선명해져요.",note:"마음에 드는 순간을 아카이브"},{title:"Hair Note",eyebrow:"03 / CONNECT",heading:"나의 취향을, 디자이너에게.",body:"원하는 스타일과 디테일을 담아, 나에게 맞는 디자이너와 상담을 준비해요.",note:"취향이 대화로 이어지는 순간"}];
export function Onboarding({step}:{step:1|2|3}){const router=useRouter();const story=stories[step-1];useEffect(()=>{writeEntry({onboardingStep:step});},[step]);function finish(){writeEntry({onboardingDone:true});router.push('/login');}return <main id="main" className="entry-screen onboarding" key={step}><header className="entry-header"><Link href="/ui" className="wordmark" aria-label="HAIRUS UI 샘플">HAIRUS</Link><button onClick={finish}>건너뛰기</button></header><div className="onboarding-story"><p className="eyebrow">{story.eyebrow}</p><h1>{story.title}</h1><div className="editorial-rule"/><p className="editorial-note">{story.note}</p><h2>{story.heading}</h2><p className="onboarding-body">{story.body}</p></div><footer className="onboarding-footer"><nav aria-label="온보딩 단계">{[1,2,3].map(n=><Link key={n} href={`/onboarding/${n}`} aria-current={n===step?'step':undefined} aria-label={`온보딩 ${n}`}>{String(n).padStart(2,'0')}</Link>)}</nav><div className="entry-actions">{step>1&&<Link className="back-text" href={`/onboarding/${step-1}`}>이전</Link>}<Button onClick={()=>step===3?finish():router.push(`/onboarding/${step+1}`)}>{step===3?'시작하기':'다음'}</Button></div></footer></main>;}
''',
'src/app/(entry)/onboarding/[step]/page.tsx':'''import {notFound} from "next/navigation";
import {Onboarding} from "@/components/entry/onboarding";
export function generateStaticParams(){return [{step:"1"},{step:"2"},{step:"3"}];}
export default async function Page({params}:{params:Promise<{step:string}>}){const {step}=await params;if(step!=="1"&&step!=="2"&&step!=="3")notFound();return <Onboarding step={Number(step) as 1|2|3}/>;}
''',
'src/app/(entry)/login/page.tsx':'''"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {BottomSheet} from "@/components/bottom-sheet";
import {Button} from "@/components/primitives";
import {writeEntry} from "@/lib/entry-state";
export default function Login(){const [provider,setProvider]=useState<string|null>(null);const router=useRouter();function start(){writeEntry({loginMode:"demo",onboardingDone:true});router.push('/welcome');}return <main id="main" className="entry-screen login-screen" data-figma-node="920:5386"><header className="login-intro"><h1>HAIRUS</h1><p>로그인하고 나에게 꼭 맞는<br/>헤어 경험을 시작해보세요.</p></header><div className="login-methods">{[{key:'kakao',name:'카카오'},{key:'naver',name:'네이버'},{key:'apple',name:'Apple'}].map(p=><button key={p.key} className="social-login" onClick={()=>setProvider(p.name)}><span className={p.key==='naver'?'naver-logo':'social-logo'}><img src={`/assets/figma/entry/${p.key}.svg`} alt=""/></span>{p.name}로 계속하기</button>)}<button className="phone-login" onClick={()=>setProvider('휴대폰번호')}>휴대폰번호로 로그인하기</button></div><p className="login-legal">프로토타입 · 실제 계정에 연결되지 않습니다.<br/>로그인 방법을 선택하면 데모로 계속할 수 있어요.</p><BottomSheet open={provider!==null} onClose={()=>setProvider(null)} title="데모로 시작하기"><p>{provider} 인증은 아직 연결되지 않았습니다. 계정 생성이나 약관 동의 없이 데모를 체험합니다.</p><Button onClick={start}>데모로 계속하기</Button><Button variant="plain" onClick={()=>setProvider(null)}>돌아가기</Button></BottomSheet></main>;}
''',
'src/app/(entry)/welcome/page.tsx':'''"use client";
import Link from "next/link";
import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/primitives";
import {BottomSheet} from "@/components/bottom-sheet";
import {readEntry,writeEntry} from "@/lib/entry-state";
export default function Welcome(){const [name,setName]=useState('');const [next,setNext]=useState(false);const router=useRouter();useEffect(()=>setName(readEntry().name),[]);const display=name.trim()||'당신';function save(){writeEntry({name:name.trim()});}return <main id="main" className="entry-screen welcome-screen" data-figma-node="920:5612"><header className="welcome-header"><Link href="/login" aria-label="로그인으로 돌아가기"><img src="/assets/figma/entry/back.svg" alt=""/></Link></header><div className="welcome-intro"><p className="eyebrow">Welcome !</p><h1>{name.trim()?`반가워요, ${display}님!`:'반가워요!'}<br/>당신에게 가장 잘 어울리는<br/>헤어 스타일을 찾아드릴게요.</h1><p>먼저, 간단한 헤어 분석을 통해<br/>{name.trim()?`${display}님의 특징을 알아볼게요.`:'당신의 특징을 알아볼게요.'}</p></div><div className="name-field"><label htmlFor="display-name">어떻게 불러드릴까요?</label><input id="display-name" value={name} onChange={e=>setName(e.target.value)} onBlur={save} maxLength={20} placeholder="이름 또는 닉네임" autoComplete="nickname"/><span className="sr-only">20자까지 입력할 수 있습니다. 입력하지 않아도 계속할 수 있습니다.</span></div><div className="welcome-actions"><Button variant="glass" onClick={()=>{save();writeEntry({analysis:'skipped'});router.push('/home');}}>건너뛰기</Button><Button onClick={()=>{save();setNext(true);}}>분석하기</Button></div><BottomSheet open={next} onClose={()=>setNext(false)} title="여기까지 준비되었어요"><p>헤어 촬영과 분석은 다음 단계에서 연결됩니다. 지금은 사진을 수집하거나 분석 결과를 생성하지 않습니다.</p><Button onClick={()=>setNext(false)}>Welcome으로 돌아가기</Button></BottomSheet></main>;}
'''
}
for n,s in files.items():
 p=Path(n);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s)
p=Path('src/app/layout.tsx');s=p.read_text().replace('HAIRUS · UI Foundation','HAIRUS').replace('HAIRUS PHASE 02 공통 UI 검토','나의 헤어를 이해하고 취향을 발견하는 HAIRUS 모바일 프로토타입');p.write_text(s)
