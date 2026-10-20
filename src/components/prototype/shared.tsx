'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {type ReactNode} from 'react';
import {BottomNav} from '@/components/bottom-nav';
import {HeaderBackIcon} from '@/components/primitives';
import {itemHref,salons,type Item} from '@/lib/prototype/catalog';
import {designerDetails} from '@/lib/prototype/people-presentation';
import {usePrototype} from './store';
import {SaveNoteControl} from './save-note-control';
export function Screen({title,children,tab,back='/home',actions}:{title:string;children:ReactNode;tab?:'/home'|'/explore'|'/saved'|'/my';back?:string;actions?:ReactNode}){const router=useRouter();return <><main id="main" className="prototype"><header className="proto-header hairus-page-header">{tab?<Link className="wordmark" href="/home">HAIRUS</Link>:<button aria-label="뒤로 가기" className="back hairus-header-back" onClick={()=>window.history.length>1?router.back():router.push(back)}><HeaderBackIcon/></button>}<span>{tab?'INTERACTIVE V1':title}</span>{actions||<Link href="/my" aria-label="마이페이지">MY</Link>}</header><div className="proto-content"><h1 className="editorial-title">{title}</h1>{children}</div></main>{tab&&<BottomNav active={tab}/>}</>;}
export function Action({href,children,secondary=false}:{href:string;children:ReactNode;secondary?:boolean}){return <Link className={`button button--${secondary?'plain':'primary'}`} href={href}>{children}</Link>;}
export function Card({item,linked=true,showSave=true}:{item:Item;linked?:boolean;showSave?:boolean}){const content=<><img src={item.image} alt={item.name} loading="lazy"/><h3>{item.name}</h3><p>{item.location||item.tags.join(' · ')}</p></>;return <article className={`proto-card ${item.kind}`}>{linked?<Link href={itemHref(item)}>{content}</Link>:<div>{content}</div>}{showSave&&<SaveButton item={item}/>}</article>;}
export function Cards({items}:{items:Item[]}){return <div className="proto-grid">{items.map(item=><Card item={item} key={`${item.kind}:${item.id}`}/>)}</div>;}
export function Chips({options,selected,onSelect}:{options:string[];selected:string[];onSelect:(v:string)=>void}){return <div className="chips">{options.map(option=><button key={option} aria-pressed={selected.includes(option)} onClick={()=>onSelect(option)}>{option}</button>)}</div>;}
export function SaveButton({item,reasonClassName,reasonGroupClassName}:{item:Item;reasonClassName?:string;reasonGroupClassName?:string}){
 const {state,update,ready}=usePrototype();
 const saved=state.saved.find(s=>s.id===item.id&&s.kind===item.kind);
 const options=item.kind==='style'
  ?['나중에 도전','분위기 참고','나에게 어울림','상담할 때 보여줄 사진','스타일링 참고']
  :item.kind==='designer'
  ?['예약하고 싶음','시술 결과 좋음','후기 좋음','취향 잘 맞음']
  :['방문하고 싶음','위치 좋음','매장 분위기 좋음','가격 괜찮음'];
 const displayName=item.kind==='designer'?`${item.name} 디자이너`:item.name;
 const itemInfo=item.kind==='salon'?item.location:item.kind==='designer'
  ?(item.id==='jisu'||item.id==='seeun')
   ?designerDetails[item.id]?.location||item.location
   :[salons.find(salon=>salon.id===item.salonId)?.name,item.location].filter(Boolean).join(' · ')
  :undefined;
 const savedImage=item.kind==='designer'&&item.id==='sohee'?designerDetails.sohee.avatar:item.image;
 const title=item.kind==='style'?'이 스타일, 왜 저장하나요?':item.kind==='designer'?'이 디자이너, 왜 저장하나요?':'이 헤어샵, 왜 저장하나요?';
 return <SaveNoteControl name={item.name} title={title} savedImage={savedImage} displayName={displayName} itemInfo={itemInfo} options={options} saved={saved} ready={ready} reasonClassName={reasonClassName} reasonGroupClassName={reasonGroupClassName}
  onSave={draft=>update(s=>{const current=s.saved.find(i=>i.kind===item.kind&&i.id===item.id);const entry={...draft,id:item.id,kind:item.kind,savedAt:current?.savedAt||new Date().toISOString()};return {...s,saved:current?s.saved.map(i=>i.kind===item.kind&&i.id===item.id?entry:i):[...s.saved,entry]};})}
  onRemove={()=>update(s=>({...s,saved:s.saved.filter(i=>i.kind!==item.kind||i.id!==item.id)}))}/>;
}
export function DemoNotice({children}:{children?:ReactNode}){return <p className="demo-notice">{children||'데모 콘텐츠 · 실제 서비스 정보와 다를 수 있어요.'}</p>;}
