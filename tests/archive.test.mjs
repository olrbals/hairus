import {test} from 'node:test';
import assert from 'node:assert/strict';
import {saveNotePreview} from '../src/lib/prototype/archive.ts';
import {editorials, findEditorial, readEditorialBookmarks, toggleEditorialBookmark} from '../src/lib/prototype/editorials.ts';

test('Archive previews at most two chips, with memo first and an accurate overflow count', () => {
  const saved = {note:'상담 때 보여주기\n옆머리는 더 길게', reasons:['분위기 참고','나중에 도전','스타일링 참고']};
  const before = structuredClone(saved);
  assert.deepEqual(saveNotePreview(saved), {visible:['상담 때 보여주기','분위기 참고'],hiddenCount:2});
  assert.deepEqual(saved, before);
  assert.deepEqual(saveNotePreview({...saved,note:'  '}), {visible:['분위기 참고','나중에 도전'],hiddenCount:1});
  assert.deepEqual(saveNotePreview({note:'', reasons:['분위기 참고','나중에 도전']}), {visible:['분위기 참고','나중에 도전'],hiddenCount:0});
  assert.deepEqual(saveNotePreview({note:'', reasons:['분위기 참고']}), {visible:['분위기 참고'],hiddenCount:0});
  assert.deepEqual(saveNotePreview({note:'', reasons:[]}), {visible:[],hiddenCount:0});
});

test('Editorial registry reuses existing articles/IN FOCUS and excludes popup promotions', () => {
  assert.equal(editorials.length, 5);
  assert.equal(findEditorial('article','popup'), undefined);
  assert.equal(findEditorial('article','issue'), findEditorial('article','care'));
  assert.equal(findEditorial('focus','soft-bob').href, '/in-focus/soft-bob');
  assert.equal(findEditorial('article','soft-bob'), undefined);
});

test('Bookmarks toggle immediately by content type and ID and survive serialization', () => {
  const care = findEditorial('article','care');
  const focus = findEditorial('focus','soft-bob');
  const initial = [];
  const first = toggleEditorialBookmark(initial, care, '2026-10-15T00:00:00Z');
  const both = toggleEditorialBookmark(first, focus, '2026-10-15T00:01:00Z');
  assert.deepEqual(initial, []);
  assert.deepEqual(readEditorialBookmarks(JSON.stringify(both)), both);
  assert.deepEqual(toggleEditorialBookmark(both,care), [both[1]]);
  assert.deepEqual(toggleEditorialBookmark(toggleEditorialBookmark(both,care),focus), []);
});

test('Invalid, duplicate, promotional and legacy SAVENOTE entries cannot become editorial bookmarks', () => {
  const valid = {kind:'article',id:'care',savedAt:'2026-10-15'};
  assert.deepEqual(readEditorialBookmarks(JSON.stringify([null,valid,valid,{...valid,id:'popup'}, {...valid,kind:'style'}, {kind:'article',id:'story'}])), [valid]);
  assert.deepEqual(readEditorialBookmarks('{broken'), []);
  assert.deepEqual(readEditorialBookmarks(JSON.stringify({version:1,saved:[valid],bookings:[]})), []);
});
