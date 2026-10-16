import {test} from 'node:test';
import assert from 'node:assert/strict';
import {magazineCardGeometry as geometry} from '../src/lib/prototype/magazine-carousel.ts';

const count = 4;
const cardsAt = position => Array.from({length:count * 3}, (_,slot) => ({slot,...geometry(slot,position,count)}));
const near = (a,b) => assert.ok(Math.abs(a-b)<0.000001, `${a} != ${b}`);

test('Magazine retains approved active/peek dimensions and an 8px gap throughout forward and reverse travel', () => {
  for (let position=-13;position<=25;position+=0.025) {
    const visible = cardsAt(position).filter(card=>card.x+card.width>0&&card.x<430).sort((a,b)=>a.x-b.x);
    assert.ok(visible.length>=1);
    for (let i=1;i<visible.length;i++) near(visible[i].x-visible[i-1].x-visible[i-1].width,8);
  }
  const active=geometry(0,0,count),peek=geometry(1,0,count);
  assert.deepEqual([active.width,active.height,active.x],[335,460,0]);
  assert.deepEqual([peek.width,peek.height,peek.x],[240,330,343]);
});

test('Magazine first card enters from a reduced size and grows continuously over every infinite-loop boundary', () => {
  for (const boundary of [0,4,8,12,24,-4,-12]) {
    const slot=((boundary%12)+12)%12;
    const start=geometry(slot,boundary-1,count),middle=geometry(slot,boundary-.5,count),end=geometry(slot,boundary,count);
    near(start.emphasis,0);near(middle.emphasis,.5);near(end.emphasis,1);
    assert.ok(start.x>middle.x&&middle.x>end.x);
    const before=cardsAt(boundary-.000001),after=cardsAt(boundary+.000001);
    for (const card of before.filter(card=>card.x+card.width>0&&card.x<430)) {
      near(Math.round(card.width),Math.round(after[card.slot].width));
      assert.ok(Math.abs(card.x-after[card.slot].x)<.001);
    }
  }
});

test('Magazine card recycling occurs entirely outside the viewport', () => {
  for (let position=-13;position<13;position+=.01) {
    const before=cardsAt(position),after=cardsAt(position+.01);
    for (const card of before) if(Math.abs(card.x-after[card.slot].x)>1000) {
      assert.ok(card.x+card.width<0||card.x>430);
      assert.ok(after[card.slot].x+after[card.slot].width<0||after[card.slot].x>430);
    }
  }
});
