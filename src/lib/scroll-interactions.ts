export function clampProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function centerTriggeredProgress(
  elementTop: number,
  viewportHeight: number,
  travelDistance: number,
) {
  const viewportCenter = viewportHeight * 0.5;
  return clampProgress(
    (viewportCenter - elementTop) / Math.max(1, travelDistance),
  );
}

export function pageScrollControls(
  scrollY: number,
  viewportHeight: number,
  scrollHeight: number,
) {
  const maxScroll = Math.max(0, scrollHeight - viewportHeight);
  const hasLongPage = maxScroll >= 600;

  return {
    top: hasLongPage && scrollY >= 600,
    bottom: hasLongPage && scrollY < maxScroll - 4,
  };
}
