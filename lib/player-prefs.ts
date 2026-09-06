import type { SubtitlePrefs } from '@/components/subtitle-settings'
import { playerSettings } from '@/lib/movies'

export type PlayerPrefs = {
  quality: string
  subtitle: string
  audio: string
  speed: string
  caption: SubtitlePrefs
  autoplayTrailers: boolean
  skipIntro: boolean
}

const KEY = 'nextfilm-player-prefs'

export const defaultCaptionPrefs: SubtitlePrefs = {
  size: 'M',
  style: 'outline',
  opacity: 35,
  position: 'bottom',
}

export const defaultPlayerPrefs: PlayerPrefs = {
  quality: 'خودکار',
  subtitle: 'فارسی',
  audio: 'فارسی (دوبله)',
  speed: '۱×',
  caption: defaultCaptionPrefs,
  autoplayTrailers: true,
  skipIntro: true,
}

function isString(v: unknown): v is string {
  return typeof v === 'string'
}

export function loadPlayerPrefs(): PlayerPrefs {
  if (typeof window === 'undefined') return defaultPlayerPrefs
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultPlayerPrefs
    const parsed = JSON.parse(raw) as Partial<PlayerPrefs>
    const quality = isString(parsed.quality) && playerSettings.qualities.includes(parsed.quality)
      ? parsed.quality
      : defaultPlayerPrefs.quality
    const subtitle = isString(parsed.subtitle) && playerSettings.subtitles.includes(parsed.subtitle)
      ? parsed.subtitle
      : defaultPlayerPrefs.subtitle
    const audio = isString(parsed.audio) && playerSettings.audios.includes(parsed.audio)
      ? parsed.audio
      : defaultPlayerPrefs.audio
    const speed = isString(parsed.speed) && playerSettings.speeds.includes(parsed.speed)
      ? parsed.speed
      : defaultPlayerPrefs.speed
    const cap = (parsed.caption ?? {}) as Partial<SubtitlePrefs>
    return {
      quality,
      subtitle,
      audio,
      speed,
      caption: {
        size: cap.size === 'S' || cap.size === 'L' || cap.size === 'XL' ? cap.size : 'M',
        style: cap.style === 'default' ? 'default' : 'outline',
        opacity: typeof cap.opacity === 'number' ? Math.max(0, Math.min(100, cap.opacity)) : 35,
        position: cap.position === 'middle' ? 'middle' : 'bottom',
      },
      autoplayTrailers:
        typeof parsed.autoplayTrailers === 'boolean'
          ? parsed.autoplayTrailers
          : defaultPlayerPrefs.autoplayTrailers,
      skipIntro:
        typeof parsed.skipIntro === 'boolean' ? parsed.skipIntro : defaultPlayerPrefs.skipIntro,
    }
  } catch {
    return defaultPlayerPrefs
  }
}

export function savePlayerPrefs(prefs: PlayerPrefs) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs))
  } catch {
    /* ignore quota */
  }
}
