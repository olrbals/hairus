'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useRef, useState} from 'react';
import {BottomNav} from '@/components/bottom-nav';
import {asset, findItem, itemHref, salons, type Item, type Kind} from '@/lib/prototype/catalog';
import {designerDetails} from '@/lib/prototype/people-presentation';
import {findEditorial, type Editorial} from '@/lib/prototype/editorials';
import {Action, SaveButton} from './shared';
import {usePrototype} from './store';
import {EditorialBookmarkButton, useEditorialBookmarks} from './editorial-bookmark';
import css from './saved.module.css';

type Category = Kind | 'magazine';
const categories: {id: Category; label: string; empty: string; href: string}[] = [
  {id: 'style', label: '스타일', empty: '아직 저장한 스타일이 없어요.', href: '/explore'},
  {id: 'designer', label: '디자이너', empty: '아직 저장한 디자이너가 없어요.', href: '/explore?category=designer'},
  {id: 'salon', label: '헤어샵', empty: '아직 저장한 헤어샵이 없어요.', href: '/explore?category=salon'},
  {id: 'magazine', label: '매거진', empty: '아직 스크랩한 매거진이 없어요.', href: '/magazine'},
];

export function Saved() {
  const router = useRouter();
  const {state, ready} = usePrototype();
  const {bookmarks, ready: bookmarksReady} = useEditorialBookmarks();
  const [kind, setKind] = useState<Category>('style');
  const [query, setQuery] = useState('');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const category = categories.find(category => category.id === kind)!;
  const matches = (text: string) => text.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
  const items = state.saved.filter(saved => saved.kind === kind).map(saved => findItem(saved.kind, saved.id)).filter((item): item is Item => !!item);
  const results = items.filter(item => matches([item.name, item.english, item.location, item.tags.join(' '), designerDetails[item.id]?.location].join(' ')));
  const magazines = bookmarks.map(bookmark => findEditorial(bookmark.kind, bookmark.id)).filter((item): item is Editorial => !!item);
  const magazineResults = magazines.filter(item => matches(`${item.title} ${item.label}`));
  const loaded = ready && bookmarksReady;
  const count = kind === 'magazine' ? magazines.length : items.length;
  const resultCount = kind === 'magazine' ? magazineResults.length : results.length;
  function select(index: number) {setKind(categories[index].id); setQuery('');}

  return <>
    <main id="main" className={css.page}>
      <header className={css.header}><button type="button" className={css.back} aria-label="뒤로 가기" onClick={() => window.history.length > 1 ? router.back() : router.push('/home')}><img src={asset('30ced.svg')} alt=""/></button></header>
      <div className={css.content}>
        <h1>Archive</h1>
        <div className={css.tabs} role="tablist" aria-label="저장 카테고리">
          {categories.map((category, index) => <button key={category.id} ref={element => {tabs.current[index] = element;}} type="button" role="tab" id={`archive-tab-${category.id}`} aria-selected={kind === category.id} aria-controls="archive-panel" tabIndex={kind === category.id ? 0 : -1} onClick={() => select(index)} onKeyDown={event => {
            const next = event.key === 'ArrowRight' ? (index + 1) % 4 : event.key === 'ArrowLeft' ? (index + 3) % 4 : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : undefined;
            if (next !== undefined) {event.preventDefault(); select(next); tabs.current[next]?.focus();}
          }}>{category.label}</button>)}
        </div>
        <label className={css.search}><img src={asset('45201.svg')} alt="" aria-hidden="true"/><input type="search" aria-label={`저장한 ${category.label} 검색`} placeholder={`저장한 ${category.label} 검색`} value={query} onChange={event => setQuery(event.target.value)}/></label>
        <div id="archive-panel" role="tabpanel" aria-labelledby={`archive-tab-${kind}`} className={css.panel}>
          {!loaded ? <p role="status" className={css.empty}>저장한 항목을 불러오는 중이에요.</p> : !count ? <div className={css.empty}><p>{category.empty}</p><Action href={category.href}>{category.label} 둘러보기</Action></div> : !resultCount ? <div className={css.empty}><p>검색 결과가 없어요.</p><button type="button" className="button button--primary" onClick={() => setQuery('')}>검색 초기화</button></div> : kind === 'magazine' ? <div className={css.magazines}>{magazineResults.map(item => <article key={`${item.kind}:${item.id}`} className={css.magazineCard}>
            <Link href={item.href}><img src={item.image} alt={item.title}/><span>{item.label}</span><h2>{item.title}</h2></Link>
            <EditorialBookmarkButton item={item}/>
          </article>)}</div> : <div className={kind === 'style' ? css.styles : css.list}>{results.map(item => <SavedCard key={`${item.kind}:${item.id}`} item={item}/>)}</div>}
        </div>
      </div>
    </main>
    <BottomNav active="/saved"/>
  </>;
}

function SavedCard({item}: {item: Item}) {
  if (item.kind === 'style') return <article className={css.styleCard}>
    <Link href={itemHref(item)}><img src={item.image} alt={item.name}/><h2>{item.name}</h2></Link>
    <SaveButton item={item} reasonClassName={css.reason}/>
  </article>;
  if (item.kind === 'designer') {
    const detail = designerDetails[item.id];
    const salon = detail?.location.split(/\s+·\s+/)[0] || salons.find(salon => salon.id === item.salonId)?.name;
    return <article className={css.designerCard}>
      <Link href={itemHref(item)} className={css.designerLink}>
        <div className={css.identity}><img src={detail?.avatar || item.image} alt=""/><div><h2>{item.name} 디자이너</h2>{salon && <p>{salon}</p>}</div></div>
        <div className={css.works}>{detail?.works.map((image, index) => <img key={image} src={image} alt={`${item.name} 포트폴리오 ${index + 1}`}/>)}</div>
      </Link>
      <SaveButton item={item} reasonClassName={css.reason}/>
    </article>;
  }
  return <article className={css.salonCard}>
    <Link href={itemHref(item)}><img src={item.image} alt={item.name}/><h2>{item.name}</h2><p>{item.location?.replace('구 ', '구 · ').split(' · ').slice(0,2).join(' · ')}</p></Link>
    <SaveButton item={item} reasonClassName={css.reason}/>
  </article>;
}
