import type {SaveNote} from './logic';

/** Display at most two previews; never truncate the underlying SAVENOTE data. */
export function saveNotePreview(saved: Pick<SaveNote, 'note' | 'reasons'>): {visible: string[]; hiddenCount: number} {
  const note = saved.note.trim().split(/\r?\n/)[0];
  const entries = [note, ...saved.reasons].filter(entry => entry.trim().length > 0);
  return {visible: entries.slice(0, 2), hiddenCount: Math.max(0, entries.length - 2)};
}
