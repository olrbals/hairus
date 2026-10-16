'use client';
import {useEffect, useRef} from 'react';

/** Mouse enhancement only: touch and trackpad keep native scrolling. */
export function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0, startLeft = 0, pointer = -1, moved = false;
    const down = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      pointer = event.pointerId; startX = event.clientX; startLeft = el.scrollLeft; moved = false;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerId !== pointer || !(event.buttons & 1)) return;
      const distance = event.clientX - startX;
      if (!moved && Math.abs(distance) < 6) return;
      moved = true;
      el.setPointerCapture(pointer);
      el.style.scrollSnapType = 'none'; el.style.scrollBehavior = 'auto'; el.style.userSelect = 'none';
      event.preventDefault(); el.scrollLeft = startLeft - distance;
    };
    const end = () => {
      if (pointer < 0) return;
      if (el.hasPointerCapture(pointer)) el.releasePointerCapture(pointer);
      pointer = -1;
      const left = el.scrollLeft;
      el.style.scrollSnapType = ''; el.style.scrollBehavior = ''; el.style.userSelect = '';
      if (moved && el.classList.contains('airy-gallery-track')) el.scrollTo({left:Math.round(left/el.clientWidth)*el.clientWidth,behavior:'smooth'});
    };
    const wheel = (event: WheelEvent) => {
      if (!event.shiftKey) return;
      const delta = (event.deltaX || event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientWidth : 1);
      if (!delta || (delta < 0 && el.scrollLeft <= 1) || (delta > 0 && el.scrollLeft >= el.scrollWidth-el.clientWidth-1)) return;
      event.preventDefault();
      const amount = el.classList.contains('airy-gallery-track') ? Math.sign(delta)*el.clientWidth : delta;
      el.scrollBy({left:amount,behavior:'smooth'});
    };
    const click = (event: MouseEvent) => {if (moved) {event.preventDefault();event.stopPropagation();moved=false;}};
    const drag = (event: DragEvent) => event.preventDefault();
    el.addEventListener('pointerdown',down); el.addEventListener('pointermove',move);
    el.addEventListener('pointerup',end); el.addEventListener('pointercancel',end);
    el.addEventListener('wheel',wheel,{passive:false}); el.addEventListener('click',click,true); el.addEventListener('dragstart',drag);
    return () => {
      el.removeEventListener('pointerdown',down); el.removeEventListener('pointermove',move);
      el.removeEventListener('pointerup',end); el.removeEventListener('pointercancel',end);
      el.removeEventListener('wheel',wheel); el.removeEventListener('click',click,true); el.removeEventListener('dragstart',drag);
    };
  }, []);
  return ref;
}
