/** Persian digits — keep this module free of catalog data so client components stay light. */
export function fa(n: number | string): string {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return String(n).replace(/[0-9]/g, (d) => map[Number(d)])
}

/** True when the string is mostly Latin (English titles / episode names). */
export function isLatinTitle(text: string | null | undefined): boolean {
  if (!text) return false
  const letters = text.replace(/[^A-Za-z\u0600-\u06FF]/g, '')
  if (!letters) return false
  const latin = (letters.match(/[A-Za-z]/g) ?? []).length
  return latin / letters.length >= 0.5
}
