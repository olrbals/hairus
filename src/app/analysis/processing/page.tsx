"use client";
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {asset} from '@/components/analysis/shared';
import {mockAnalysisService} from '@/lib/analysis/service';
import {persistProfile} from '@/lib/analysis/profile';
import {writeEntry} from '@/lib/entry-state';
import {getPhoto} from '@/lib/analysis/photo';
export default function Processing(){const [stage,setStage]=useState(0);const [error,setError]=useState('');const router=useRouter();useEffect(()=>{if(!getPhoto()){router.replace('/analysis/guide');return;}const controller=new AbortController();mockAnalysisService.analyze(controller.signal,setStage).then(profile=>{persistProfile(profile);writeEntry({analysis:"complete"});router.replace('/analysis/result');}).catch(e=>{if(e.name!=='AbortError')setError('헤어 분석을 완료하지 못했어요. 사진 확인 화면에서 다시 시도해 주세요.');});return()=>controller.abort();},[router]);return <main id="main" className="analysis-screen processing-screen" data-figma-node={['920:5404','920:5423','920:5442'][stage]}><div className="progress-content">{/* Keep one SVG mounted so stage updates never reset the orbit. */}<img className="progress-ring" src={asset('8547a.svg')} alt=""/><div className="analysis-heading" role="status"><h1>현재 헤어를<br/>분석하고 있어요</h1><p>{error||['기장을 살펴보고 있어요','레이어를 확인하고 있어요','모발의 곱슬 정도를 확인하고 있어요'][stage]}</p></div><ol aria-label="헤어 분석 진행 상황">{['기장 분석','레이어 확인','모발 형태 확인'].map((s,i)=><li key={s} className={i<stage?'completed':i===stage?'active':'pending'} aria-current={stage===i?'step':undefined}><span>{s}</span></li>)}</ol><Link href="/analysis/captured" className="text-action">취소하고 사진 확인하기</Link></div></main>;}
