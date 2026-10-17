/** Same three-copy recycling and continuous geometry as HOME Magazine.
 * Kept separate so Portfolio's 241px inactive width cannot alter HOME's 240px.
 * Responsive scaling applies to frames, while the gap remains exactly 8px.
 */
export function portfolioCardGeometry(slot: number, position: number, count: number, scale = 1) {
  const total = count * 3;
  const offset = ((slot - position + count) % total + total) % total - count;
  const emphasis = Math.max(0, 1 - Math.abs(offset));
  const smallStep = 241 * scale + 8;
  const largeStep = 335 * scale + 8;
  const x = offset <= 0 ? offset * smallStep : offset <= 1 ? offset * largeStep : largeStep + (offset - 1) * smallStep;
  return {offset, emphasis, x, width: (241 + 94 * emphasis) * scale, height: (330 + 130 * emphasis) * scale};
}
