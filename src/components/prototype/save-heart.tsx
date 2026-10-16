/** Figma saveOff / saveOn (1072:2663, 1072:2666). Visual only; callers own saving behavior. */
export function SaveHeart({saved}: {saved: boolean}) {
  return <img
    className="save-heart-icon"
    src={saved ? '/assets/figma/v1/save-on-glass.png' : '/assets/figma/v1/63e07.svg'}
    width={22}
    height={22}
    alt=""
    aria-hidden="true"
    decoding="async"
  />;
}
