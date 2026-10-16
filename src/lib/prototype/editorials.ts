import {articles, asset} from './catalog.ts';

export type EditorialKind = 'article' | 'focus';
export type Editorial = {kind: EditorialKind; id: string; title: string; label: string; image: string; href: string};
export type EditorialBookmark = Pick<Editorial, 'kind' | 'id'> & {savedAt: string; reasons?: string[]; note?: string};

// Only existing, readable editorials. Popup/event entries are deliberately excluded.
export const editorials: Editorial[] = [
  ...articles.map(article => ({kind: 'article' as const, id: article.id, title: article.title,
    label: 'MAGAZINE / ARTICLE', image: article.image, href: `/articles/${article.id}`})),
  {kind: 'focus', id: 'soft-bob', title: 'SOFTLY, IN MOTION.', label: 'IN FOCUS',
    image: asset('83c13.png'), href: '/in-focus/soft-bob'},
];

// /articles/issue is an existing alias for the care editorial, not a second story.
export function findEditorial(kind: EditorialKind, id: string) {
  return editorials.find(item => item.kind === kind && item.id === (kind === 'article' && id === 'issue' ? 'care' : id));
}

export const editorialBookmarkKey = 'hairus.editorial-bookmarks.v1';

export function readEditorialBookmarks(raw: string | null): EditorialBookmark[] {
  try {
    const data: unknown = JSON.parse(raw || 'null');
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    return data.filter((entry): entry is EditorialBookmark => {
      if (!entry || typeof entry !== 'object') return false;
      const item = entry as Partial<EditorialBookmark>;
      if ((item.kind !== 'article' && item.kind !== 'focus') || typeof item.id !== 'string' || typeof item.savedAt !== 'string') return false;
      if (!editorials.some(editorial => editorial.kind === item.kind && editorial.id === item.id)) return false;
      if (item.reasons !== undefined && (!Array.isArray(item.reasons) || !item.reasons.every(reason => typeof reason === 'string'))) return false;
      if (item.note !== undefined && typeof item.note !== 'string') return false;
      const key = `${item.kind}:${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch { return []; }
}

export function toggleEditorialBookmark(current: EditorialBookmark[], item: Editorial, savedAt = new Date().toISOString()): EditorialBookmark[] {
  const exists = current.some(entry => entry.kind === item.kind && entry.id === item.id);
  return exists ? current.filter(entry => entry.kind !== item.kind || entry.id !== item.id)
    : [...current, {kind: item.kind, id: item.id, savedAt}];
}
