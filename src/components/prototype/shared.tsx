'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {BottomNav} from '@/components/bottom-nav';
import {BottomSheet} from '@/components/bottom-sheet';
import {itemHref,salons,type Item} from '@/lib/prototype/catalog';
import {usePrototype} from './store';
import savenote from './savenote.module.css';
import {saveNotePreview} from '@/lib/prototype/archive';
export function Screen({title,children,tab,back='/home',actions}:{title:string;children:ReactNode;tab?:'/home'|'/explore'|'/saved'|'/my';back?:string;actions?:ReactNode}){const router=useRouter();return <><main id="main" className="prototype"><header className="proto-header">{tab?<Link className="wordmark" href="/home">HAIRUS</Link>:<button aria-label="뒤로 가기" className="back" onClick={()=>window.history.length>1?router.back():router.push(back)}>←</button>}<span>{tab?'INTERACTIVE V1':title}</span>{actions||<Link href="/my" aria-label="마이페이지">MY</Link>}</header><div className="proto-content"><h1 className="editorial-title">{title}</h1>{children}</div></main>{tab&&<BottomNav active={tab}/>}</>;}
export function Action({href,children,secondary=false}:{href:string;children:ReactNode;secondary?:boolean}){return <Link className={`button button--${secondary?'plain':'primary'}`} href={href}>{children}</Link>;}
export function Card({item}:{item:Item}){return <article className={`proto-card ${item.kind}`}><Link href={itemHref(item)}><img src={item.image} alt={item.name} loading="lazy"/><h3>{item.name}</h3><p>{item.location||item.tags.join(' · ')}</p></Link><SaveButton item={item}/></article>;}
export function Cards({items}:{items:Item[]}){return <div className="proto-grid">{items.map(item=><Card item={item} key={`${item.kind}:${item.id}`}/>)}</div>;}
export function Chips({options,selected,onSelect}:{options:string[];selected:string[];onSelect:(v:string)=>void}){return <div className="chips">{options.map(option=><button key={option} aria-pressed={selected.includes(option)} onClick={()=>onSelect(option)}>{option}</button>)}</div>;}
export function SaveButton({item,reasonClassName,reasonGroupClassName}:{item:Item;reasonClassName?:string;reasonGroupClassName?:string}){
 const {state,update,ready}=usePrototype();
 const saved=state.saved.find(s=>s.id===item.id&&s.kind===item.kind);
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
 const options=item.kind==='style'
  ?['나중에 도전','분위기 참고','나에게 어울림','상담할 때 보여줄 사진','스타일링 참고']
  :item.kind==='designer'
  ?['예약하고 싶음','시술 결과 좋음','후기 좋음','취향 잘 맞음']
  :['방문하고 싶음','위치 좋음','매장 분위기 좋음','가격 괜찮음'];
 const displayName=item.kind==='designer'?`${item.name} 디자이너`:item.name;
 const itemInfo=item.kind==='salon'?item.location:item.kind==='designer'?[salons.find(salon=>salon.id===item.salonId)?.name,item.location].filter(Boolean).join(' · '):undefined;
 const title=item.kind==='style'?'이 스타일, 왜 저장했나요?':item.kind==='designer'?'이 디자이너, 왜 저장했나요?':'이 헤어샵, 왜 저장했나요?';
 const save=()=>{const entry={id:item.id,kind:item.kind,reasons,note,savedAt:saved?.savedAt||new Date().toISOString()};update(s=>({...s,saved:saved?s.saved.map(i=>i.kind===item.kind&&i.id===item.id?entry:i):[...s.saved,entry]}));setOpen(false);};
 const edit=()=>{setReasons(saved?.reasons||[]);setNote(saved?.note||'');setShowOffNotice(false);setOpen(true);};
 const preview=saved?saveNotePreview(saved):{visible:[],hiddenCount:0};
 return <>
  <button disabled={!ready} className="proto-save" aria-label={`${item.name} ${saved?'저장 메모 수정':'저장하기'}`} aria-pressed={!!saved} onClick={()=>{if(!saved&&!saveNoteEnabled){update(s=>({...s,saved:[...s.saved,{id:item.id,kind:item.kind,reasons:[],note:'',savedAt:new Date().toISOString()}]}));return;}edit();}}>
   {saved?'♥':<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555551" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{display:'block'}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/></svg>}
  </button>
  {reasonClassName&&preview.visible.length>0&&<div className={reasonGroupClassName}>
   {preview.visible.map((reason,index)=><button key={index} type="button" className={reasonClassName} aria-label={`${item.name} 저장 메모 수정: ${reason}`} title={reason} onClick={edit}>{reason}</button>)}
   {preview.hiddenCount>0&&<button type="button" className={savenote.reasonMore} aria-label={`${item.name} 저장 이유 ${preview.hiddenCount}개 더 보기`} onClick={edit}>+{preview.hiddenCount}</button>}
  </div>}
  <BottomSheet open={open} onClose={()=>{setOpen(false);setShowOffNotice(false);}} title="SAVENOTE" variant="editor" headingAction={<span/>}>
   {showOffNotice&&<div ref={offNoticeRef} popover="manual" className={savenote.toggleNotice} role="status" aria-live="polite"><strong>OFF</strong><span>MY → 알림에서 다시 설정할 수 있어요.</span></div>}
   <div className={savenote.sheet}>
    <div className={savenote.heading}>
     <div><h3>{title}</h3><p>나중에 다시 볼 나만의 이유를 남겨보세요.</p></div>
     <button type="button" className={savenote.toggle} role="switch" aria-checked={saveNoteEnabled} aria-label="저장할 때 SAVENOTE 자동 열기" onClick={()=>{setShowOffNotice(saveNoteEnabled);update(s=>({...s,saveNoteEnabled:!(s.saveNoteEnabled!==false)}));}}><span className={savenote.toggleThumb}/></button>
    </div>
    <div className={savenote.savedItem}><img src={item.image} alt="" /><div className={savenote.savedInfo}><strong>{displayName}</strong>{itemInfo&&<span>{itemInfo}</span>}</div></div>
    <div className={savenote.form}>
     <p className={savenote.intro}>간편하게 선택하거나 직접 적어보세요.</p>
     <div className={savenote.options}>{options.map(option=><button type="button" key={option} aria-pressed={reasons.includes(option)} onClick={()=>setReasons(current=>current.includes(option)?current.filter(r=>r!==option):[...current,option])}>{option}</button>)}</div>
     <textarea className={savenote.note} rows={1} aria-label="나만의 메모" placeholder="직접 적어보세요." value={note} maxLength={500} onChange={e=>setNote(e.target.value)}/>
    </div>
    <button type="button" className={`${savenote.apply} primary-cta`} onClick={save}>적용하기</button>
    {saved&&<button type="button" className={savenote.remove} onClick={()=>{update(s=>({...s,saved:s.saved.filter(i=>!(i.kind===item.kind&&i.id===item.id))}));setOpen(false);}}>저장 해제</button>}
   </div>
  </BottomSheet>
 </>;
}
export function DemoNotice({children}:{children?:ReactNode}){return <p className="demo-notice">{children||'데모 콘텐츠 · 실제 서비스 정보와 다를 수 있어요.'}</p>;}
