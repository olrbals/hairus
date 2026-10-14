
'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { asset } from '@/lib/prototype/catalog';
import '@/styles/home-popup.css';

type HomePopupProps = {
  open: boolean;
  slide: number;
  onSlideChange: (next: number) => void;
  onClose: () => void;
  onDismissToday: () => void;
};

const banners = [
  {
    image: asset('20198.png'),
    title: 'COMING SOON 11/24',
    description: 'HAIRUS X CHAHONG ROOM 특별한 만남을 성수에서',
    href: '/articles/popup',
  },
  {
    image: asset('88ad2.png'),
    title: 'Weekly Editorial | Week3',
    description: '이번 주 눈여겨볼 헤어 이야기를 만나보세요.',
    href: '/articles/issue',
  },
];

export function HomePopup({
  open,
  slide,
  onSlideChange,
  onClose,
  onDismissToday,
}: HomePopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dragStartX = useRef<number | null>(null);
  const wasSwipe = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  const index = slide === 1 ? 1 : 0;
  const banner = banners[index];

  return (
    <dialog
      ref={dialogRef}
      className="home-banner-dialog"
      aria-label="HAIRUS 소식 팝업"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="home-banner">
        <Link
          href={banner.href}
          className="home-banner-content"
          aria-label={`${banner.title} 자세히 보기`}
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          onWheel={(event) => {
            if (
                Math.abs(event.deltaX) > Math.abs(event.deltaY) &&
                Math.abs(event.deltaX) > 3
            ) {
                onSlideChange(event.deltaX > 0 ? 1 : 0);
            }
        }}
          onPointerDown={(event) => {
            dragStartX.current = event.clientX;
            wasSwipe.current = false;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={(event) => {
            const startX = dragStartX.current;
            dragStartX.current = null;

            if (startX === null) return;

            const distance = event.clientX - startX;

            if (Math.abs(distance) >= 45) {
              wasSwipe.current = true;
              onSlideChange(
                distance < 0
                  ? Math.min(1, index + 1)
                  : Math.max(0, index - 1)
              );
            }
          }}
          onPointerCancel={() => {
            dragStartX.current = null;
          }}
          onClick={(event) => {
            if (wasSwipe.current) {
              event.preventDefault();
              wasSwipe.current = false;
              return;
            }
          }}
        >
          <img
            className={`home-banner-image home-banner-image-${index}`}
            src={banner.image}
            alt=""
            draggable={false}
          />

          <span className="home-banner-count">
            {index + 1} / 2
          </span>

          <div className="home-banner-copy">
            <strong>{banner.title}</strong>
            <span>{banner.description}</span>
          </div>
        </Link>

        <div className="home-banner-footer">
          <button type="button" onClick={onDismissToday}>
            오늘 하루 보지 않기
          </button>
          <button type="button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </dialog>
  );
}
