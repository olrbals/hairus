'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useMemo,useState} from 'react';
import {BottomNav} from '@/components/bottom-nav';
import {BottomSheet} from '@/components/bottom-sheet';
import {HeaderBackIcon} from '@/components/primitives';
import {asset,designers,itemHref,salons,type Item} from '@/lib/prototype/catalog';
import {SaveButton} from './shared';
import {designerDetails} from '@/lib/prototype/people-presentation';
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
const provinces=['전체','서울특별시','부산광역시','대구광역시','인천광역시','광주광역시','대전광역시','울산광역시','세종특별자치시','경기도','강원특별자치도','충청북도','충청남도','전북특별자치도','전라남도','경상북도','경상남도','제주특별자치도'];
const salonDetails:Record<string,{rating:string;location:string}>={
 arvo:{rating:'4.87',location:'서울 성동구 성수동  ·  성수역 도보 3분'},
 moodon:{rating:'4.84',location:'서울 서초구 논현동  ·  신논현역 도보 5분'},
 ongyeol:{rating:'4.84',location:'서울 성동구 성동구  ·  성수역 도보 5분'},
 'ob-hair':{rating:'4.84',location:'서울 성동구 성동구  ·  성수역 도보 5분'},
 noir:{rating:'4.84',location:'서울 성동구 성동구  ·  성수역 도보 5분'},
};
const allFilters=(groups:FilterGroup[])=>({...Object.fromEntries(groups.map(group=>[group.key,'전체'])),region:'전체'}) as FilterValues;

export function PeopleExplore({category}:{category:ExploreKind}){
 const router=useRouter();
 const [query,setQuery]=useState('');
 const [open,setOpen]=useState(false);
 const [regionOpen,setRegionOpen]=useState(false);
 const groups=category==='designer'?designerGroups:salonGroups;
 const [filters,setFilters]=useState<FilterValues>(()=>allFilters(groups));
 const [draft,setDraft]=useState<FilterValues>(()=>allFilters(groups));
 const appliedCount=Object.values(filters).filter(value=>value!=='전체').length;
 const items=category==='designer'?designers:salons;
 const results=useMemo(()=>items.filter(item=>`${item.name} ${item.english} ${item.tags.join(' ')} ${item.location||''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())),[items,query]);
 const openFilter=()=>{setDraft(filters);setRegionOpen(false);setOpen(true);};
 const reset=()=>{const cleared=allFilters(groups);setDraft(cleared);setFilters(cleared);setRegionOpen(false);};
 const label=category==='designer'?'디자이너':'헤어샵';
 return <>
  <main id="main" className={sheet.page}>
   <header className={`${sheet.header} hairus-page-header`}>
    <button type="button" className={`${sheet.back} hairus-header-back`} aria-label="뒤로 가기" onClick={()=>window.history.length>1?router.back():router.push('/home')}><HeaderBackIcon/></button>
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
    </label>
    <div className={sheet.listMeta}><span>{results.length} {category==='designer'?'DESIGNERS':'SALONS'}</span><button type="button" className={sheet.filterAction} aria-label={`${label} 필터 열기`} onClick={openFilter}><span>FILTER</span>{appliedCount>0&&<span className={sheet.filterCount} aria-label={`적용된 필터 ${appliedCount}개`}>{appliedCount}</span>}<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M3 5h14M6 10h8M8 15h4"/></svg></button></div>
    {category==='designer'?<DesignerList items={results}/>:<SalonList items={results}/>} 
   </div>
  </main>
  <BottomNav active="/explore"/>
  <BottomSheet open={open} onClose={()=>setOpen(false)} title="필터" headingAction={<button type="button" className="sheet-close" onClick={()=>setOpen(false)} aria-label="필터 닫기">X</button>}>
   <div className={sheet.filterSheet}>
    <section className={sheet.locationGroup}>
     <h3>지역</h3>
     <button type="button" className={sheet.location} aria-expanded={regionOpen} onClick={()=>setRegionOpen(current=>!current)}><span>{draft.region==='전체'?'전체 지역':draft.region}</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>
     {regionOpen&&<div className={sheet.regionOptions} role="listbox" aria-label="시도 선택">{provinces.map(province=><button type="button" role="option" aria-selected={draft.region===province} key={province} onClick={()=>{setDraft(current=>({...current,region:province}));setRegionOpen(false);}}><span>{province}</span>{draft.region===province&&<svg aria-hidden="true" viewBox="0 0 16 16"><path d="m3 8 3.2 3.2L13 4.5"/></svg>}</button>)}</div>}
    </section>
    {groups.map(group=><section key={group.key} className={sheet.filterGroup}>
     <h3>{group.label}</h3>
     <div className={`${sheet.options} filter-editor-chips`}>
      {group.options.map(option=><button type="button" key={option} aria-pressed={draft[group.key]===option} onClick={()=>setDraft(current=>({...current,[group.key]:current[group.key]===option?'전체':option}))}>{option}</button>)}
     </div>
    </section>)}
    <button type="button" className={`${sheet.apply} primary-cta filter-sheet-apply`} onClick={()=>{setFilters(draft);setOpen(false);}}>적용하기</button>
    <button type="button" className="text-action clear-field" onClick={reset}>초기화</button>
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

function SalonList({items}:{items:Item[]}){return <div className={sheet.salonList}>{items.map(item=>{const detail=salonDetails[item.id];return <article className={sheet.salonCard} key={item.id}>
 <Link href={itemHref(item)} className={sheet.salonLink}><img src={item.image} alt={item.name}/><div className={sheet.rating}>★ {detail?.rating||'–'}</div><h2>{item.name}</h2><p>{detail?.location||item.location}</p></Link>
 <SaveButton item={item}/>
</article>;})}</div>;}
