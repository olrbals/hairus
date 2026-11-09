'use client';

import {useEffect, useRef, useState, useSyncExternalStore, type ReactNode} from 'react';

/*
 * Desktop iPhone mockup.
 * On desktop the app runs inside a 430 × 874 iframe (iPhone Pro Max screen minus the
 * status bar, matching the 430 × 875 Figma frames), so every page sees a real phone
 * viewport: 100dvh, position:fixed, sticky headers and dialogs behave exactly as on a
 * phone. The whole device is scaled uniformly to fit the browser window, so every
 * desktop shows the same screen.
 */
export const deviceSize = {width: 458, height: 960, margin: 48, screenWidth: 430, appHeight: 874};
const hostClass = 'device-host';

export function deviceScale(viewportWidth: number, viewportHeight: number) {
  return Math.max(0.3, Math.min(1, (viewportWidth - deviceSize.margin) / deviceSize.width, (viewportHeight - deviceSize.margin) / deviceSize.height));
}

const subscribe = () => () => {};
const isDeviceHost = () => document.documentElement.classList.contains(hostClass);

type Tone = {color: string; dark: boolean};
const lightTone: Tone = {color: '#ffffff', dark: false};

function surfaceTone(frame: HTMLIFrameElement | null, y: number): Tone {
  try {
    const doc = frame?.contentDocument;
    const view = doc?.defaultView;
    if (!doc || !view) return lightTone;
    let element = doc.elementFromPoint(deviceSize.screenWidth / 2, y);
    while (element) {
      const match = view.getComputedStyle(element).backgroundColor.match(/rgba?\(([^)]+)\)/);
      if (match) {
        const [r = 255, g = 255, b = 255, a = 1] = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
        if (a > 0.5) return {color: `rgb(${r}, ${g}, ${b})`, dark: 0.299 * r + 0.587 * g + 0.114 * b < 140};
      }
      element = element.parentElement;
    }
  } catch {
    /* Cross-origin or detached frame: keep the default tone. */
  }
  return lightTone;
}

function StatusIcons() {
  return <span className="device__status-icons" aria-hidden="true">
    <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
    <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 8 .4C5.2.4 2.7 1.5.8 3.3L2 4.6a8.6 8.6 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4 6.7 6.7 0 0 0 3.4 5.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.5c-.5 0-1 .2-1.3.5L8 11.2l1.3-1.4c-.3-.3-.8-.5-1.3-.5Z"/></svg>
    <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" opacity=".5"/></svg>
  </span>;
}

function DeviceFrame() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [src] = useState(() => `${location.pathname}${location.search}${location.hash}`);
  const [top, setTop] = useState<Tone>(lightTone);
  const [bottom, setBottom] = useState<Tone>(lightTone);

  useEffect(() => {
    const root = document.documentElement;
    const resize = () => root.style.setProperty('--device-scale', String(deviceScale(window.innerWidth, window.innerHeight)));
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const sample = () => {
      const nextTop = surfaceTone(frame.current, 1);
      const nextBottom = surfaceTone(frame.current, deviceSize.appHeight - 4);
      setTop(current => current.color === nextTop.color ? current : nextTop);
      setBottom(current => current.color === nextBottom.color ? current : nextBottom);
    };
    const timer = window.setInterval(sample, 300);
    return () => window.clearInterval(timer);
  }, []);

  return <div className="device" role="presentation">
    <div className="device__screen">
      <div className="device__status" data-dark={top.dark} style={{backgroundColor: top.color}} aria-hidden="true">
        <span className="device__time">9:41</span>
        <StatusIcons/>
      </div>
      <span className="device__island" aria-hidden="true"/>
      <iframe ref={frame} className="device__app" src={src} title="HAIRUS 앱 화면" width={deviceSize.screenWidth} height={deviceSize.appHeight}/>
      <span className="device__home" data-dark={bottom.dark} aria-hidden="true"/>
    </div>
  </div>;
}

/* Renders the app normally on phones and inside the mockup; renders only the mockup on the desktop host page. */
export function DeviceGate({children}: {children: ReactNode}) {
  const host = useSyncExternalStore(subscribe, isDeviceHost, () => false);
  return host ? <DeviceFrame/> : children;
}
