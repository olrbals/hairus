'use client';

import {useEffect, useState, useSyncExternalStore} from 'react';
import {editorialBookmarkKey, readEditorialBookmarks, toggleEditorialBookmark, type Editorial, type EditorialBookmark} from '@/lib/prototype/editorials';
import {SaveNoteControl,type SaveNoteDraft} from './save-note-control';
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
  function persist(next: EditorialBookmark[]) {
    snapshot = next;
    const raw = JSON.stringify(snapshot);
    try {localStorage.setItem(editorialBookmarkKey, raw); lastRaw = raw; storageWarning = '';}
    catch {storageWarning = '스크랩을 저장하지 못했어요. 현재 탭에서만 유지됩니다.';}
    notify();
  }
  function toggle(item: Editorial) {persist(toggleEditorialBookmark(getSnapshot(), item));}
  function save(item: Editorial, draft: SaveNoteDraft) {
    const current = getSnapshot();
    const saved = current.find(entry => entry.kind === item.kind && entry.id === item.id);
    const entry = {kind:item.kind, id:item.id, savedAt:saved?.savedAt || new Date().toISOString(), ...draft};
    persist(saved ? current.map(previous => previous.kind === item.kind && previous.id === item.id ? entry : previous) : [...current, entry]);
  }
  function remove(item: Editorial) {persist(getSnapshot().filter(entry => entry.kind !== item.kind || entry.id !== item.id));}
  return {bookmarks, ready, toggle, save, remove, warning: storageWarning};
}

function EditorialSaveControl({item,buttonClassName}:{item:Editorial;buttonClassName:string}) {
  const {bookmarks,ready,save,remove,warning}=useEditorialBookmarks();
  const saved=bookmarks.find(entry=>entry.kind===item.kind&&entry.id===item.id);
  return <>
    <SaveNoteControl name={item.title} title="이 콘텐츠, 왜 저장하나요?" savedImage={item.image} displayName={item.title} itemInfo={item.label} skipSaveNote
      options={['나중에 읽기','스타일링 참고','상담할 때 보여주기','케어 루틴 참고']} saved={saved} ready={ready} buttonClassName={buttonClassName}
      onSave={draft=>save(item,draft)} onRemove={()=>remove(item)}/>
    {warning&&<span className={css.warning} role="status">{warning}</span>}
  </>;
}

export function EditorialBookmarkButton({item}:{item:Editorial}) {
  return <EditorialSaveControl item={item} buttonClassName={css.button}/>;
}

export function EditorialHeartSaveButton({item}:{item:Editorial}) {
  return <EditorialSaveControl item={item} buttonClassName="proto-save"/>;
}
