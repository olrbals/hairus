export type AppScrollViewport = {
  height: number;
  scrollHeight: number;
  scrollTop: number;
  top: number;
};

const desktopFrameQuery = '(min-width: 431px)';

export function appScrollRoot() {
  if (typeof window === 'undefined' || !window.matchMedia(desktopFrameQuery).matches) return null;
  return document.querySelector<HTMLElement>('.mobile-scroll');
}

export function appScrollViewport(): AppScrollViewport {
  const root = appScrollRoot();
  if (root) {
    const rect = root.getBoundingClientRect();
    return {height: root.clientHeight, scrollHeight: root.scrollHeight, scrollTop: root.scrollTop, top: rect.top};
  }
  const documentRoot = document.documentElement;
  return {height: window.innerHeight, scrollHeight: documentRoot.scrollHeight, scrollTop: window.scrollY, top: 0};
}

export function appElementTop(element: Element) {
  return element.getBoundingClientRect().top - appScrollViewport().top;
}

export function appScrollAtEnd(tolerance = 2) {
  const viewport = appScrollViewport();
  return viewport.scrollTop > 0 && viewport.scrollTop + viewport.height >= viewport.scrollHeight - tolerance;
}

export function appScrollTo(options: ScrollToOptions) {
  const root = appScrollRoot();
  if (root) root.scrollTo(options);
  else window.scrollTo(options);
}

export function appScrollToElement(element: Element, offset: number, behavior: ScrollBehavior) {
  const viewport = appScrollViewport();
  appScrollTo({top: viewport.scrollTop + element.getBoundingClientRect().top - viewport.top - offset, behavior});
}

export function observeAppScroll(listener: EventListener) {
  const root = document.querySelector<HTMLElement>('.mobile-scroll');
  root?.addEventListener('scroll', listener, {passive: true});
  window.addEventListener('scroll', listener, {passive: true});
  return () => {
    root?.removeEventListener('scroll', listener);
    window.removeEventListener('scroll', listener);
  };
}
