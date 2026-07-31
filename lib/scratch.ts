export const BRUSH_RADIUS = 22;
export const CLEAR_THRESHOLD = 0.55;
export const SAMPLE_EVERY = 8;

/** Reads a design token off the root element so the foil stays on-palette. */
function token(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/** Gold face, a faint diagonal sheen, and a hairline inner border. */
export function paintFoil(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): void {
  const gold = ctx.createLinearGradient(0, 0, w, h);
  gold.addColorStop(0, token("--color-gold-600"));
  gold.addColorStop(0.38, token("--color-gold-400"));
  gold.addColorStop(0.62, token("--color-gold-500"));
  gold.addColorStop(1, token("--color-gold-600"));
  ctx.fillStyle = gold;
  ctx.fillRect(0, 0, w, h);

  const sheen = ctx.createLinearGradient(0, h, w, 0);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.45, "rgba(255,255,255,0.2)");
  sheen.addColorStop(0.55, "rgba(255,255,255,0.2)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(6.5, 6.5, w - 13, h - 13);
}

/**
 * Estimates how much foil is gone by sampling every 8th pixel's alpha —
 * plenty accurate for a threshold, and far cheaper than reading all of it.
 */
export function clearedFraction(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return 0;

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let clear = 0;
  let total = 0;
  for (let i = 3; i < data.length; i += 4 * SAMPLE_EVERY) {
    total += 1;
    if (data[i] < 128) clear += 1;
  }
  return total > 0 ? clear / total : 0;
}
