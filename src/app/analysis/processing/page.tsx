"use client";
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {asset} from '@/components/analysis/shared';
import {mockAnalysisService} from '@/lib/analysis/service';
import {persistProfile} from '@/lib/analysis/profile';
import {writeEntry} from '@/lib/entry-state';
import {getPhoto} from '@/lib/analysis/photo';
export default function Processing(){const [stage,setStage]=useState(0);const [error,setError]=useState('');const router=useRouter();useEffect(()=>{if(!getPhoto()){router.replace('/analysis/guide');return;}const controller=new AbortController();mockAnalysisService.analyze(controller.signal,setStage).then(profile=>{persistProfile(profile);writeEntry({analysis:"complete"});router.replace('/analysis/result');}).catch(e=>{if(e.name!=='AbortError')setError('데모 결과를 준비하지 못했어요. 사진 확인 화면에서 다시 시도해 주세요.');});return()=>controller.abort();},[router]);return <main id="main" className="analysis-screen processing-screen" data-figma-node={['920:5404','920:5423','920:5442'][stage]}><div className="progress-content">{/* Keep one SVG mounted so stage updates never reset the orbit. */}<img className="progress-ring" src={asset('8547a.svg')} alt=""/><div className="analysis-heading" role="status"><h1>데모 결과를<br/>준비하고 있어요</h1><p>{error||['기장 예시를 준비하고 있어요','레이어 예시를 준비하고 있어요','모발 형태 예시를 준비하고 있어요'][stage]}</p></div><ol aria-label="데모 준비 단계">{['기장','레이어','모발 형태'].map((s,i)=><li key={s} className={i<=stage?'active':''} aria-current={stage===i?'step':undefined}>{s}</li>)}</ol><p className="privacy-note">사진의 특징을 분석하는 과정이 아니에요.</p><Link href="/analysis/captured" className="text-action">취소하고 사진 확인하기</Link></div></main>;}
