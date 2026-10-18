'use client';

import {useEffect,useRef,useState} from 'react';
import {BottomSheet} from '@/components/bottom-sheet';
import {Button} from '@/components/primitives';
import {SelectionChip} from '@/components/selection-chip';
import {readProfile,effectiveProfile,type Values,type FieldKey} from '@/lib/analysis/profile';
import {optionsForField} from '@/lib/analysis/profile-options';
import {styleRequest,effectiveStyleWishes,wishQuestions} from '@/lib/prototype/personalized-note';
import {noteSections,updateNoteSection} from '@/lib/prototype/booking-presentation';
import type {BookingDraft} from '@/lib/prototype/logic';
import {GlassToggle} from './glass-toggle';
import styles from './hair-note-editorial.module.css';

type Editor='hair'|'history'|'style';
const hairFields:[FieldKey,string][]=[['length','기장'],['texture','헤어 텍스처'],['color','헤어 컬러']];
const historyFields:[FieldKey,string][]=[['cutHistory','커트'],['permHistory','펌'],['dyeHistory','염색'],['bleachHistory','탈색']];
const editorTitles={hair:'MY HAIR',history:'RECENT SERVICE',style:'DESIRED STYLE'};
const clean=(value:string|null|undefined)=>value&&!/^(미입력|미선택|알 수 없음)$/.test(value)?value:'';

