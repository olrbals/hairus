'use client';
import {useEffect,useRef,useState} from 'react';
import {BottomSheet} from '@/components/bottom-sheet';
import {SelectionChip} from '@/components/selection-chip';
import {saveNotePreview} from '@/lib/prototype/archive';
import {SaveHeart} from './save-heart';
import {GlassToggle} from './glass-toggle';
import {usePrototype} from './store';
import savenote from './savenote.module.css';

const guideStorageKey = 'hairus.savenote-guide.v1';
let guideDismissedThisSession = false;
const guideSteps = [
 {title:'원할 때 끄거나 켤 수 있어요',description:'필요할 때만 SaveNote를 사용해요.'},
 {title:'저장 이유를 남겨요',description:'이유를 골라 두고 나중에 다시 확인해요.'},
 {title:'직접 적을 수도 있어요',description:'짧은 메모를 10자 이내로 남겨요.'},
] as const;

export type SaveNoteDraft = {reasons:string[];note:string};
type Props = {
 name:string; title:string; savedImage:string; displayName:string; itemInfo?:string;
 options:string[]; saved?:Partial<SaveNoteDraft>; ready:boolean;
 onSave:(draft:SaveNoteDraft)=>void; onRemove:()=>void;
 buttonClassName?:string; reasonClassName?:string; reasonGroupClassName?:string; skipSaveNote?:boolean;
};

