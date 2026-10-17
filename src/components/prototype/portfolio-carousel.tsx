'use client';

import {useEffect, useRef, useState, type CSSProperties, type PointerEvent} from 'react';
import {portfolioCardGeometry} from '@/lib/prototype/portfolio-carousel';
import type {PortfolioWork} from '@/lib/prototype/portfolio';
import styles from './designer-portfolio.module.css';

const duration = 520;
const wrap = (value: number, count: number) => ((value % count) + count) % count;

export function PortfolioCarousel({works, label, figmaNode}: {works: PortfolioWork[]; label: string; figmaNode: string}) {
  const count = works.length;
  const [position, setPosition] = useState(0);
  const [active, setActive] = useState(0);
  const motion = useRef({position:0, destination:0, frame:0, running:false, reduced:false});
  const gesture = useRef<{id:number; x:number; y:number; base:number; preview:boolean; horizontal:boolean; scale:number} | null>(null);

  function publish(value: number) {
    motion.current.position = value;
    setPosition(value);
  }

  // HOME Magazine's single RAF owner queues rapid input one card at a time.
  // Actual frame width/height and x derive from the same fractional position.
  function run() {
    const m = motion.current;
    if (m.running) return;
    if (m.reduced) {
      publish(m.destination);
      setActive(wrap(m.destination, count));
      return;
    }
    const from = m.position;
    if (Math.abs(m.destination - from) < .00001) return;
    const to = m.destination > from
      ? Math.min(m.destination, Math.floor(from + .00001) + 1)
      : Math.max(m.destination, Math.ceil(from - .00001) - 1);
    const start = performance.now();
    m.running = true;
    const tick = (now: number) => {
      const progress = m.reduced ? 1 : Math.min(1, (now - start) / duration);
      publish(from + (to - from) * (1 - Math.cos(Math.PI * progress)) / 2);
      if (progress < 1) m.frame = requestAnimationFrame(tick);
      else {
        m.running = false;
        setActive(wrap(to, count));
        run();
      }
    };
    m.frame = requestAnimationFrame(tick);
  }

  function navigate(direction: number) {
    motion.current.destination += direction;
    run();
  }

  useEffect(() => {
    const m = motion.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {m.reduced = preference.matches;};
    sync();
    preference.addEventListener('change', sync);
    return () => {
      cancelAnimationFrame(m.frame);
      m.running = false;
      preference.removeEventListener('change', sync);
    };
  }, []);

  function finish(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    gesture.current = null;
    const dx = event.clientX - g.x;
    const dy = event.clientY - g.y;
    const direction = !cancelled && g.horizontal && Math.abs(dx) >= 45 * g.scale && Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : 0;
    if (g.preview) {
      motion.current.destination = g.base + direction;
      run();
    } else if (direction) navigate(direction);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return <>
    <div className={styles.track} role="region" aria-roledescription="캐러셀" aria-label={label}
      aria-describedby={`${figmaNode}-instructions`} tabIndex={0} data-figma-node={figmaNode} data-carousel-position={position}
      onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        if (!gesture.current) navigate(event.key === 'ArrowRight' ? 1 : -1);
      }}
      onPointerDown={event => {
        if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
        const m = motion.current;
        const scale = Math.min(1, (event.currentTarget.getBoundingClientRect().width - 24) / 382);
        gesture.current = {id:event.pointerId, x:event.clientX, y:event.clientY, base:m.destination, preview:!m.running, horizontal:false, scale};
      }}
      onPointerMove={event => {
        const g = gesture.current;
        if (!g || g.id !== event.pointerId) return;
        const dx = event.clientX - g.x;
        const dy = event.clientY - g.y;
        if (!g.horizontal && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          gesture.current = null;
          return;
        }
        if (Math.abs(dx) > 6 && (g.horizontal || Math.abs(dx) > Math.abs(dy))) {
          g.horizontal = true;
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
          const step = (dx < 0 ? 335 : 241) * g.scale + 8;
          if (g.preview && !motion.current.reduced) publish(g.base + Math.max(-.98, Math.min(.98, -dx / step)));
        }
      }}
      onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)}
      // Touch starts with implicit capture on the figure. Transferring it to the
      // track emits a bubbling lostcapture event; only loss by the track cancels.
      onLostPointerCapture={event => {if (event.target === event.currentTarget) finish(event, true);}}
      onDragStartCapture={event => event.preventDefault()}>
      {Array.from({length:count * 3}, (_, slot) => {
        const index = slot % count;
        const work = works[index];
        const geometry = portfolioCardGeometry(slot, position, count);
        // Scale image frames only, separating the gap term to retain 8px at every viewport.
        const x = `calc(${geometry.x - geometry.offset * 8} * var(--portfolio-unit) + ${geometry.offset * 8}px)`;
        const style: CSSProperties = {
          width:`calc(${geometry.width} * var(--portfolio-unit))`,
          height:`calc(${geometry.height} * var(--portfolio-unit))`,
          transform:`translate3d(${x}, -50%, 0)`,
        };
        const selected = Math.abs(geometry.offset) < .5 || geometry.offset === .5;
        return <figure className={styles.card} style={style} key={slot} data-slot={slot} data-emphasis={geometry.emphasis}
          data-figma-node={work.figmaNode} role="group" aria-roledescription="슬라이드" aria-label={`${index + 1} / ${count}`} aria-hidden={!selected}>
          <img src={work.image} alt={`${label} · ${work.caption}`} draggable={false} style={work.crop} data-cropped={Boolean(work.crop)}
            loading={slot < count || (geometry.offset >= 0 && geometry.offset <= 1) ? 'eager' : 'lazy'}/>
          <figcaption># {work.caption}</figcaption>
        </figure>;
      })}
    </div>
    <span className="sr-only" id={`${figmaNode}-instructions`}>좌우 방향키 또는 좌우로 밀어서 작품을 넘길 수 있습니다.</span>
    <span className="sr-only" aria-live="polite" aria-atomic="true">{label}: {active + 1} / {count}, {works[active].caption}</span>
  </>;
}
