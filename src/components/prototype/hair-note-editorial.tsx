'use client';

import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {readProfile,effectiveProfile,type Values} from '@/lib/analysis/profile';
import {styleSuggestion,wishQuestions} from '@/lib/prototype/personalized-note';
import type {BookingDraft} from '@/lib/prototype/logic';
import styles from './hair-note-editorial.module.css';

export function HairNoteEditorial({draft,profileRevision,onChange,onRebuild}:{
 draft:BookingDraft;profileRevision:number;
 onChange:(change:(draft:BookingDraft)=>BookingDraft)=>void;onRebuild:()=>void;
}){
 const [profile,setProfile]=useState<Values|null>(null);
 const [expanded,setExpanded]=useState(false);
 const [editing,setEditing]=useState(false);
 const memoRef=useRef<HTMLTextAreaElement>(null);
 const editorRef=useRef<HTMLTextAreaElement>(null);
 useEffect(()=>{const saved=readProfile();setProfile(saved?effectiveProfile(saved):null);},[profileRevision]);
 useEffect(()=>{
  for(const element of [memoRef.current,editorRef.current])if(element){element.style.height='auto';element.style.height=`${element.scrollHeight+2}px`;}
 },[draft.noteInput?.memo,draft.note,editing,expanded]);
 const hair=[profile?.length?.replace(/\s*\([^)]*\)/g,''),profile?.color,profile?.texture].filter(value=>value&&!/미입력|미선택|알 수 없음/.test(value));
 const suggestion=styleSuggestion(profile,draft.serviceId,draft.noteInput?.wishes);
 const split=suggestion.indexOf('. ');
 const lead=split<0?suggestion:suggestion.slice(0,split+1);
 const detail=split<0?'':suggestion.slice(split+2);
 return <div className={styles.layout}>
  <section className={styles.card} aria-label="나의 HAIR NOTE">
   <h2 className={styles.title}>HAIR NOTE</h2>
   {hair.length>0&&<div className={styles.myHair}><h3>MY HAIR</h3><p>{hair.join(' · ')}</p></div>}
   <div className={styles.forYou}><p className={styles.label}>FOR YOU</p><h3>{lead}</h3>{detail&&<p className={styles.recommendation}>{detail}</p>}</div>
  </section>
  <section className={styles.wishes} aria-label="원하는 디테일">
   <div className={styles.wishHeading}><h2>조금 더 알려주세요.</h2><p>원하는 부분만 간단히 선택해 주세요.</p></div>
   {wishQuestions(draft.serviceId).map(question=><fieldset key={question.key} disabled={draft.noteEdited}><legend>{question.label}</legend><div className={styles.chips}>{question.options.map(option=><button type="button" key={option} aria-pressed={draft.noteInput?.wishes?.[question.key]===option} onClick={()=>onChange(current=>({...current,noteInput:{...current.noteInput,wishes:{...current.noteInput?.wishes,[question.key]:current.noteInput?.wishes?.[question.key]===option?'':option}}}))}>{option}</button>)}</div></fieldset>)}
   <label className={styles.memo}>더 전하고 싶은 말<textarea ref={memoRef} rows={2} maxLength={1000} placeholder="예: 아침 손질이 간편했으면 좋겠어요." disabled={draft.noteEdited} value={draft.noteInput?.memo||''} onChange={event=>onChange(current=>({...current,noteInput:{...current.noteInput,memo:event.target.value}}))}/></label>
   {draft.noteEdited&&<p className={styles.protected}>직접 수정한 노트를 보호하기 위해 선택과 메모를 잠갔어요. 아래 내용을 펼쳐 ‘프로필로 노트 다시 구성’을 누르면 원문을 보존하며 다시 입력할 수 있어요.</p>}
  </section>
  <details className={styles.final} onToggle={event=>setExpanded(event.currentTarget.open)}>
   <summary>디자이너에게 전달할 내용 보기 <span aria-hidden="true">⌄</span></summary>
   <div className={styles.finalBody}>
    {editing?<div className={styles.editor}><label htmlFor="booking-note">상담 노트 수정</label><textarea id="booking-note" ref={editorRef} autoFocus rows={3} maxLength={3000} value={draft.note} onChange={event=>onChange(current=>({...current,note:event.target.value,noteEdited:true}))}/><div className={styles.editorMeta}><span>자동 저장 · {draft.note.length.toLocaleString()} / 3,000</span><button type="button" onClick={()=>setEditing(false)}>수정 마치기</button></div></div>:<><p className={styles.finalText}>{draft.note}</p><button type="button" className={styles.textAction} onClick={()=>setEditing(true)}>노트 수정하기</button></>}
    <div className={styles.tools}><Link href="/analysis/result">헤어 프로필 확인</Link><button type="button" onClick={onRebuild}>프로필로 노트 다시 구성</button></div>
   </div>
  </details>
 </div>;
}
