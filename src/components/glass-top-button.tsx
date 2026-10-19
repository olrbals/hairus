'use client';

import {useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
import './glass-top-button.css';

const contentRoute = /^\/(home|magazine|articles|in-focus|styles|designers|salons|explore|saved|my|reservation|reservations)(\/|$)/;

export function GlassTopButton() {
  const pathname = usePathname();
  // A keyed instance cannot retain the previous page's visibility or measurements.
  return contentRoute.test(pathname) ? <PageTopButton key={pathname}/> : null;
}

function PageTopButton() {
  const button = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const root = document.documentElement;
      setVisible(root.scrollHeight - window.innerHeight >= 600 && window.scrollY >= 600);

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
      button.current?.style.setProperty('--top-button-bottom', `${bottom}px`);
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

  return <button ref={button} type="button" className="glass-top-button" data-visible={visible}
    aria-label="페이지 맨 위로" aria-hidden={!visible} tabIndex={visible ? 0 : -1}
    onClick={() => window.scrollTo({top:0, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})}>
    <span className="glass-top-button__surface" style={{backdropFilter:'blur(5px)',WebkitBackdropFilter:'blur(5px)'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></span>
  </button>;
}
