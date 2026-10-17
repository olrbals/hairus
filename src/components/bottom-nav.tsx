'use client';

import Link from 'next/link';
import {createContext,useCallback,useContext,useLayoutEffect,useRef,useState,type ReactNode} from 'react';
import {mainTabs} from '@/lib/routes';
import {Icon} from './primitives';
import {LiquidIndicator,type LiquidIndicatorHandle} from './liquid-indicator';
import './bottom-nav.css';

type Registration={owner:symbol;active?:string};
const NavigationContext=createContext<{hosted:boolean;register:(active?:string)=>()=>void}|null>(null);

/** Lives in the existing root layout so routing cannot remount the animation. */
export function BottomNavProvider({children}:{children:ReactNode}) {
  const [registration,setRegistration]=useState<Registration|null>(null);
  const register=useCallback((active?:string)=>{
    const owner=Symbol('navigation');
    setRegistration({owner,active});
    // Outgoing/incoming page effects may run in either order in one commit.
    return ()=>queueMicrotask(()=>setRegistration(current=>current?.owner===owner?null:current));
  },[]);
  return <NavigationContext.Provider value={{hosted:registration!==null,register}}>
    {children}<NavigationSurface active={registration?.active} visible={registration!==null}/>
  </NavigationContext.Provider>;
}

/** Existing pages retain ownership of visibility and their active-tab policy. */
export function BottomNav({active}:{active?:string}) {
  const context=useContext(NavigationContext);
  const register=context?.register;
  useLayoutEffect(()=>register?.(active),[active,register]);
  // Preserve server-rendered navigation before the persistent host hydrates.
  return context?.hosted?null:<StaticNavigation active={active}/>;
}
function StaticNavigation({active}:{active?:string}) {
  return <nav className="bottom-nav" aria-label="메인 메뉴">{mainTabs.map(tab=><Link href={tab.href} key={tab.href} aria-current={active===tab.href?'page':undefined}><Icon name={tab.icon}/><span>{tab.label}</span></Link>)}</nav>;
}
function NavigationSurface({active,visible}:{active?:string;visible:boolean}) {
  const indicator=useRef<LiquidIndicatorHandle>(null);
  const nav=useRef<HTMLElement>(null);
  const index=mainTabs.findIndex(tab=>tab.href===active);
  return <nav ref={nav} className="bottom-nav bottom-nav--liquid" aria-label="메인 메뉴" hidden={!visible}>
    <LiquidIndicator ref={indicator} nav={nav} index={index} visible={visible}/>
    {mainTabs.map((tab,i)=><Link href={tab.href} key={tab.href} aria-current={active===tab.href?'page':undefined}
      onNavigate={()=>indicator.current?.moveTo(i)}><Icon name={tab.icon}/><span>{tab.label}</span></Link>)}
  </nav>;
}
