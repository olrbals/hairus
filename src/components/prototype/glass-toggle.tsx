'use client';

import styles from './savenote.module.css';

// Shared SAVENOTE interaction and glass artwork; state belongs to each caller.
export function GlassToggle({checked,label,onChange}:{checked:boolean;label:string;onChange:(checked:boolean)=>void}){
 return <button type="button" className={styles.toggle} role="switch" aria-checked={checked} aria-label={label} onClick={()=>onChange(!checked)}><span className={styles.toggleThumb}/></button>;
}
