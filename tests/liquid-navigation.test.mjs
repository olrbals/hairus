import {test} from 'node:test';
import assert from 'node:assert/strict';
import {restingLiquid,retargetLiquid,stepLiquid,stepSpring,liquidSettled,liquidBridge} from '../src/lib/liquid-navigation.ts';

const run=(from,to,hz=60)=>{
 let s=retargetLiquid(restingLiquid(from),to),frames=[];
 for(let i=0;i<hz*2;i++){s=stepLiquid(s,1/hz);frames.push(s);if(liquidSettled(s))break;}
 return frames;
};
test('Liquid springs converge for adjacent/distant tabs in both directions with restrained overshoot',()=>{
 for(const [from,to] of [[0,1],[1,2],[2,3],[3,0],[0,3],[3,1]])for(const hz of [30,60,120]){
  const frames=run(from,to,hz),last=frames.at(-1);
  assert.ok(liquidSettled(last));
  assert.ok(frames.some(s=>(s.head.position-to)*Math.sign(to-from)>0),'spring should overshoot');
  assert.ok(frames.every(s=>s.head.position>=Math.min(from,to)-.06&&s.head.position<=Math.max(from,to)+.06));
 }
});
test('Glass connects with a concave neck then separates while the trailing droplet is still visible',()=>{
 for(const [from,to] of [[0,1],[0,3],[3,0]]){
  const frames=run(from,to);const connected=frames.findIndex(s=>s.neck.position*27>2&&Math.abs(s.head.position-s.tail.position)*97>45-s.radius.position*27);
  const separated=frames.findIndex((s,i)=>i>connected&&s.neck.position*27<=.3&&s.radius.position*27>.8);
  assert.ok(connected>=0);assert.ok(separated>connected);
  const path=liquidBridge(50,140,12,2,45);
  assert.ok(path.includes('29')&&path.includes('33')&&path.split('C').length===5);
  // Both attachments collapse continuously before the bridge is removed.
  const drained=liquidBridge(50,340,4,0,45).match(/-?\d+(?:\.\d+)?/g).map(Number);
  assert.ok(drained.filter((_,i)=>i%2===1).every(y=>y===31));
 }
});
test('Rapid reversals preserve all spring positions and velocities; latest target wins',()=>{
 let s=restingLiquid(0);
 for(const target of [3,1,0,2,3,3,0,1]){
  const before=s;s=retargetLiquid(s,target);
  for(const key of ['head','tail','radius','neck'])assert.deepEqual(s[key],before[key]);
  for(let i=0;i<3;i++)s=stepLiquid(s,1/60);
 }
 for(let i=0;i<150&&!liquidSettled(s);i++)s=stepLiquid(s,1/60);
 assert.equal(s.target,1);assert.ok(liquidSettled(s));
});
test('Same-tab reselection is a no-op; reduced-motion/reset has no trailing shape',()=>{
 const s=restingLiquid(2);assert.equal(retargetLiquid(s,2),s);
 assert.ok(liquidSettled(s));assert.equal(s.radius.position,0);assert.equal(s.neck.position,0);
});
test('Dropped frames remain finite and stable, and zero dt does not advance a spring',()=>{
 assert.deepEqual(stepSpring({position:0,velocity:4},3,0),{position:0,velocity:4});
 let s=retargetLiquid(restingLiquid(0),3);
 for(let i=0;i<40;i++)s=stepLiquid(s,10);
 assert.ok(liquidSettled(s));assert.ok(Number.isFinite(s.head.position));
});
