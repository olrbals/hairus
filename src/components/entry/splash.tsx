"use client";
import {useEffect,useRef} from "react";
import {useRouter} from "next/navigation";
import {readEntry} from "@/lib/entry-state";

export function Splash(){
 const router=useRouter();
 const screen=useRef<HTMLElement>(null);
 useEffect(()=>{
  const state=readEntry();
  const target=state.loginMode==="demo"?"/welcome":state.onboardingDone?"/login":`/onboarding/${state.onboardingStep}`;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let disposed=false;
  let timer:ReturnType<typeof setTimeout>|undefined;
  let holding=false;
  const animations:Animation[]=[];
  const hold=()=>{
   if(disposed||holding)return;
   holding=true;
   timer=setTimeout(async()=>{
    if(disposed)return;
    if(!motion.matches&&screen.current){
     const fade=screen.current.animate([{opacity:1},{opacity:0}],{duration:180,fill:'forwards'});
     animations.push(fade);
     try{await fade.finished;}catch{return;}
    }
    if(!disposed)router.replace(target);
   },2400);
  };
  const reduce=()=>{if(motion.matches)animations.forEach(animation=>animation.finish());};
  motion.addEventListener('change',reduce);
  void document.fonts.ready.then(async()=>{
   if(disposed||!screen.current)return;
   const letters=screen.current.querySelectorAll<HTMLElement>('[data-splash-letter]');
   screen.current.dataset.ready='true';
   if(motion.matches){hold();return;}
   letters.forEach((letter,index)=>animations.push(letter.animate(
    [{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],
    {duration:360,delay:index*120,easing:'cubic-bezier(.2,.65,.3,1)',fill:'both'},
   )));
   try{await Promise.all(animations.map(animation=>animation.finished));hold();}catch{/* Unmount cancels animations. */}
  });
  return()=>{disposed=true;clearTimeout(timer);motion.removeEventListener('change',reduce);animations.forEach(animation=>animation.cancel());};
 },[router]);
 return <main ref={screen} id="main" className="entry-screen splash" data-figma-node="1060:2668"><h1 aria-label="HAIRUS">{'HAIRUS'.split('').map((letter,index)=><span key={index} data-splash-letter aria-hidden="true">{letter}</span>)}</h1></main>;
}
