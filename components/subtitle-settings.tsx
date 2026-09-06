'use client'

import { cn } from '@/lib/utils'

export type SubtitlePrefs = {
  size: 'S' | 'M' | 'L' | 'XL'
  style: 'default' | 'outline'
  opacity: number
  position: 'bottom' | 'middle'
}

const sizes: SubtitlePrefs['size'][] = ['S', 'M', 'L', 'XL']

export function SubtitleSettings({
  prefs,
  onChange,
}: {
  prefs: SubtitlePrefs
  onChange: (p: SubtitlePrefs) => void
}) {
  return (
    <div className="space-y-4 px-1 pb-1 pt-0.5 text-sm text-white">
      <div>
        <p className="mb-2 text-[11px] text-white/45">اندازه فونت</p>
        <div className="flex gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ ...prefs, size: s })}
              className={cn(
                'min-h-10 flex-1 rounded-xl text-xs font-bold ring-1 ring-white/10 transition-colors',
                prefs.size === s ? 'bg-white/15 text-[var(--brand)]' : 'bg-white/5 text-white/70 hover:bg-white/10',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] text-white/45">موقعیت</p>
        <div className="flex gap-1.5">
          {(['bottom', 'middle'] as const).map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => onChange({ ...prefs, position: pos })}
              className={cn(
                'min-h-10 flex-1 rounded-xl text-xs font-semibold ring-1 ring-white/10 transition-colors',
                prefs.position === pos ? 'bg-white/15 text-[var(--brand)]' : 'bg-white/5 text-white/70 hover:bg-white/10',
              )}
            >
              {pos === 'bottom' ? 'پایین' : 'وسط'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] text-white/45">سبک</p>
        <div className="flex gap-1.5">
          {(['outline', 'default'] as const).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => onChange({ ...prefs, style })}
              className={cn(
                'min-h-10 flex-1 rounded-xl text-xs font-semibold ring-1 ring-white/10 transition-colors',
                prefs.style === style ? 'bg-white/15 text-[var(--brand)]' : 'bg-white/5 text-white/70 hover:bg-white/10',
              )}
            >
              {style === 'outline' ? 'سایهٔ قوی' : 'ساده'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] text-white/45">شفافیت پس‌زمینه</p>
        <input
          type="range"
          min={0}
          max={80}
          value={prefs.opacity}
          onChange={(e) => onChange({ ...prefs, opacity: Number(e.target.value) })}
          aria-label="شفافیت پس‌زمینه زیرنویس"
          className="player-range h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15"
        />
      </div>
    </div>
  )
}

export function subtitleClassName(prefs: SubtitlePrefs, latin = false): string {
  const sizeMap = {
    S: 'text-[13px] sm:text-sm',
    M: 'text-[15px] sm:text-base',
    L: 'text-[17px] sm:text-lg',
    XL: 'text-[19px] sm:text-xl',
  }
  const posMap = {
    bottom: 'bottom-[5.75rem] sm:bottom-[6.5rem]',
    middle: 'top-1/2 -translate-y-1/2',
  }
  return cn(
    sizeMap[prefs.size],
    posMap[prefs.position],
    'pointer-events-none absolute inset-x-0 z-[18] mx-auto max-w-[min(92%,40rem)] px-4 text-center font-medium leading-7 text-white',
    latin && 'font-en tracking-wide',
  )
}

export function subtitleStyle(prefs: SubtitlePrefs): React.CSSProperties {
  return {
    backgroundColor: prefs.opacity > 4 ? `rgba(0,0,0,${prefs.opacity / 100})` : 'transparent',
    textShadow:
      prefs.style === 'outline'
        ? '0 1px 2px rgba(0,0,0,0.85), 0 0 10px rgba(0,0,0,0.65)'
        : '0 1px 3px rgba(0,0,0,0.55)',
    borderRadius: 10,
    padding: prefs.opacity > 4 ? '0.35rem 0.7rem' : 0,
  }
}
