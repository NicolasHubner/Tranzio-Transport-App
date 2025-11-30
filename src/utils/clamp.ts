export function clamp(min: number, target: number, max: number) {
  return Math.max(min, Math.min(max, target));
}