// Both catalog saves and editorial bookmarks use the same SaveNote toggle.
// When disabled, saving is immediate with an empty note and no bottom sheet.
export function SaveNoteControl({name,title,savedImage,displayName,itemInfo,options,saved,ready,onSave,onRemove,buttonClassName='proto-save',reasonClassName,reasonGroupClassName,skipSaveNote=false}:Props){
 const {state,update}=usePrototype();
 const saveNoteEnabled=state.saveNoteEnabled!==false;
 const [open,setOpen]=useState(false);
 const [reasons,setReasons]=useState<string[]>([]);
 const [note,setNote]=useState('');
 const [showOffNotice,setShowOffNotice]=useState(false);
 const [guideStep,setGuideStep]=useState<number|null>(null);
 const guideNextRef=useRef<HTMLButtonElement>(null);
 const offNoticeRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!showOffNotice)return;
  const timeout=window.setTimeout(()=>setShowOffNotice(false),2500);
  return ()=>window.clearTimeout(timeout);
 },[showOffNotice]);
 useEffect(()=>{
  if(!showOffNotice)return;
  const notice=offNoticeRef.current;
  const sheet=document.querySelector<HTMLDialogElement>('dialog.bottom-sheet--editor[open]');
  if(!notice||!sheet)return;
  const positionNotice=()=>{
   const sheetTop=sheet.getBoundingClientRect().top;
   notice.style.top=`${Math.max(12,sheetTop-notice.getBoundingClientRect().height-24)}px`;
  };
  if(typeof notice.showPopover==='function')notice.showPopover();
  positionNotice();
  window.addEventListener('resize',positionNotice);
  return ()=>{
   window.removeEventListener('resize',positionNotice);
   if(typeof notice.hidePopover==='function'&&notice.matches(':popover-open'))notice.hidePopover();
  };
 },[showOffNotice]);
 const finishGuide=()=>{
  guideDismissedThisSession=true;
  try{window.localStorage.setItem(guideStorageKey,'seen');}catch{/* Remain dismissed in this tab. */}
  setGuideStep(null);
 };
 useEffect(()=>{if(guideStep!==null)guideNextRef.current?.focus();},[guideStep]);
 const save=()=>{onSave({reasons,note});setGuideStep(null);setOpen(false);};
 const edit=()=>{
  if(skipSaveNote||!saveNoteEnabled)return;
  setReasons(saved?.reasons||[]);
  setNote(saved?.note||'');
  setShowOffNotice(false);
  let showGuide=!guideDismissedThisSession;
  try{showGuide=showGuide&&window.localStorage.getItem(guideStorageKey)!=='seen';}catch{/* Still show once for this tab. */}
  setGuideStep(showGuide?0:null);
  setOpen(true);
 };
 const guideCard=(step:number)=>guideStep===step&&<div className={savenote.guideCard} role="region" aria-label={`SaveNote 사용 안내 ${step+1}단계`}>
  <span className={savenote.guideCount}>SAVENOTE · {step+1} / {guideSteps.length}</span>
  <strong>{guideSteps[step].title}</strong>
  <p>{guideSteps[step].description}</p>
  <div className={savenote.guideActions}>
   <button type="button" className={savenote.guideSkip} onClick={finishGuide}>건너뛰기</button>
   <button type="button" className={savenote.guideNext} ref={guideNextRef} onClick={()=>step===guideSteps.length-1?finishGuide():setGuideStep(step+1)}>{step===guideSteps.length-1?'완료':'다음 →'}</button>
  </div>
 </div>;
 const preview=saved?saveNotePreview({reasons:saved.reasons||[],note:saved.note||''}):{visible:[],hiddenCount:0};
 return <>
  <button type="button" disabled={!ready} className={buttonClassName} aria-label={`${name} ${saved?'저장 해제':'저장하기'}`} aria-pressed={!!saved} onClick={()=>{if(saved){onRemove();setGuideStep(null);setOpen(false);}else if(skipSaveNote||!saveNoteEnabled){onSave({reasons:[],note:''});setOpen(false);}else edit();}}>
   <SaveHeart saved={!!saved}/>
  </button>
  {reasonClassName&&preview.visible.length>0&&<div className={reasonGroupClassName}>
   {preview.visible.map((reason,index)=><button key={index} type="button" className={reasonClassName} aria-label={`${name} 저장 메모 수정: ${reason}`} title={reason} onClick={edit}>{reason}</button>)}
   {preview.hiddenCount>0&&<button type="button" className={savenote.reasonMore} aria-label={`${name} 저장 이유 ${preview.hiddenCount}개 더 보기`} onClick={edit}>+{preview.hiddenCount}</button>}
  </div>}
  <BottomSheet open={open} onClose={()=>{setOpen(false);setShowOffNotice(false);setGuideStep(null);}} title="SAVENOTE" variant="editor" headingAction={<span/>}>
   {showOffNotice&&<div ref={offNoticeRef} popover="manual" className={savenote.toggleNotice} role="status" aria-live="polite"><strong>OFF</strong><span>MY → 알림에서 다시 설정할 수 있어요.</span></div>}
   <div className={savenote.sheet}>
    {guideStep!==null&&<div className={savenote.guideScrim} aria-hidden="true"/>}
    <div className={savenote.heading}>
     <div><h3>{title}</h3></div>
     <div className={`${savenote.toggleAnchor}${guideStep===0?` ${savenote.guideFocus}`:''}`}>
      <GlassToggle checked={saveNoteEnabled} label="저장할 때 SAVENOTE 자동 열기" onChange={enabled=>{if(guideStep!==null)return;setShowOffNotice(!enabled);update(s=>({...s,saveNoteEnabled:enabled}));}}/>
      {guideCard(0)}
     </div>
    </div>
    <div className={savenote.savedItem}><img src={savedImage} alt="" /><div className={savenote.savedInfo}><strong>{displayName}</strong>{itemInfo&&<span>{itemInfo}</span>}</div></div>
    <div className={savenote.form}>
     <div className={`${savenote.options}${guideStep===1?` ${savenote.guideFocus}`:''}`}>{options.map(option=><SelectionChip key={option} aria-pressed={reasons.includes(option)} onClick={()=>{if(guideStep!==null)return;setReasons(current=>current.includes(option)?current.filter(r=>r!==option):[...current,option]);}}>{option}</SelectionChip>)}{guideCard(1)}</div>
     <div className={`${savenote.noteAnchor}${guideStep===2?` ${savenote.guideFocus}`:''}`}>
      <input type="text" className={savenote.note} aria-label="나만의 메모 (10자 이내)" placeholder="직접 적어보세요 (10자 이내)" value={note} maxLength={10} onChange={e=>{if(guideStep!==null)return;setNote(e.target.value);}} />
      {guideCard(2)}
     </div>
    </div>
    <button type="button" className={`${savenote.apply} primary-cta`} onClick={save}>적용하기</button>
    {saved&&<button type="button" className={savenote.remove} onClick={()=>{onRemove();setGuideStep(null);setOpen(false);}}>저장 해제</button>}
   </div>
  </BottomSheet>
 </>;
}
