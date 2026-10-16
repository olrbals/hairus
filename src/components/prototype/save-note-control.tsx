'use client';
import {useEffect,useRef,useState} from 'react';
import {BottomSheet} from '@/components/bottom-sheet';
import {SelectionChip} from '@/components/selection-chip';
import {saveNotePreview} from '@/lib/prototype/archive';
import {SaveHeart} from './save-heart';
import {usePrototype} from './store';
import savenote from './savenote.module.css';

export type SaveNoteDraft = {reasons:string[];note:string};
type Props = {
 name:string; title:string; savedImage:string; displayName:string; itemInfo?:string;
 options:string[]; saved?:Partial<SaveNoteDraft>; ready:boolean;
 onSave:(draft:SaveNoteDraft)=>void; onRemove:()=>void;
 buttonClassName?:string; reasonClassName?:string; reasonGroupClassName?:string;
};

// Both catalog saves and editorial bookmarks use the same current-state policy.
// A past save (or the legacy automatic-note preference) never skips a new note.
export function SaveNoteControl({name,title,savedImage,displayName,itemInfo,options,saved,ready,onSave,onRemove,buttonClassName='proto-save',reasonClassName,reasonGroupClassName}:Props){
 const {state,update}=usePrototype();
 const saveNoteEnabled=state.saveNoteEnabled!==false;
 const [open,setOpen]=useState(false);
 const [reasons,setReasons]=useState<string[]>([]);
 const [note,setNote]=useState('');
 const [showOffNotice,setShowOffNotice]=useState(false);
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
 const save=()=>{onSave({reasons,note});setOpen(false);};
 const edit=()=>{setReasons(saved?.reasons||[]);setNote(saved?.note||'');setShowOffNotice(false);setOpen(true);};
 const preview=saved?saveNotePreview({reasons:saved.reasons||[],note:saved.note||''}):{visible:[],hiddenCount:0};
 return <>
  <button type="button" disabled={!ready} className={buttonClassName} aria-label={`${name} ${saved?'저장 해제':'저장하기'}`} aria-pressed={!!saved} onClick={()=>{if(saved){onRemove();setOpen(false);}else edit();}}>
   <SaveHeart saved={!!saved}/>
  </button>
  {reasonClassName&&preview.visible.length>0&&<div className={reasonGroupClassName}>
   {preview.visible.map((reason,index)=><button key={index} type="button" className={reasonClassName} aria-label={`${name} 저장 메모 수정: ${reason}`} title={reason} onClick={edit}>{reason}</button>)}
   {preview.hiddenCount>0&&<button type="button" className={savenote.reasonMore} aria-label={`${name} 저장 이유 ${preview.hiddenCount}개 더 보기`} onClick={edit}>+{preview.hiddenCount}</button>}
  </div>}
  <BottomSheet open={open} onClose={()=>{setOpen(false);setShowOffNotice(false);}} title="SAVENOTE" variant="editor" headingAction={<span/>}>
   {showOffNotice&&<div ref={offNoticeRef} popover="manual" className={savenote.toggleNotice} role="status" aria-live="polite"><strong>OFF</strong><span>MY → 알림에서 다시 설정할 수 있어요.</span></div>}
   <div className={savenote.sheet}>
    <div className={savenote.heading}>
     <div><h3>{title}</h3><p>나중에 다시 볼 나만의 이유를 남겨보세요.</p></div>
     <button type="button" className={savenote.toggle} role="switch" aria-checked={saveNoteEnabled} aria-label="저장할 때 SAVENOTE 자동 열기" onClick={()=>{setShowOffNotice(saveNoteEnabled);update(s=>({...s,saveNoteEnabled:!(s.saveNoteEnabled!==false)}));}}><span className={savenote.toggleThumb}/></button>
    </div>
    <div className={savenote.savedItem}><img src={savedImage} alt="" /><div className={savenote.savedInfo}><strong>{displayName}</strong>{itemInfo&&<span>{itemInfo}</span>}</div></div>
    <div className={savenote.form}>
     <p className={savenote.intro}>간편하게 선택하거나 직접 적어보세요.</p>
     <div className={savenote.options}>{options.map(option=><SelectionChip key={option} aria-pressed={reasons.includes(option)} onClick={()=>setReasons(current=>current.includes(option)?current.filter(r=>r!==option):[...current,option])}>{option}</SelectionChip>)}</div>
     <textarea className={savenote.note} rows={1} aria-label="나만의 메모" placeholder="직접 적어보세요." value={note} maxLength={500} onChange={e=>setNote(e.target.value)}/>
    </div>
    <button type="button" className={`${savenote.apply} primary-cta`} onClick={save}>적용하기</button>
    {saved&&<button type="button" className={savenote.remove} onClick={()=>{onRemove();setOpen(false);}}>저장 해제</button>}
   </div>
  </BottomSheet>
 </>;
}
