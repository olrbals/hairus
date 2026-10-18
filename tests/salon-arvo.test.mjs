import {test} from 'node:test';
import assert from 'node:assert/strict';
import {arvoTeam,isDesignerDayOff,offDaysLabel} from '../src/lib/prototype/arvo.ts';
import {availableBookingDates,availableBookingTimes,clearClosedBookingDate,demoDates,demoTimes,isBookingDateFull,validBooking,completeBooking} from '../src/lib/prototype/logic.ts';
import {arvoReviews,designerReviews} from '../src/lib/prototype/reviews.ts';
import {designers} from '../src/lib/prototype/catalog.ts';

test('six existing Arvo identities share the specified weekly closures across a full fortnight',()=>{
  const expected={soyul:[2,6],sohee:[1,4],hana:[3,4],gyunghyun:[2,0],yoona:[2,5],jonghun:[1,3]};
  assert.deepEqual(arvoTeam.map(person=>person.id),Object.keys(expected));
  for(const person of arvoTeam){
    assert.ok(designers.some(designer=>designer.id===person.id));
    const now=new Date(2026,9,15,12);
    const all=demoDates(now);
    const fortnight=all.slice(0,14);
    const available=availableBookingDates(person.id,now);
    // The booking calendar now spans a year; retain the original fortnight closure check.
    assert.equal(all.length,365);
    assert.equal(fortnight.length,14);
    assert.equal(fortnight.filter(day=>!isDesignerDayOff(person.id,day)).length,10);
    assert.ok(available.length>0);
    assert.ok(available.some(day=>day>'2026-11-15'));
    for(const day of fortnight){
      const weekday=new Date(day+'T12:00:00Z').getUTCDay();
      assert.equal(isDesignerDayOff(person.id,day),expected[person.id].includes(weekday));
      assert.equal(available.includes(day),!expected[person.id].includes(weekday)&&!isBookingDateFull(day));
    }
  }
  assert.equal(offDaysLabel(arvoTeam.find(person=>person.id==='yoona')),'화 · 금 OFF');
  assert.equal(isDesignerDayOff('yoona',''),false);
  assert.equal(isDesignerDayOff('jisu','2026-10-16'),false);
});

test('restored closed-day drafts clear only schedule and cannot be submitted',()=>{
  for(const person of arvoTeam){
    const closedDate=demoDates().find(date=>isDesignerDayOff(person.id,date));
    const draft={id:'draft-'+person.id,designerId:person.id,serviceId:'cut',date:closedDate,time:demoTimes[0],note:'직접 편집한 노트',noteEdited:true};
    assert.equal(validBooking(draft),false);
    assert.throws(()=>completeBooking([],draft));
    assert.deepEqual(clearClosedBookingDate(draft),{...draft,date:'',time:''});
    const openDate=availableBookingDates(person.id)[0];
    const open={...draft,date:openDate,time:availableBookingTimes('cut',openDate,person.id)[0]};
    assert.strictEqual(clearClosedBookingDate(open),open);
    assert.equal(validBooking(open),true);
    const bookings=completeBooking([],open);
    assert.equal(bookings[0].note,draft.note);
    assert.strictEqual(completeBooking(bookings,open),bookings);
  }
});

test('salon examples remain explicitly marked and designer reviews retain their original content',()=>{
  assert.match(arvoReviews.demoLabel,/프로토타입용 예시/);
  assert.deepEqual(arvoReviews.highlights.map(item=>item.label),['매장이 청결해요','공간이 편안해요','직원들이 친절해요','예약·방문 안내가 꼼꼼해요']);
  for(const review of arvoReviews.reviews)assert.doesNotMatch(review.paragraphs.join(''),/쌤|디자이너/);
  const yoona=designerReviews('yoona','윤아');
  const sohee=designerReviews('sohee','소희');
  assert.equal(yoona.count,623);assert.equal(sohee.count,513);
  assert.match(yoona.reviews[0].paragraphs.join(''),/윤아쌤/);
  assert.match(sohee.reviews[1].paragraphs.join(''),/소희쌤/);
  assert.equal(yoona.demoLabel,undefined);
});

test('Team displays the six approved names, ranks and OFF labels without changing booking closures',()=>{
  assert.deepEqual(arvoTeam.map(person=>[person.name,person.title,offDaysLabel(person)]),[
    ['소율','원장','화 · 토 OFF'],
    ['소희','실장','월 · 목 OFF'],
    ['하나','디자이너','수 · 목 OFF'],
    ['경현','디자이너','화 · 일 OFF'],
    ['윤아','디자이너','화 · 금 OFF'],
    ['종훈','디자이너','월 · 수 OFF'],
  ]);
});
