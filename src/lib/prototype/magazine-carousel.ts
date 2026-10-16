// Three copies keep recycled cards outside the clipped viewport in either direction.
export function magazineCardGeometry(slot: number, position: number, count: number) {
  const total = count * 3;
  const offset = ((slot - position + count) % total + total) % total - count;
  const emphasis = Math.max(0, 1 - Math.abs(offset));
  const x = offset <= 0 ? offset * 248 : offset <= 1 ? offset * 343 : 343 + (offset - 1) * 248;
  return {offset, emphasis, x, width: 240 + 95 * emphasis, height: 330 + 130 * emphasis};
}
