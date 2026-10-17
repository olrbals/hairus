'use client';

import {useId,useImperativeHandle,useLayoutEffect,useRef,type Ref,type RefObject} from 'react';
import {liquidBridge,liquidSettled,restingLiquid,retargetLiquid,stepLiquid} from '@/lib/liquid-navigation';

export type LiquidIndicatorHandle={moveTo:(index:number)=>void};
export function LiquidIndicator({ref,nav,index,visible}:{ref:Ref<LiquidIndicatorHandle>;nav:RefObject<HTMLElement|null>;index:number;visible:boolean}) {
  const id=useId().replace(/:/g,'');
  const layer=useRef<HTMLDivElement>(null);
  const glass=useRef<HTMLDivElement>(null);
  const svg=useRef<SVGSVGElement>(null);
  const head=useRef<SVGRectElement>(null);
  const tail=useRef<SVGCircleElement>(null);
  const bridge=useRef<SVGPathElement>(null);
  const controller=useRef<LiquidIndicatorHandle>({moveTo:()=>{}});
  const state=useRef(restingLiquid(index));
  const active=useRef(index);
  useImperativeHandle(ref,()=>({moveTo:next=>controller.current.moveTo(next)}),[]);

  useLayoutEffect(()=>{
    const container=layer.current,staticGlass=glass.current,surface=svg.current;
    if(!container||!staticGlass||!surface||!nav.current||!visible)return;
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,last=0,pitch=0;
    const paint=(rest=false)=>{
      const s=state.current;
      const center=(position:number)=>4+pitch*(position+.5);
      const baseWidth=pitch-6;
      const speed=Math.min(1,Math.abs(s.head.velocity)/5);
      const width=baseWidth*(1-.06*speed),height=54*(1-.04*speed);
      // Tiny elastic overshoot remains inside the original bar at either end.
      const x=Math.max(baseWidth/2+3,Math.min(4+pitch*4-baseWidth/2,center(s.head.position)));
      const tx=center(s.tail.position),radius=Math.max(0,s.radius.position)*27;
      const neck=Math.max(0,s.neck.position)*27;
      head.current?.setAttribute('x',String(x-width/2));
      head.current?.setAttribute('y',String(31-height/2));
      head.current?.setAttribute('width',String(width));
      head.current?.setAttribute('height',String(height));
      head.current?.setAttribute('rx',String(height/2));
      tail.current?.setAttribute('cx',String(tx));
      tail.current?.setAttribute('r',String(radius));
      const connected=radius>.35&&neck>.3&&Math.abs(x-tx)>width/2-radius;
      bridge.current?.setAttribute('d',connected?liquidBridge(tx,x,radius,neck,width/2):'');
      staticGlass.style.width=`${baseWidth}px`;
      staticGlass.style.transform=`translateX(${7+pitch*s.target}px)`;
      // Fade only the last subpixel differences back to the exact approved CSS surface.
      const blend=rest?1:Math.max(0,1-Math.max(Math.abs(s.head.position-s.target)*100,radius/1.5));
      staticGlass.style.opacity=String(blend);
      surface.style.opacity=String(1-blend);
      const separated=radius>.8&&Math.abs(x-tx)>width/2+radius+3;
      container.dataset.phase=rest?'rest':connected?'connected':separated?'separated':radius>.8?'stretching':'settling';
      container.dataset.position=String(s.head.position);
      container.dataset.target=String(s.target);
      container.dataset.radius=String(radius);
      container.dataset.neck=String(neck);
    };
    const stop=()=>{cancelAnimationFrame(frame);frame=0;last=0;};
    const tick=(now:number)=>{
      const dt=last?(now-last)/1000:1/60;last=now;
      state.current=stepLiquid(state.current,dt);
      if(liquidSettled(state.current)){
        state.current=restingLiquid(state.current.target);paint(true);stop();
      }else{paint();frame=requestAnimationFrame(tick);}
    };
    const moveTo=(next:number)=>{
      if(next<0||!visible)return;
      if(media.matches||state.current.target<0){stop();state.current=restingLiquid(next);paint(true);return;}
      if(next===state.current.target)return;
      state.current=retargetLiquid(state.current,next);
      if(!frame){last=0;frame=requestAnimationFrame(tick);}
    };
    controller.current={moveTo};
    const measure=()=>{const width=nav.current?.clientWidth??0;if(width<=8)return;pitch=(width-8)/4;paint(!frame);};
    const reduce=()=>{if(media.matches){stop();state.current=restingLiquid(state.current.target);paint(true);}};
    const observer=new ResizeObserver(measure);observer.observe(nav.current);
    media.addEventListener('change',reduce);
    // A genuinely hidden navigation restarts at its page's active tab, never at HOME.
    state.current=restingLiquid(active.current);measure();
    return ()=>{stop();observer.disconnect();media.removeEventListener('change',reduce);controller.current={moveTo:()=>{}};};
  },[nav,visible]);

  useLayoutEffect(()=>{active.current=index;if(index>=0)controller.current.moveTo(index);},[index]);

  return <div ref={layer} className="liquid-indicator" aria-hidden="true" hidden={index<0}>
    <div ref={glass} className="liquid-indicator__rest"/>
    <svg ref={svg} className="liquid-indicator__surface" width="100%" height="62" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Union the silhouette first: transparency never doubles at the liquid joints.
            The filter belongs only to the glass, never the icon or label layers. */}
        <filter id={`liquid-${id}`} x="-5%" y="-25%" width="110%" height="150%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="soft"/>
          <feColorMatrix in="soft" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 20 -9" result="shape"/>
          <feGaussianBlur in="shape" stdDeviation="2" result="shadowBlur"/>
          <feOffset in="shadowBlur" dy="1" result="shadowOffset"/>
          <feComposite in="shadowOffset" in2="shape" operator="out" result="outerShadow"/>
          <feFlood floodColor="black" floodOpacity=".045"/>
          <feComposite in2="outerShadow" operator="in" result="shadow"/>
          <feFlood floodColor="white" floodOpacity=".07"/>
          <feComposite in2="shape" operator="in" result="fill"/>
          <feMorphology in="shape" operator="erode" radius="1" result="inset"/>
          <feComposite in="shape" in2="inset" operator="out" result="edge"/>
          <feFlood floodColor="white" floodOpacity=".48"/>
          <feComposite in2="edge" operator="in" result="border"/>
          <feGaussianBlur in="shape" stdDeviation="1" result="innerBlur"/>
          <feOffset in="innerBlur" dy="1" result="innerOffset"/>
          <feComposite in="shape" in2="innerOffset" operator="out" result="topEdge"/>
          <feFlood floodColor="white" floodOpacity=".65"/>
          <feComposite in2="topEdge" operator="in" result="highlight"/>
          <feGaussianBlur in="shape" stdDeviation="1.5" result="lowerBlur"/>
          <feOffset in="lowerBlur" dy="-1" result="lowerOffset"/>
          <feComposite in="shape" in2="lowerOffset" operator="out" result="bottomEdge"/>
          <feFlood floodColor="black" floodOpacity=".06"/>
          <feComposite in2="bottomEdge" operator="in" result="shade"/>
          <feMerge><feMergeNode in="shadow"/><feMergeNode in="fill"/><feMergeNode in="border"/><feMergeNode in="highlight"/><feMergeNode in="shade"/></feMerge>
        </filter>
      </defs>
      <g filter={`url(#liquid-${id})`}><path ref={bridge}/><circle ref={tail} cy="31" r="0"/><rect ref={head} y="4" height="54" rx="27"/></g>
    </svg>
  </div>;
}
