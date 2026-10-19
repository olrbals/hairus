/** Flat saved-state heart; the parent button owns save behavior. */
export function SaveHeart({saved}: {saved: boolean}) {
  if (saved) return <svg
    className="save-heart-icon is-saved"
    width={22}
    height={22}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  ><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/></svg>;
  return <img
    className="save-heart-icon"
    src="/assets/figma/v1/63e07.svg"
    width={22}
    height={22}
    alt=""
    aria-hidden="true"
    decoding="async"
  />;
}
