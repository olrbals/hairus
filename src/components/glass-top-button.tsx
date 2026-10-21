'use client';

import {useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
import {pageScrollControls} from '@/lib/scroll-interactions';
import './glass-top-button.css';

const contentRoute = /^\/(home|magazine|articles|in-focus|styles|designers|salons|explore|saved|my|reservation|reservations)(\/|$)/;
const scrollBehavior = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

export function GlassTopButton() {
  const pathname = usePathname();
  // A keyed instance cannot retain the previous page's visibility or measurements.
  return contentRoute.test(pathname) ? <PageTopButton key={pathname}/> : null;
}

function PageTopButton() {
  const controls = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState({top:false,bottom:false});

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const root = document.documentElement;
      const next = pageScrollControls(window.scrollY, window.innerHeight, root.scrollHeight);
      setVisible(current => current.top === next.top && current.bottom === next.bottom ? current : next);

      // Measure the existing navigation / CTA, including fixed wrappers. Do not
      // change their layout or make assumptions about their height or safe area.
      let bottom = 16;
      for (const control of document.querySelectorAll('.bottom-nav, .primary-cta, .button--primary')) {
        let element: Element | null = control;
        while (element && element !== document.body) {
          const style = getComputedStyle(element);
          if (style.position === 'fixed' && style.display !== 'none' && style.visibility !== 'hidden') {
            const rect = element.getBoundingClientRect();
            if (rect.height > 0 && rect.top > window.innerHeight / 2 && rect.top < window.innerHeight) {
              bottom = Math.max(bottom, window.innerHeight - rect.top + 12);
            }
            break;
          }
          element = element.parentElement;
        }
      }
      controls.current?.style.setProperty('--top-button-bottom', `${bottom}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    // Covers async content, tab changes and the persistent navigation host.
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.querySelector('.mobile-shell')!, {childList:true, subtree:true});
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return <div ref={controls} className="glass-scroll-controls" role="group" aria-label="페이지 빠른 이동">
    <button type="button" className="glass-top-button" data-visible={visible.top}
      aria-label="페이지 맨 위로" aria-hidden={!visible.top} tabIndex={visible.top ? 0 : -1}
      onClick={() => window.scrollTo({top:0, behavior:scrollBehavior()})}>
      <span className="glass-top-button__surface"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></span>
    </button>
    <button type="button" className="glass-top-button" data-visible={visible.bottom}
      aria-label="페이지 맨 아래로" aria-hidden={!visible.bottom} tabIndex={visible.bottom ? 0 : -1}
      onClick={() => window.scrollTo({top:document.documentElement.scrollHeight, behavior:scrollBehavior()})}>
      <span className="glass-top-button__surface"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14m-6-6 6 6 6-6"/></svg></span>
    </button>
  </div>;
}
