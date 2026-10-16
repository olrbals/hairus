'use client';
import {useSyncExternalStore} from 'react';
import {displayNickname,entryChangedEvent,readEntry} from './entry-state';

function subscribe(notify:()=>void){
 const storage=(event:StorageEvent)=>{if(event.key===null||event.key==='hairus.entry.v1')notify();};
 window.addEventListener(entryChangedEvent,notify);
 window.addEventListener('storage',storage);
 return()=>{window.removeEventListener(entryChangedEvent,notify);window.removeEventListener('storage',storage);};
}
const snapshot=()=>displayNickname(readEntry().name);
const serverSnapshot=()=>displayNickname(null);
export function useNickname(){return useSyncExternalStore(subscribe,snapshot,serverSnapshot);}
