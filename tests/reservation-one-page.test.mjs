import {test} from 'node:test';
import assert from 'node:assert/strict';
import {services,serviceCategories,bookingServiceName} from '../src/lib/prototype/catalog.ts';
import {availableBookingDates,availableBookingTimes,demoDates,isBookingDateFull,validBooking,completeBooking,hairNote} from '../src/lib/prototype/logic.ts';
import {selectBookingService,selectBookingDate,updateNoteSection,bookingVisitLabel} from '../src/lib/prototype/booking-presentation.ts';

const date=availableBookingDates('yoona').find(day=>Number(day.slice(-2))%2===1);
const draft={id:'reservation-regression',designerId:'yoona',serviceId:'cut',date,time:'20:00',note:'현재 헤어: 긴 머리\n\n직접 작성한 문장\n다음 줄도 보존',noteEdited:true};

test('all six categories share unique IDs, Figma prices and explicit cutoff policies',()=>{
 assert.deepEqual([...new Set(services.map(service=>service.category))],serviceCategories);
 assert.equal(new Set(services.map(service=>service.id)).size,services.length);
 for(const service of services){
  assert.ok(service.price>0);
  assert.equal(service.lastBooking,['컷','클리닉','기타'].includes(service.category)?'20:00':'18:00');
  if(['컷','클리닉','기타'].includes(service.category))assert.ok(service.minutes>0&&service.minutes<=60);
  if(['열펌','염색'].includes(service.category))assert.ok(service.minutes>=120);
  if(service.category==='탈색')assert.equal(service.minutes,null);
 }
 assert.deepEqual(services.filter(service=>service.category==='열펌').map(service=>service.price),[160000,180000,220000,250000,280000]);
 assert.deepEqual(services.filter(service=>service.category==='탈색').map(service=>service.price),[140000,160000,200000,250000,280000]);
});
test('duration and cutoff invalidate late times, while a compatible service keeps the selection',()=>{
 assert.ok(availableBookingTimes('cut',date,'yoona').includes('20:00'));
 assert.ok(!availableBookingTimes('perm',date,'yoona').includes('20:00'));
 assert.ok(availableBookingTimes('cut',date,'yoona').includes('10:00'));
 assert.ok(!availableBookingTimes('perm',date,'yoona').includes('10:00'));
 assert.ok(availableBookingTimes('perm',date,'yoona').includes('18:00'));
 assert.ok(!availableBookingTimes('bleach-short',date,'yoona').includes('18:30'));
 const changed=selectBookingService(draft,'perm');
 assert.equal(changed.time,'');assert.equal(changed.note,draft.note);assert.equal(changed.date,date);
 assert.equal(selectBookingService(draft,'clinic').time,'20:00');
 assert.equal(selectBookingDate(draft,availableBookingDates('yoona')[1]).time,'');
});
test('closed dates and stable occupied slots are rejected again during submission',()=>{
 const full=demoDates().find(isBookingDateFull);
 assert.ok(full);assert.ok(!availableBookingDates('yoona').includes(full));
 assert.deepEqual(availableBookingTimes('cut',full,'yoona'),[]);
 assert.ok(!validBooking({...draft,date:full}));
 const times=availableBookingTimes('cut',date,'yoona');
 assert.deepEqual(times,availableBookingTimes('cut',date,'yoona'));
 assert.ok(!validBooking({...draft,time:'11:00'}));
 assert.throws(()=>completeBooking([],{...draft,time:'20:30'}));
});
test('note delivery is independent, OFF permits an empty note and preserves private content',()=>{
 assert.equal(validBooking({...draft,note:'',shareNote:false}),true);
 assert.equal(validBooking({...draft,note:'',shareNote:true}),false);
 const privateNote=completeBooking([],{...draft,shareNote:false})[0];
 assert.equal(privateNote.note,draft.note);assert.equal(privateNote.shareNote,false);
 const delivered=completeBooking([],{...draft,shareNote:true})[0];
 assert.equal(delivered.note,draft.note);assert.equal(delivered.shareNote,true);
});
test('bangs shampoo is explanatory only and saved price equals the summary price',()=>{
 const bangs=services.find(service=>service.id==='cut-bangs');
 assert.equal(bangs.minutes,30);assert.equal(bangs.price,10000);assert.match(bangs.description,/샴푸 추가 시 \+10,000원/);
 const saved=completeBooking([],{...draft,serviceId:bangs.id})[0];
 assert.equal(saved.estimatedPrice,10000);assert.equal(saved.serviceName,bookingServiceName(bangs));
 assert.equal(JSON.parse(JSON.stringify(saved)).estimatedPrice,10000);
 assert.equal(completeBooking([saved],saved).length,1);
});
test('section edits preserve handwritten paragraphs and generated advice supports expanded services',()=>{
 const changed=updateNoteSection(draft,['MY HAIR','현재 헤어'],'MY HAIR','단발 · 직모');
 assert.match(changed.note,/MY HAIR: 단발 · 직모/);assert.match(changed.note,/직접 작성한 문장\n다음 줄도 보존/);
 assert.equal(changed.noteEdited,true);
 assert.match(hairNote(null,{},'cut-men'),/커트/);
 assert.equal(bookingVisitLabel('2026-11-30','15:00'),'11월 30일 · 오후 3:00');
});
