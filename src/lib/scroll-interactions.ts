export function clampProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function centerTriggeredProgress(
  elementTop: number,
  viewportHeight: number,
  travelDistance: number,
) {
  return viewportTriggeredProgress(
    elementTop,
    viewportHeight,
    travelDistance,
    0.5,
  );
}

export function viewportTriggeredProgress(
  elementTop: number,
  viewportHeight: number,
  travelDistance: number,
  triggerRatio: number,
) {
  const triggerLine = viewportHeight * triggerRatio;
  return clampProgress(
    (triggerLine - elementTop) / Math.max(1, travelDistance),
  );
}
