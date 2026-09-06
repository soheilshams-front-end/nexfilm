import { isKidsSafeMaturity } from '@/lib/title-credits'
import { isKidsProfileActive } from '@/lib/user-store'

export function filterKidsSafeTitles<T extends { maturity: string }>(items: T[]): T[] {
  if (typeof window === 'undefined') return items
  if (!isKidsProfileActive()) return items
  return items.filter((item) => isKidsSafeMaturity(item.maturity))
}

export function useKidsMode(): boolean {
  // callers should mirror with useState+useEffect; this sync helper is for event handlers
  if (typeof window === 'undefined') return false
  return isKidsProfileActive()
}