// Verified Figma 1118:3013 / 1118:2985 (document card and editable fields).
// https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T?node-id=1118-3013
export function HairNoteEditorial({draft,profileRevision,onChange}:{
 draft:BookingDraft;profileRevision:number;onChange:(change:(draft:BookingDraft)=>BookingDraft)=>void;
}){
 const [profile,setProfile]=useState<Values|null>(null);
 const [editor,setEditor]=useState<Editor|null>(null);
 const [fields,setFields]=useState<Partial<Values>>({});
 const [text,setText]=useState('');
 const styleTextareaRef=useRef<HTMLTextAreaElement>(null);
 useEffect(()=>{
  const textarea=styleTextareaRef.current;
  if(editor!=='style'||!textarea)return;
  textarea.style.height='auto';
  textarea.style.height=`${textarea.scrollHeight}px`;
 },[editor,text]);
 const [wishes,setWishes]=useState<Record<string,string>>({});
 useEffect(()=>{const saved=readProfile();setProfile(saved?effectiveProfile(saved):null);},[profileRevision]);
 const sections=noteSections(draft.note);
 const sectionValue=(labels:string[])=>{
  // A deliberately cleared field must stay empty instead of restoring profile text.
  const paragraph=draft.note.split(/\n\s*\n/).find(text=>labels.some(label=>text.trim().startsWith(label+':')));
  return paragraph===undefined?undefined:paragraph.trim().slice(paragraph.trim().indexOf(':')+1).trim();
 };
 const hair=sectionValue(['MY HAIR','현재 헤어'])??hairFields.map(([key])=>clean(profile?.[key])?.replace(/\s*\([^)]*\)/g,'')).filter(Boolean).join(' · ');
 const history=sectionValue(['RECENT SERVICE','시술 이력'])??historyFields.filter(([key])=>clean(profile?.[key])).map(([key,label])=>`${label} · ${profile?.[key]}`).join('\n');
 const custom=sections.filter(section=>!section.label).map(section=>section.value).join('\n\n');
 const desired=(draft.noteEdited?sectionValue(['DESIRED STYLE','스타일 제안']):sectionValue(['DESIRED STYLE']))??(draft.noteEdited&&custom?custom:styleRequest({...profile,...draft.noteInput?.bookingProfile} as Values,draft.serviceId,draft.noteInput?.wishes));
 const context=sections.filter(section=>['YOUR WISH','나의 취향','선호하는 분위기','평소 손질','헤어 고민'].includes(section.label)).map(section=>`${section.label} · ${section.value}`).join('\n');
 const request=sectionValue(['REQUEST','더 전하고 싶은 이야기'])??draft.noteInput?.memo??'';
 function openEditor(kind:Editor){
  const saved=draft.noteInput?.bookingProfile;
  const nextFields:Partial<Values>={...profile,...saved};
  // Reflect the current HAIR NOTE text, even when it differs from the saved profile.
  if(kind==='hair'){
   const displayed=hair.split(' · ').map(part=>part.trim());
   for(const [key] of hairFields){
    const existing=nextFields[key]??null;
    const matched=optionsForField(key,existing).find(option=>
     displayed.includes(option.value)||displayed.includes(option.label)||
     displayed.includes(option.value.replace(/\\s*\\([^)]*\\)/g,'')));
    if(matched)nextFields[key]=matched.value;
   }
  }
  if(kind==='history'){
   const lines=history.split('\\n').map(line=>line.trim());
   for(const [key,label] of historyFields){
    const line=lines.find(value=>value.startsWith(label+' · '));
    if(line)nextFields[key]=line.slice((label+' · ').length).trim();
   }
  }
  setFields(nextFields);
  setText(kind==='hair'?hair:kind==='history'?history:desired);
  const initialWishes=effectiveStyleWishes(nextFields as Values,draft.serviceId,draft.noteInput?.wishes);
  if(kind==='style'){
   // Legacy notes can contain explicit wish fields without noteInput.wishes.
   const noteWishes=sectionValue(['YOUR WISH'])||'';
   for(const question of wishQuestions(draft.serviceId)){
    if(draft.noteInput?.wishes?.[question.key])continue;
    const found=question.options.find(option=>noteWishes.includes(`${question.label}: ${option}`));
    if(found)initialWishes[question.key]=found;
   }
  }
  setWishes(initialWishes);
  setEditor(kind);
 }
 function save(){
  if(!editor)return;
  const labels=editor==='hair'?['MY HAIR','현재 헤어']:editor==='history'?['RECENT SERVICE','시술 이력']:['DESIRED STYLE','스타일 제안'];
  onChange(current=>({...updateNoteSection(current,labels,editorTitles[editor],text),noteInput:{...current.noteInput,bookingProfile:{...current.noteInput?.bookingProfile,...fields},...(editor==='style'?{wishes}:{})}}));
  setEditor(null);
 }
 function chooseField(key:FieldKey,value:string){
  const next={...fields,[key]:fields[key]===value?null:value};
  setFields(next);
  setText(editor==='hair'?hairFields.map(([field])=>clean(next[field])?.replace(/\s*\([^)]*\)/g,'')).filter(Boolean).join(' · '):historyFields.filter(([field])=>clean(next[field])).map(([field,label])=>`${label} · ${next[field]}`).join('\n'));
 }
 return <div className={styles.layout}>
  <div className={styles.delivery}><span>{draft.shareNote===false?'디자이너에게 전달하지 않아요':'디자이너에게 전달해요'}</span><GlassToggle checked={draft.shareNote!==false} label="HAIR NOTE 디자이너에게 전달" onChange={shareNote=>onChange(current=>({...current,shareNote}))}/></div>
  <section className={styles.card} aria-label="나의 HAIR NOTE">
   <h3 className={styles.title}>HAIR NOTE</h3>
   {([{key:'hair',label:'MY HAIR',value:hair,placeholder:'헤어 정보를 추가해 주세요.'},{key:'history',label:'RECENT SERVICE',value:history,placeholder:'시술 이력을 추가해 주세요.'},{key:'style',label:'DESIRED STYLE',value:desired,placeholder:'원하는 스타일을 알려주세요.'}] as const).map(item=><div className={styles.field} key={item.key}><div><h4>{item.label}</h4><p>{item.value||item.placeholder}</p>{item.key==='style'&&context&&<p className={styles.context}>{context}</p>}</div><button type="button" className={styles.edit} aria-label={`${item.label} 수정`} onClick={()=>openEditor(item.key)}>수정 <img src="/assets/figma/reservation/chevron-right.svg" alt="" width="10" height="10"/></button></div>)}
   <label className={styles.request}><span>REQUEST</span><textarea aria-label="디자이너에게 요청 사항" rows={1} maxLength={Math.max(50,request.length)} placeholder="요청 사항을 50자 이내로 작성해 주세요." value={request} onChange={event=>{const memo=event.target.value;onChange(current=>({...updateNoteSection(current,['REQUEST','더 전하고 싶은 이야기'],'REQUEST',memo),noteInput:{...current.noteInput,memo}}));}}/></label>
  </section>
  <BottomSheet open={editor!==null} onClose={()=>setEditor(null)} title={editor?editorTitles[editor]:'HAIR NOTE'} variant="default" headingAction={<button type="button" className={styles.sheetClose} onClick={()=>setEditor(null)}>닫음</button>}>
   <div className={styles.sheet}>
    <p className={styles.sheetIntro}>예약에 전달할 내용만 수정해 주세요.</p>
    {editor==='hair'||editor==='history'?(editor==='hair'?hairFields:historyFields).map(([key,label])=><div className={styles.filterGroup} key={key}><h3>{label}</h3><div className={styles.chips}>{optionsForField(key,fields[key]??null).map(option=><SelectionChip key={option.value} aria-pressed={fields[key]===option.value} onClick={()=>chooseField(key,option.value)}>{option.label}</SelectionChip>)}</div></div>):editor==='style'&&wishQuestions(draft.serviceId).map(question=><div className={styles.filterGroup} key={question.key}><h3>{question.label}</h3><div className={styles.chips}>{question.options.map(option=><SelectionChip key={option} aria-pressed={wishes[question.key]===option} onClick={()=>{const next={...wishes,[question.key]:wishes[question.key]===option?'':option};setWishes(next);setText(styleRequest({...profile,...fields} as Values,draft.serviceId,next));}}>{option}</SelectionChip>)}</div></div>)}
    {editor==='style'&&<label className={styles.styleEditor}><span>디자이너에게 전달할 내용</span><textarea ref={styleTextareaRef} aria-label="DESIRED STYLE 내용 직접 수정" rows={1} maxLength={3000} value={text} onChange={event=>setText(event.target.value)}/></label>}

    <Button onClick={save}>저장하기</Button>
   </div>
  </BottomSheet>
 </div>;
}
