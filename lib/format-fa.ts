/** Persian digits — keep this module free of catalog data so client components stay light. */
export function fa(n: number | string): string {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return String(n).replace(/[0-9]/g, (d) => map[Number(d)])
}

/** Normalize catalog (0–10) and Saintstream (~0–5) ratings for UI display. */
export function displayRating(rating: number): number {
  const n = Number(rating)
  if (!Number.isFinite(n)) return 0
  const scaled = n <= 5 ? n * 2 : n
  return Number(Math.min(10, scaled).toFixed(1))
}

/** True when the string is mostly Latin (English titles / episode names). */
export function isLatinTitle(text: string | null | undefined): boolean {
  if (!text) return false
  const letters = text.replace(/[^A-Za-z\u0600-\u06FF]/g, '')
  if (!letters) return false
  const latin = (letters.match(/[A-Za-z]/g) ?? []).length
  return latin / letters.length >= 0.5
}
