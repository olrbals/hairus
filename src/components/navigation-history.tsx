'use client';

import {useEffect, type ComponentProps} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {goBack, installNavigationHistory} from '@/lib/navigation-history';

export function NavigationHistory() {
  useEffect(() => { installNavigationHistory(window); }, []);
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
