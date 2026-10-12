"use client";
import {useState} from "react";
import {Button,SectionHeading} from "@/components/primitives";
import {EditorialCard} from "@/components/editorial-card";
import {BottomNav} from "@/components/bottom-nav";
import {BottomSheet} from "@/components/bottom-sheet";
export default function UiPage(){const [open,setOpen]=useState(false);return <><main id="main"><div className="sample-label">HAIRUS · PHASE 02 · UI SAMPLE</div><section className="in-focus" aria-label="시연용 In Focus 샘플"><SectionHeading title="In Focus" description="지금 주목해야 할 헤어스타일" action={<a className="view-link" href="/explore">View ↗</a>}/><EditorialCard/></section><section className="foundation-samples"><p className="wordmark">HAIRUS</p><p className="cormorant-sample">A personal hair story.</p><h2>공통 UI 샘플</h2><p>원본의 사진·타이포그래피와 공통 요소를 검토하는 화면입니다. 저장은 이 샘플 안에서만 유지됩니다.</p><Button onClick={()=>setOpen(true)}>바텀시트 열기</Button><Button variant="glass">Next · 버튼 스타일 샘플</Button><Button disabled>비활성 상태</Button></section></main><BottomNav/><BottomSheet open={open} onClose={()=>setOpen(false)} title="당신의 헤어를 이해하는 시작"><p>바텀시트 동작 확인용 샘플입니다. 카메라 권한이나 분석을 실행하지 않습니다.</p><Button onClick={()=>setOpen(false)}>확인</Button><Button variant="plain" onClick={()=>setOpen(false)}>닫기</Button></BottomSheet></>;}
