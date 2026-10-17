/** Small, frame-rate-independent damped springs; positions are in tab units. */
export type Spring = {position:number; velocity:number};
export function stepSpring(s:Spring,target:number,seconds:number,stiffness=320,damping=28):Spring {
  // Bounded substeps keep a suspended tab / dropped frame from exploding.
  let remaining=Math.min(Math.max(seconds,0),.064);
  let {position,velocity}=s;
  while(remaining>0){const dt=Math.min(remaining,1/240);velocity+=(stiffness*(target-position)-damping*velocity)*dt;position+=velocity*dt;remaining-=dt;}
  return {position,velocity};
}
export const smoothstep=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export type LiquidState = {head:Spring;tail:Spring;radius:Spring;neck:Spring;target:number;origin:number};
export function restingLiquid(index:number):LiquidState {
  return {head:{position:index,velocity:0},tail:{position:index,velocity:0},radius:{position:0,velocity:0},neck:{position:0,velocity:0},target:index,origin:index};
}
export function retargetLiquid(state:LiquidState,target:number):LiquidState {
  // Retarget without resetting any position, velocity, or silhouette spring.
  return target===state.target?state:{...state,target,origin:state.head.position};
}
export function stepLiquid(s:LiquidState,dt:number):LiquidState {
  const head=stepSpring(s.head,s.target,dt);
  const progress=1-Math.min(1,Math.abs(s.target-head.position)/Math.max(1,Math.abs(s.target-s.origin)));
  const radius=stepSpring(s.radius,1-smoothstep(.15,.88,progress),dt,300,28);
  const neck=stepSpring(s.neck,(1-smoothstep(.25,.68,progress))*.65,dt,650,40);
  return {...s,head,tail:stepSpring(s.tail,s.target,dt,35,12),radius,neck};
}
export function liquidSettled(s:LiquidState){return Math.abs(s.head.position-s.target)<.0005&&Math.abs(s.head.velocity)<.006&&s.radius.position<.004&&s.neck.position<.004;}
/** Concave liquid bridge, not a stretched rounded rectangle. Both sides pinch to zero. */
export function liquidBridge(tail:number,head:number,radius:number,neck:number,halfWidth:number):string {
  const sign=head>=tail?1:-1;
  // Retract the head attachment as the neck drains. Keeping a full-height
  // attachment until disconnection would leave a triangle that vanishes in one frame.
  const attachment=smoothstep(0,6,neck);
  const shoulder=21*Math.sqrt(attachment);
  const tailShoulder=radius*.8*Math.sqrt(attachment);
  const a=tail+sign*radius*(1-.55*attachment),b=head-sign*(halfWidth-16*attachment),mid=(a+b)/2;
  const top=31;
  return `M ${a} ${top-tailShoulder} C ${a+sign*radius} ${top-tailShoulder} ${mid-sign*8} ${top-neck} ${mid} ${top-neck} C ${mid+sign*8} ${top-neck} ${b-sign*12} ${top-shoulder} ${b} ${top-shoulder} L ${b} ${top+shoulder} C ${b-sign*12} ${top+shoulder} ${mid+sign*8} ${top+neck} ${mid} ${top+neck} C ${mid-sign*8} ${top+neck} ${a+sign*radius} ${top+tailShoulder} ${a} ${top+tailShoulder} Z`;
}
