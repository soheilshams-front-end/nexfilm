/** Persian digits — keep this module free of catalog data so client components stay light. */
export function fa(n: number | string): string {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return String(n).replace(/[0-9]/g, (d) => map[Number(d)])
}
