'use client';

import {useEffect, useState, useSyncExternalStore} from 'react';
import {editorialBookmarkKey, readEditorialBookmarks, toggleEditorialBookmark, type Editorial, type EditorialBookmark} from '@/lib/prototype/editorials';
import {SaveHeart} from './save-heart';
import css from './editorial-bookmark.module.css';

const empty: EditorialBookmark[] = [];
let snapshot = empty;
let lastRaw: string | null | undefined;
let storageWarning = '';
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(listener => listener());

function getSnapshot() {
  try {
    const raw = localStorage.getItem(editorialBookmarkKey);
    if (raw !== lastRaw) {lastRaw = raw; snapshot = readEditorialBookmarks(raw);}
  } catch { /* Keep the in-memory snapshot when storage is unavailable. */ }
  return snapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const sync = (event: StorageEvent) => {if (event.key === editorialBookmarkKey || event.key === null) notify();};
  window.addEventListener('storage', sync);
  return () => {listeners.delete(listener); window.removeEventListener('storage', sync);};
}

export function useEditorialBookmarks() {
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, () => empty);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  function toggle(item: Editorial) {
    snapshot = toggleEditorialBookmark(getSnapshot(), item);
    const raw = JSON.stringify(snapshot);
    try {localStorage.setItem(editorialBookmarkKey, raw); lastRaw = raw; storageWarning = '';}
    catch {storageWarning = '스크랩을 저장하지 못했어요. 현재 탭에서만 유지됩니다.';}
    notify();
  }
  return {bookmarks, ready, toggle, warning: storageWarning};
}

export function EditorialBookmarkButton({item}: {item: Editorial}) {
  const {bookmarks, ready, toggle, warning} = useEditorialBookmarks();
  const saved = bookmarks.some(entry => entry.kind === item.kind && entry.id === item.id);
  return <>
    <button type="button" className={css.button} disabled={!ready} aria-label={`${item.title} ${saved ? '스크랩 해제' : '스크랩하기'}`} aria-pressed={saved} onClick={() => toggle(item)}>
      <svg width="22" height="24" viewBox="0 0 22 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M5 3.5h12v17l-6-4-6 4z"/></svg>
    </button>
    {warning && <span className={css.warning} role="status">{warning}</span>}
  </>;
}

export function EditorialHeartSaveButton({item}: {item: Editorial}) {
  const {bookmarks, ready, toggle, warning} = useEditorialBookmarks();
  const saved = bookmarks.some(entry => entry.kind === item.kind && entry.id === item.id);
  return <>
    <button type="button" className="proto-save" disabled={!ready} aria-label={`${item.title} ${saved ? '저장 해제' : '저장하기'}`} aria-pressed={saved} onClick={() => toggle(item)}>
      <SaveHeart saved={saved}/>
    </button>
    {warning && <span className={css.warning} role="status">{warning}</span>}
  </>;
}
