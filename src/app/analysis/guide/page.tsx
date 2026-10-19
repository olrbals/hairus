"use client";
import {useRouter} from 'next/navigation';
import {Button} from '@/components/primitives';
import {AnalysisHeader,PhotoAlternatives,asset} from '@/components/analysis/shared';
import {writeEntry} from '@/lib/entry-state';
import {clearPhoto} from '@/lib/analysis/photo';
export default function Guide(){
 const router=useRouter();
 const skip=()=>{clearPhoto();writeEntry({analysis:'skipped'});router.push('/home');};
 return <main id="main" className="analysis-screen guide-screen bottom-cta-screen" data-figma-node="920:5597">
  <AnalysisHeader href="/welcome"/>
  <div className="analysis-heading guide-heading"><p className="eyebrow">PHOTO GUIDE</p><h1>얼굴부터 머리 끝까지<br/>한 화면에 담아주세요</h1><p>밝은 곳에서 정면을 바라봐 주세요.</p></div>
  <div className="guide-frame"><img src={asset('339a7.svg')} alt="얼굴부터 머리 끝까지 담는 촬영 가이드"/></div>
  <div className="guide-alternatives"><PhotoAlternatives/><p className="privacy-note">사진은 이 브라우저에서만 사용하며 외부로 전송하지 않아요.</p></div>
  <div className="analysis-actions bottom-cta-actions"><Button variant="glass" className="analysis-secondary-cta" onClick={skip}>건너뛰기</Button><Button onClick={()=>router.push('/analysis/camera')}>촬영하기</Button></div>
 </main>;
}
