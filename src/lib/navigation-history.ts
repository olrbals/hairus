// Metadata on native entries, not a second router or a persisted navigation stack.
// Only SPA entries observed in this document qualify as an in-app predecessor.
const key = '__hairusNavigation';
const scrollKey = '__hairusScrollTop';
export const navigationScrollEvent = 'hairus:navigation-scroll';
type Entry = {version: 1; path: string; parents: string[]};
type Browser = Pick<Window, 'history' | 'location'>;
type Router = {back: () => void; replace: (href: string) => void};
const installed = new WeakSet<object>();

function path(browser: Browser) {
  return browser.location.pathname + browser.location.search + browser.location.hash;
}

function entry(browser: Browser): Entry | undefined {
  const value = browser.history.state?.[key];
  if (value?.version === 1 && value.path === path(browser) &&
      Array.isArray(value.parents) && value.parents.every((item: unknown) =>
        typeof item === 'string' && item.startsWith('/') && !item.startsWith('//'))) return value;
}

function liveScrollTop(browser: Browser) {
  if (typeof window === 'undefined' || browser !== window) return 0;
  const root = window.matchMedia('(min-width: 431px)').matches ? document.querySelector<HTMLElement>('.mobile-scroll') : null;
  return root?.scrollTop ?? window.scrollY;
}

export function navigationScrollTop(browser: Browser = window) {
  const value = browser.history.state?.[scrollKey];
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0;
}

export function installNavigationHistory(browser: Browser) {
  if (installed.has(browser)) return;
  installed.add(browser);
  const history = browser.history;
  const push = history.pushState.bind(history);
  const replace = history.replaceState.bind(history);
  // A Splash entry begins a new experience. Keep the existing refresh/reset policy.
  const initial = browser.location.pathname === '/' ? undefined : entry(browser);
  replace({...history.state, [key]: initial ?? {version: 1, path: path(browser), parents: []}, [scrollKey]: liveScrollTop(browser)}, '');

  function write(method: 'push' | 'replace', data: unknown, unused: string, url?: string | URL | null) {
    const currentPath = path(browser);
    const current = entry(browser);
    const target = new URL(url ?? currentPath, browser.location.href);
    // Let the native API reject cross-origin URLs without marking them as app history.
    if (target.origin !== browser.location.origin) {
      (method === 'push' ? push : replace)(data, unused, url);
      return;
    }
    const nextPath = target.pathname + target.search + target.hash;
    const changesDocument = target.pathname !== browser.location.pathname || target.search !== browser.location.search;
    const addsEntry = method === 'push' && nextPath !== currentPath;
    const parents = addsEntry ? [...(current?.parents ?? []), currentPath].slice(-64) : current?.parents ?? [];
    const currentScrollTop = liveScrollTop(browser);
    if (addsEntry) replace({...history.state, [scrollKey]: currentScrollTop}, unused);
    const state = {...(data && typeof data === 'object' ? data : {}), [key]: {version: 1, path: nextPath, parents}, [scrollKey]: addsEntry ? 0 : currentScrollTop};
    // Repeated taps on the current destination must not add identical entries.
    (addsEntry ? push : replace)(state, unused, url);
    if (changesDocument && typeof window !== 'undefined' && browser === window) window.dispatchEvent(new Event(navigationScrollEvent));
  }
  history.pushState = (data, unused, url) => write('push', data, unused, url);
  history.replaceState = (data, unused, url) => write('replace', data, unused, url);
  // Installed once for the root document's lifetime, including React Strict Mode.
}

export function goBack(router: Router, fallback: string, browser: Browser = window) {
  if (entry(browser)?.parents.length) router.back();
  else router.replace(fallback);
}

// Onboarding dots can jump backwards by more than one step. Traverse a known
// entry when available; never push an earlier step on top of a later one.
export function goBackTo(router: Router, destination: string, browser: Browser = window) {
  const parents = entry(browser)?.parents ?? [];
  const index = parents.lastIndexOf(destination);
  if (index >= 0) browser.history.go(index - parents.length);
  else router.replace(destination);
}
