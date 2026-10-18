'use client';

import Link from 'next/link';
import {createContext,useCallback,useContext,useLayoutEffect,useRef,useState,type ReactNode} from 'react';
import {mainTabs} from '@/lib/routes';
import {Icon} from './primitives';
import {LiquidIndicator,type LiquidIndicatorHandle} from './liquid-indicator';
import './bottom-nav.css';

type Registration={owner:symbol;active?:string;disabled:boolean};
const NavigationContext=createContext<{hosted:boolean;register:(active?:string,disabled?:boolean)=>()=>void}|null>(null);

/** Lives in the existing root layout so routing cannot remount the animation. */
export function BottomNavProvider({children}:{children:ReactNode}) {
  const [registration,setRegistration]=useState<Registration|null>(null);
  const register=useCallback((active?:string,disabled=false)=>{
    const owner=Symbol('navigation');
    setRegistration({owner,active,disabled});
    // Outgoing/incoming page effects may run in either order in one commit.
    return ()=>queueMicrotask(()=>setRegistration(current=>current?.owner===owner?null:current));
  },[]);
  return <NavigationContext.Provider value={{hosted:registration!==null,register}}>
    {children}<NavigationSurface active={registration?.active} visible={registration!==null} disabled={registration?.disabled}/>
  </NavigationContext.Provider>;
}

/** Existing pages retain ownership of visibility and their active-tab policy. */
export function BottomNav({active,disabled=false}:{active?:string;disabled?:boolean}) {
  const context=useContext(NavigationContext);
  const register=context?.register;
  useLayoutEffect(()=>register?.(active,disabled),[active,disabled,register]);
  // Preserve server-rendered navigation before the persistent host hydrates.
  return context?.hosted?null:<StaticNavigation active={active} disabled={disabled}/>;
}
function StaticNavigation({active,disabled}:{active?:string;disabled:boolean}) {
  return <nav className="bottom-nav" aria-label="메인 메뉴" inert={disabled}>{mainTabs.map(tab=><Link href={tab.href} key={tab.href} aria-current={active===tab.href?'page':undefined}><Icon name={tab.icon}/><span>{tab.label}</span></Link>)}</nav>;
}
function NavigationSurface({active,visible,disabled=false}:{active?:string;visible:boolean;disabled?:boolean}) {
  const indicator=useRef<LiquidIndicatorHandle>(null);
  const nav=useRef<HTMLElement>(null);
  const index=mainTabs.findIndex(tab=>tab.href===active);
  return <nav ref={nav} className="bottom-nav bottom-nav--liquid" aria-label="메인 메뉴" hidden={!visible} inert={disabled}>
    <LiquidIndicator ref={indicator} nav={nav} index={index} visible={visible}/>
    {mainTabs.map((tab,i)=><Link href={tab.href} key={tab.href} aria-current={active===tab.href?'page':undefined}
      onNavigate={()=>indicator.current?.moveTo(i)}><Icon name={tab.icon}/><span>{tab.label}</span></Link>)}
  </nav>;
}
