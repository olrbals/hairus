export function SaveHeart({saved}: {saved: boolean}) {
  if (saved) return <>♥</>;

  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555551" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{display:'block'}}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>
  </svg>;
}
