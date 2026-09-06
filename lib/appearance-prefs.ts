const KEY = 'nextfilm-appearance'

export type AppearancePrefs = {
  theme: 'dark' | 'dim' | 'midnight'
  accent: string
  fontScale: number
}

export const defaultAppearance: AppearancePrefs = {
  theme: 'dark',
  accent: '#30d158',
  fontScale: 100,
}

const THEME_BG: Record<AppearancePrefs['theme'], string> = {
  dark: '20, 30, 26',
  dim: '24, 24, 27',
  midnight: '8, 12, 28',
}

export function loadAppearance(): AppearancePrefs {
  if (typeof window === 'undefined') return defaultAppearance
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultAppearance
    const p = JSON.parse(raw) as Partial<AppearancePrefs>
    return {
      theme: p.theme === 'dim' || p.theme === 'midnight' ? p.theme : 'dark',
      accent: typeof p.accent === 'string' ? p.accent : defaultAppearance.accent,
      fontScale:
        typeof p.fontScale === 'number' ? Math.min(130, Math.max(85, p.fontScale)) : 100,
    }
  } catch {
    return defaultAppearance
  }
}

export function saveAppearance(prefs: AppearancePrefs) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs))
  } catch {
    /* ignore */
  }
}

function hexToRgb(hex: string): string | null {
  const h = hex.replace('#', '')
  if (h.length !== 6) return null
  const n = Number.parseInt(h, 16)
  if (!Number.isFinite(n)) return null
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

export function applyAppearance(prefs: AppearancePrefs) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.theme = prefs.theme
  root.style.setProperty('--bg-rgb', THEME_BG[prefs.theme])
  root.style.setProperty('--bg', `rgb(${THEME_BG[prefs.theme]})`)
  const rgb = hexToRgb(prefs.accent)
  if (rgb) {
    root.style.setProperty('--brand-rgb', rgb)
    root.style.setProperty('--brand', prefs.accent)
  }
  root.style.fontSize = `${prefs.fontScale}%`
}
