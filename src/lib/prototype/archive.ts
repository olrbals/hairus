import type {SaveNote} from './logic';

/** Keep the full note/reason list in storage; cards only show one quiet preview. */
export function representativeReason(saved: Pick<SaveNote, 'note' | 'reasons'>): string {
  return saved.note.trim().split(/\r?\n/)[0] || saved.reasons[0] || '';
}
