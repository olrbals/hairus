'use client';

import {useRouter} from 'next/navigation';
import {Button,HeaderBackIcon,HeaderSkipButton} from '@/components/primitives';

const steps=[
 {number:'01',label:'나의 헤어 · 얼굴\n특징 분석 완료',image:'/assets/figma/analysis/bta-step-1.png'},
 {number:'02',label:'나의 스타일\n취향 알아보기',image:'/assets/figma/analysis/bta-step-2.png'},
 {number:'03',label:'나에게 맞는\n스타일 추천',image:'/assets/figma/analysis/bta-step-3.png'},
];

export function PreferenceBta(){const router=useRouter();return <main id="main" className="preference-bta" data-figma-node="939:8498"><header className="preference-bta__header hairus-page-header hairus-header--with-skip"><button className="hairus-header-back" type="button" aria-label="이전 화면" onClick={()=>router.back()}><HeaderBackIcon/></button><HeaderSkipButton onClick={()=>router.push('/home')}/></header><section className="preference-bta__intro"><p>BEYOND THE ANALYSIS</p><h1>이제, 나의 취향을<br/>더해볼까요 ?</h1><p>평소 손질 습관과 선호하는 분위기를 알려주시면,<br/>나에게 더 잘 맞는 헤어스타일을 추천해 드릴게요.</p></section><ol className="preference-bta__steps" aria-label="헤어 프로필 여정">{steps.map((step,index)=><li className={index===1?'is-current':''} key={step.number}><img src={step.image} alt=""/><span>{step.number}</span><strong>{step.label.split('\n').map(line=><span key={line}>{line}</span>)}</strong></li>)}</ol><div className="preference-bta__actions"><Button onClick={()=>router.push('/preferences/1')}>헤어 프로필 만들기</Button></div></main>}

