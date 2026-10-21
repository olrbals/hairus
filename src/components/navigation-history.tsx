'use client';

import {useEffect, type ComponentProps} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {goBack,installNavigationHistory,navigationScrollEvent,navigationScrollTop} from '@/lib/navigation-history';
import {appScrollTo} from '@/lib/app-scroll';

export function NavigationHistory() {
  useEffect(() => {
    installNavigationHistory(window);
    let frame=0;
    const restore=()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>appScrollTo({top:navigationScrollTop(window),behavior:'instant'}));});
    };
    window.addEventListener('popstate',restore);
    window.addEventListener(navigationScrollEvent,restore);
    restore();
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('popstate',restore);window.removeEventListener(navigationScrollEvent,restore);};
  }, []);
  return null;
}

// Preserve anchor appearance, accessibility, and modifier/open-in-new-tab behavior.
export function BackLink({href, onNavigate, ...props}: Omit<ComponentProps<typeof Link>, 'href'> & {href: string}) {
  const router = useRouter();
  return <Link {...props} href={href} onNavigate={event => {
    onNavigate?.(event);
    event.preventDefault();
    goBack(router, href);
  }}/>;
}
