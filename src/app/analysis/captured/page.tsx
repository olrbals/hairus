"use client";
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {AnalysisHeader} from '@/components/analysis/shared';
import {Button} from '@/components/primitives';
import {getPhoto,clearPhoto,type LocalPhoto} from '@/lib/analysis/photo';
export default function Captured(){const [photo,setLocal]=useState<LocalPhoto|null>(null);const router=useRouter();useEffect(()=>{const p=getPhoto();if(!p)router.replace('/analysis/guide');else setLocal(p);},[router]);return <main id="main" className="analysis-screen captured-screen bottom-cta-screen" data-figma-node="920:5461"><AnalysisHeader/><div className="analysis-heading"><h1>머리 전체가 잘 보이나요?</h1><p>얼굴부터 머리 끝까지 잘 담겼다면 충분해요</p></div>{photo&&<div className="captured-photo"><img src={photo.url} alt={photo.sample?'Figma 샘플 헤어 사진':'촬영하거나 선택한 사진'}/></div>}<div className="analysis-actions bottom-cta-actions"><Button variant="glass" onClick={()=>{clearPhoto();router.replace('/analysis/camera');}}>다시 찍기</Button><Button disabled={!photo} onClick={()=>router.push('/analysis/processing')}>이 사진으로 분석</Button></div></main>;}
