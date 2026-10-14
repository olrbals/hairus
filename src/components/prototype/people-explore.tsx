'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useMemo,useState} from 'react';
import {BottomNav} from '@/components/bottom-nav';
import {BottomSheet} from '@/components/bottom-sheet';
import {asset,designers,itemHref,salons,type Item} from '@/lib/prototype/catalog';
import {SaveButton} from './shared';
import sheet from './people-explore.module.css';

type ExploreKind='designer'|'salon';
type FilterGroup={key:string;label:string;options:string[]};
type FilterValues=Record<string,string>;

const designerGroups:FilterGroup[]=[
 {key:'style',label:'전문 스타일',options:['전체','커트','펌','컬러']},
 {key:'experience',label:'경력',options:['전체','1년 미만','1 - 5년','5년 이상']},
 {key:'rating',label:'평점',options:['전체','4.5 이상','4.0 이상','3.5 이상','3.0 이상']},
];
const salonGroups:FilterGroup[]=[
 {key:'price',label:'가격대',options:['전체','저렴한 편','보통','고가']},
 {key:'designerCount',label:'디자이너',options:['전체','1인','5인 미만','대규모']},
 {key:'rating',label:'평점',options:['전체','4.5 이상','4.0 이상','3.5 이상','3.0 이상']},
];
const designerDetails:Record<string,{avatar:string;location:string;specialty:string;works:string[]}>={
 yoona:{avatar:asset('31628.png'),location:'아르보 성수  ·  성수동',specialty:'레이어드컷 · 샌드펌 전문',works:[asset('28f27.png'),asset('8b53e.png'),asset('5a15e.png')]},
 sohee:{avatar:asset('a91f5.png'),location:'아르보 성수  ·  성수동',specialty:'테슬컷 · 히피펌 전문',works:[asset('83c13.png'),asset('034ea.png'),asset('93dbc.png')]},
};
const allFilters=(groups:FilterGroup[])=>Object.fromEntries(groups.map(group=>[group.key,'전체'])) as FilterValues;

export function PeopleExplore({category}:{category:ExploreKind}){
 const router=useRouter();
 const [query,setQuery]=useState('');
 const [open,setOpen]=useState(false);
 const groups=category==='designer'?designerGroups:salonGroups;
 const [filters,setFilters]=useState<FilterValues>(()=>allFilters(groups));
 const [draft,setDraft]=useState<FilterValues>(()=>allFilters(groups));
 const items=category==='designer'?designers:salons;
 const results=useMemo(()=>items.filter(item=>`${item.name} ${item.english} ${item.tags.join(' ')} ${item.location||''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())),[items,query]);
 const openFilter=()=>{setDraft(filters);setOpen(true);};
 const reset=()=>{const cleared=allFilters(groups);setDraft(cleared);setFilters(cleared);};
 const label=category==='designer'?'디자이너':'헤어샵';
 return <>
  <main id="main" className={sheet.page}>
   <header className={sheet.header}>
    <button type="button" className={sheet.back} aria-label="뒤로 가기" onClick={()=>window.history.length>1?router.back():router.push('/home')}><img src={asset('30ced.svg')} alt="" aria-hidden="true"/></button>
   </header>
   <div className={sheet.content}>
    <h1>Discover</h1>
    <nav className={sheet.categoryTabs} aria-label="탐색 카테고리">
     <Link href="/explore">스타일</Link>
     <Link href="/explore?category=designer" aria-current={category==='designer'?'page':undefined}>디자이너</Link>
     <Link href="/explore?category=salon" aria-current={category==='salon'?'page':undefined}>헤어샵</Link>
    </nav>
    <label className={sheet.searchBox}>
     <img src={asset('45201.svg')} alt="" aria-hidden="true"/>
     <input aria-label={`${label} 검색`} placeholder="이름이나 지역을 검색하세요" value={query} onChange={event=>setQuery(event.target.value)}/>
     <button type="button" className={sheet.filterTrigger} aria-label={`${label} FILTER`} onClick={openFilter}><span/><span/><span/></button>
    </label>
    <div className={sheet.listMeta}><span>{results.length}명의 {label}</span><span>추천순⌄</span></div>
    {category==='designer'?<DesignerList items={results}/>:<SalonList items={results}/>} 
   </div>
  </main>
  <BottomNav active="/explore"/>
  <BottomSheet open={open} onClose={()=>setOpen(false)} title="필터" headingAction={<button type="button" className={sheet.reset} onClick={reset}>초기화</button>}>
   <div className={sheet.filterSheet}>
    <section className={sheet.locationGroup}>
     <h3>지역</h3>
     <button type="button" className={sheet.location} aria-label="지역 서울특별시 서초동"><span>⌖</span>서울특별시 서초동 <b>⌄</b></button>
    </section>
    {groups.map(group=><section key={group.key} className={sheet.filterGroup}>
     <h3>{group.label}</h3>
     <div className={sheet.options}>
      {group.options.map(option=><button type="button" key={option} aria-pressed={draft[group.key]===option} onClick={()=>setDraft(current=>({...current,[group.key]:current[group.key]===option?'전체':option}))}>{option}</button>)}
     </div>
    </section>)}
    <button type="button" className={sheet.apply} onClick={()=>{setFilters(draft);setOpen(false);}}>적용하기</button>
   </div>
  </BottomSheet>
 </>;
}

function DesignerList({items}:{items:Item[]}){return <div className={sheet.designerList}>{items.map(item=>{
 const detail=designerDetails[item.id];
 return <article className={sheet.designerCard} key={item.id}>
  <Link href={itemHref(item)} className={sheet.designerLink}>
   <div className={sheet.designerSummary}><img src={detail?.avatar||item.image} alt=""/><div><h2>{item.name} 디자이너</h2><p>{detail?.location||item.location}</p><small>{detail?.specialty||item.tags.join(' · ')}</small></div></div>
   <div className={sheet.works}>{(detail?.works||[item.image,item.image,item.image]).map((image,index)=><img key={`${image}-${index}`} src={image} alt={`${item.name} 포트폴리오 ${index+1}`}/>)}</div>
  </Link>
  <SaveButton item={item}/>
 </article>;
 })}</div>;}

function SalonList({items}:{items:Item[]}){return <div className={sheet.salonList}>{items.map(item=><article className={sheet.salonCard} key={item.id}>
 <Link href={itemHref(item)} className={sheet.salonLink}><img src={item.image} alt={item.name}/><div className={sheet.rating}>★ 4.87</div><h2>{item.name}</h2><p>{item.location}</p></Link>
 <SaveButton item={item}/>
</article>)}</div>;}
