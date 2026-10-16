'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useMemo,useRef,useState} from 'react';
import {BottomNav} from '@/components/bottom-nav';
import {BottomSheet} from '@/components/bottom-sheet';
import {SelectionChip} from '@/components/selection-chip';
import {HeaderBackIcon} from '@/components/primitives';
import {asset,itemHref,styles,type Item} from '@/lib/prototype/catalog';
import {SaveButton} from './shared';
import sheet from './style-explore.module.css';

type FilterKey='length'|'styleType'|'bangs'|'curl';
type Filters=Record<FilterKey,string>;

const emptyFilters:Filters={length:'전체',styleType:'전체',bangs:'전체',curl:'전체'};
const filterGroups:{key:FilterKey;label:string;options:string[]}[]=[
 {key:'length',label:'길이',options:['전체','쇼트','미디엄','롱']},
 {key:'styleType',label:'스타일 종류',options:['전체','커트','펌','컬러']},
 {key:'bangs',label:'앞머리',options:['전체','있음','없음']},
 {key:'curl',label:'컬 강도',options:['전체','자연스러운 컬','강한 컬','없음']},
];
const styleFacets:Record<string,Omit<Filters,'length'>>={
 airy:{styleType:'커트',bangs:'없음',curl:'없음'},
 tassel:{styleType:'커트',bangs:'없음',curl:'없음'},
 sand:{styleType:'펌',bangs:'없음',curl:'자연스러운 컬'},
 hush:{styleType:'커트',bangs:'있음',curl:'없음'},
 pixie:{styleType:'커트',bangs:'있음',curl:'없음'},
 straight:{styleType:'커트',bangs:'없음',curl:'없음'},
 face:{styleType:'커트',bangs:'없음',curl:'없음'},
 fringe:{styleType:'커트',bangs:'있음',curl:'없음'},
};
const lengthLabels:Record<string,string>={SHORT:'쇼트',MEDIUM:'미디엄',LONG:'롱'};

function filterCount(filters:Filters){return Object.values(filters).filter(value=>value!=='전체').length;}

export function StyleExplore(){
 const router=useRouter();
 const [query,setQuery]=useState('');
 const [filters,setFilters]=useState<Filters>(emptyFilters);
 const [draft,setDraft]=useState<Filters>(emptyFilters);
 const [open,setOpen]=useState(false);
 const imageInput=useRef<HTMLInputElement>(null);
 const [imageError,setImageError]=useState('');
 const chooseImage=(file?:File)=>{
  if(!file)return;
  if(!file.type.startsWith('image/')){setImageError('이미지 파일을 선택해 주세요.');return;}
  if(file.size>10*1024*1024){setImageError('10MB 이하의 이미지를 선택해 주세요.');return;}
  setImageError('');
  router.push('/styles/airy');
 };
 const appliedCount=filterCount(filters);
 const result=useMemo(()=>styles.filter(item=>{
  const searchable=`${item.name} ${item.english} ${item.tags.join(' ')}`.toLocaleLowerCase();
  if(!searchable.includes(query.trim().toLocaleLowerCase()))return false;
  const facets={length:lengthLabels[item.tags[0]],...styleFacets[item.id]};
  return filterGroups.every(({key})=>filters[key]==='전체'||filters[key]===facets[key]);
 }),[filters,query]);
 const selectQuickLength=(value:string)=>setFilters(current=>({...current,length:value==='ALL'?'전체':lengthLabels[value]}));
 const openFilter=()=>{setDraft(filters);setOpen(true);};

 return <>
  <main id="main" className={sheet.page}>
   <header className={`${sheet.header} hairus-page-header`}>
    <button type="button" className={`${sheet.back} hairus-header-back`} aria-label="뒤로 가기" onClick={()=>window.history.length>1?router.back():router.push('/home')}>
     <HeaderBackIcon/>
    </button>
   </header>
   <div className={sheet.content}>
    <h1>Discover</h1>
    <nav className={sheet.categoryTabs} aria-label="탐색 카테고리">
     <Link href="/explore" aria-current="page">스타일</Link>
     <Link href="/explore?category=designer">디자이너</Link>
     <Link href="/explore?category=salon">헤어샵</Link>
    </nav>
    <div className={sheet.searchBox}>
     <img src={asset('45201.svg')} alt="" aria-hidden="true"/>
     <input aria-label="스타일 검색" placeholder="원하는 헤어스타일을 검색하세요" value={query} onChange={event=>setQuery(event.target.value)}/>
     <input ref={imageInput} className={sheet.imageInput} type="file" accept="image/*" aria-label="참고 이미지 선택" onChange={event=>{chooseImage(event.target.files?.[0]);event.target.value='';}}/>
     <button type="button" aria-label="사진첩에서 이미지 선택" title="이미지 선택" onClick={()=>imageInput.current?.click()}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 18 5.5-5.5 3.5 3.5 2.5-2.5 4.5 4.5"/></svg>
     </button>
    </div>
    {imageError&&<p className={sheet.imageError} role="alert">{imageError}</p>}
    <div className={sheet.quickFilters} aria-label="기장 빠른 필터">
     {['ALL','SHORT','MEDIUM','LONG'].map(value=><button key={value} type="button" aria-pressed={(value==='ALL'?filters.length==='전체':filters.length===lengthLabels[value])} onClick={()=>selectQuickLength(value)}>{value}</button>)}
    </div>
    <div className={sheet.resultBar}>
     <span>{result.length} styles</span>
     <button type="button" onClick={openFilter} aria-label="스타일 필터 열기"><span>FILTER</span>{appliedCount>0&&<span className={sheet.filterCount} aria-label={`적용된 필터 ${appliedCount}개`}>{appliedCount}</span>}<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M3 5h14M6 10h8M8 15h4"/></svg></button>
    </div>
    {result.length?<div className={sheet.grid}>{result.map(item=><StyleCard item={item} key={item.id}/>)}</div>:<div className={sheet.empty}><p>조건에 맞는 스타일이 없어요.</p><button type="button" onClick={()=>{setQuery('');setFilters(emptyFilters);}}>검색 조건 초기화</button></div>}
   </div>
  </main>
  <BottomNav active="/explore"/>
  <BottomSheet open={open} onClose={()=>setOpen(false)} title="필터" headingAction={<button type="button" className="sheet-close analysis-sheet-close-text" onClick={()=>setOpen(false)} aria-label="필터 닫기">닫음</button>}>
   <div className={sheet.filterSheet}>
    {filterGroups.map(({key,label,options})=><section key={key} className={sheet.filterGroup}>
     <h3>{label}</h3>
     <div className={`${sheet.filterOptions} filter-editor-chips`}>
      {options.map(option=><SelectionChip key={option} aria-pressed={draft[key]===option} onClick={()=>setDraft(current=>({...current,[key]:option}))}>{option}</SelectionChip>)}
     </div>
    </section>)}
    <button type="button" className={`${sheet.apply} primary-cta filter-sheet-apply`} onClick={()=>{setFilters(draft);setOpen(false);}}>적용하기</button>
   </div>
  </BottomSheet>
 </>;
}

function StyleCard({item}:{item:Item}){return <article className={sheet.card}>
 <Link href={itemHref(item)}><img src={item.image} alt={item.name}/><h2>{item.name}</h2></Link>
 <SaveButton item={item}/>
</article>;}
