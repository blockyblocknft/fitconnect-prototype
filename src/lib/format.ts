export function capacityFill(taken: number, max: number): number {
  if (max <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((taken / max) * 100)))
}
export function isNearlyFull(taken: number, max: number): boolean {
  return capacityFill(taken, max) >= 85
}
export function caloriesRemaining(eaten: number, goal: number): number {
  return Math.max(0, goal - eaten)
}
