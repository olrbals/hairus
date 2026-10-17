import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calendarCells,noteSections,selectBookingDate,selectBookingService,bookingDateLabel} from '../src/lib/prototype/booking-presentation.ts';
import {hairNote,availableBookingDates,availableBookingTimes,completeBooking} from '../src/lib/prototype/logic.ts';

const draft={id:'preserved',designerId:'yoona',serviceId:'cut',date:availableBookingDates('yoona')[0],time:'18:00',note:'현재 헤어: 단발\n\n디자이너에게 전하고 싶은 말: 앞머리는 유지해 주세요.\n사진도 함께 볼게요.',noteEdited:true};
test('changing service and schedule preserves edited note, identity and unrelated selection through saving',()=>{
  const changed=selectBookingService(draft,'perm');
  assert.deepEqual(changed,{...draft,serviceId:'perm'});
  assert.strictEqual(selectBookingService(draft,'cut'),draft);
  assert.strictEqual(selectBookingDate(draft,draft.date),draft);
  const scheduled=selectBookingDate(changed,availableBookingDates('yoona')[1]);
  assert.deepEqual(scheduled,{...changed,date:availableBookingDates('yoona')[1],time:''});
  const stored=JSON.parse(JSON.stringify({...scheduled,time:availableBookingTimes(scheduled.serviceId,scheduled.date,scheduled.designerId)[0]}));
  const bookings=completeBooking([],stored);
  assert.equal(bookings[0].note,draft.note);
  assert.equal(bookings[0].id,draft.id);
  assert.equal(bookings[0].serviceId,'perm');
});
test('only an unedited generated note is invalidated when the service changes',()=>{
  const generated={...draft,note:hairNote(null,{},'cut'),noteEdited:false};
  assert.equal(selectBookingService(generated,'perm').note,'');
  assert.strictEqual(selectBookingService(generated,'cut'),generated);
});
test('reading a note omits empty generated fields and preserves custom paragraphs and line breaks',()=>{
  const note=hairNote(null,{mood:['내추럴'],care:['자연 건조']},'cut');
  const sections=noteSections(note);
  assert.ok(!sections.some(section=>['미입력','아직 입력하지 않았어요.'].includes(section.value)));
  assert.deepEqual(sections.find(section=>section.label==='평소 손질'),{label:'평소 손질',value:'자연 건조'});
  const saved=JSON.stringify(draft);
  assert.equal(noteSections(draft.note)[1].value,'앞머리는 유지해 주세요.\n사진도 함께 볼게요.');
  assert.equal(noteSections('내 문장: 원문 그대로\n두 번째 줄')[0].value,'내 문장: 원문 그대로\n두 번째 줄');
  assert.equal(JSON.stringify(draft),saved);
});
test('calendar aligns weekdays and handles leap years and year boundaries without UTC date shifts',()=>{
  for(const [month,count,offset] of [['2026-10',31,4],['2026-11',30,0],['2028-02',29,2],['2026-12',31,2],['2027-01',31,5]]){
    const cells=calendarCells(month);
    assert.equal(cells.length%7,0);
    assert.equal(cells.filter(Boolean).length,count);
    assert.equal(cells.indexOf(month+'-01'),offset);
    assert.equal(cells.filter(Boolean).at(-1),`${month}-${count}`);
  }
  assert.equal(bookingDateLabel('2026-10-17'),'2026년 10월 17일 (토)');
});
