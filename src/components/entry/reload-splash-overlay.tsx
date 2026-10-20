"use client";
import {useEffect} from "react";
import styles from "./reload-splash-overlay.module.css";

/**
 * A refresh-only visual splash: the existing page stays mounted underneath.
 * The pre-paint marker is set in the root layout for full reloads, not SPA navigation.
 */
export function ReloadSplashOverlay(){
 useEffect(()=>{
  const root=document.documentElement;
  if(root.dataset.hairusReload!=="true")return;
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timer=window.setTimeout(()=>{delete root.dataset.hairusReload;},reduce?600:3360);
  return ()=>{window.clearTimeout(timer);delete root.dataset.hairusReload;};
 },[]);
 return <div className={styles.overlay} role="status" aria-label="HAIRUS 시작 화면">
  <h1 aria-label="HAIRUS">{'HAIRUS'.split('').map((letter,index)=><span key={index} aria-hidden="true" style={{animationDelay:`${index*120}ms`}}>{letter}</span>)}</h1>
 </div>;
}
