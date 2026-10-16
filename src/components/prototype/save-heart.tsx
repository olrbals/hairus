/** Figma saveOff / saveOn (1072:2663, 1072:2666). Visual only; callers own saving behavior. */
export function SaveHeart({saved}: {saved: boolean}) {
  return <img
    className={saved ? "save-heart-icon is-saved" : "save-heart-icon"}
    src={saved ? '/assets/figma/v1/save-on-glass.png' : '/assets/figma/v1/63e07.svg'}
    width={saved ? 30 : 22}
    height={saved ? 28 : 22}
    alt=""
    aria-hidden="true"
    decoding="async"
  />;
}
