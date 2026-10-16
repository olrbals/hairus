'use client';

import Link from 'next/link';
import {useEffect, useRef, useState, type CSSProperties, type PointerEvent} from 'react';
import {articles} from '@/lib/prototype/catalog';
import {magazineCardGeometry} from '@/lib/prototype/magazine-carousel';

const copy = [
  {title:'머릿결에도 루틴이 필요해', subtitle:'집에서도 실천할 수 있는 헤어케어 노하우'},
  {title:'드라이만 잘 해도 달라지는 스타일', subtitle:'집에서도 쉽게 따라하는 볼륨 드라이 방법'},
  {title:'처음 색 그대로, 염색 후 오래 유지하기', subtitle:'컬러가 쉽게 빠지지 않는 데일리 케어 팁'},
  {title:'나에게 어울리는 앞머리는 따로 있다', subtitle:'얼굴형과 분위기에 따라 달라지는 앞머리 선택법'},
];
const slots = Array.from({length: articles.length * 3}, (_, slot) => slot);
const duration = 520;

export function MagazineCarousel() {
  const [position, setPosition] = useState(0);
  const [active, setActive] = useState(0);
  const motion = useRef({position:0, destination:0, frame:0, running:false, reduced:false});
  const gesture = useRef<{id:number; x:number; y:number; base:number; preview:boolean; horizontal:boolean} | null>(null);
  const suppressClick = useRef(false);

  function publish(value: number) {
    motion.current.position = value;
    setPosition(value);
  }

  // One animation owner serializes rapid button/swipe input. DOM styles are only
  // derived from this position; React and imperative transitions never compete.
  function run() {
    const m = motion.current;
    if (m.running) return;
    if (m.reduced) {
      publish(m.destination);
      setActive(((m.destination % articles.length) + articles.length) % articles.length);
      return;
    }
    const from = m.position;
    if (Math.abs(m.destination - from) < 0.00001) return;
    const to = m.destination > from
      ? Math.min(m.destination, Math.floor(from + 0.00001) + 1)
      : Math.max(m.destination, Math.ceil(from - 0.00001) - 1);
    const start = performance.now();
    m.running = true;
    const tick = (now: number) => {
      const progress = m.reduced ? 1 : Math.min(1, (now - start) / duration);
      publish(from + (to - from) * (1 - Math.cos(Math.PI * progress)) / 2);
      if (progress < 1) m.frame = requestAnimationFrame(tick);
      else {
        m.running = false;
        setActive(((to % articles.length) + articles.length) % articles.length);
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
    run();
    preference.addEventListener('change', sync);
    return () => {cancelAnimationFrame(m.frame); m.running = false; preference.removeEventListener('change', sync);};
  }, []);

  function finish(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    gesture.current = null;
    const dx = event.clientX - g.x;
    const dy = event.clientY - g.y;
    const direction = !cancelled && Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : 0;
    if (g.preview) {
      motion.current.destination = g.base + direction;
      run();
    } else if (direction) navigate(direction);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return <>
    <div className="magazine-track" role="region" aria-roledescription="캐러셀" aria-label="HAIRUS Magazine" data-carousel-position={position}
      onPointerDown={event => {
        if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
        suppressClick.current = false;
        const m = motion.current;
        gesture.current = {id:event.pointerId, x:event.clientX, y:event.clientY, base:m.destination, preview:!m.running, horizontal:false};
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
          suppressClick.current = true;
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
          if (g.preview && !motion.current.reduced) publish(g.base + Math.max(-0.98, Math.min(0.98, -dx / (dx < 0 ? 343 : 248))));
        }
      }}
      onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)}
      onDragStartCapture={event => event.preventDefault()}
      onClickCapture={event => {if (suppressClick.current) {event.preventDefault(); event.stopPropagation(); suppressClick.current = false;}}}>
      {slots.map(slot => {
        const index = slot % articles.length;
        const article = articles[index];
        const geometry = magazineCardGeometry(slot, position, articles.length);
        const visible = geometry.offset > -1 && geometry.offset < 2;
        const style = {'--magazine-emphasis':geometry.emphasis, transform:`translate3d(${geometry.x}px, -50%, 0)`} as CSSProperties;
        return <Link key={slot} href={`/articles/${article.id}`} className={`magazine-card magazine-card--${article.id}`} style={style}
          data-slot={slot} data-emphasis={geometry.emphasis} tabIndex={visible ? 0 : -1} aria-hidden={!visible} draggable={false}>
          <img src={article.image} alt={copy[index].title} draggable={false}/>
          <div className="magazine-caption"><h3>{copy[index].title}</h3><p>{copy[index].subtitle}</p></div>
        </Link>;
      })}
    </div>
    <div className="banner-controls"><span className="sr-only" aria-live="polite">{active + 1} / {articles.length}</span><button type="button" aria-label="이전 배너" onClick={() => navigate(-1)}>←</button><button type="button" aria-label="다음 배너" onClick={() => navigate(1)}>→</button></div>
  </>;
}
