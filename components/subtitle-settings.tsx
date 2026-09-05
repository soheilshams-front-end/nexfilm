'use client'

export type SubtitlePrefs = {
  size: 'S' | 'M' | 'L' | 'XL'
  style: 'default' | 'outline'
  opacity: number
  position: 'bottom' | 'middle'
}

export function SubtitleSettings({
  prefs,
  onChange,
}: {
  prefs: SubtitlePrefs
  onChange: (p: SubtitlePrefs) => void
}) {
  const sizes: SubtitlePrefs['size'][] = ['S', 'M', 'L', 'XL']

  return (
    <div className="space-y-4 p-3 text-sm text-white">
      <div>
        <p className="mb-2 text-xs font-semibold text-white/60">اندازه فونت</p>
        <div className="flex gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...prefs, size: s })}
              className={`rounded px-3 py-1.5 ${prefs.size === s ? 'bg-primary text-white' : 'bg-white/10'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-white/60">موقعیت</p>
        <div className="flex gap-2">
          {(['bottom', 'middle'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => onChange({ ...prefs, position: pos })}
              className={`rounded px-3 py-1.5 ${prefs.position === pos ? 'bg-primary text-white' : 'bg-white/10'}`}
            >
              {pos === 'bottom' ? 'پایین' : 'وسط'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-white/60">شفافیت پس‌زمینه</p>
        <input
          type="range"
          min={0}
          max={100}
          value={prefs.opacity}
          onChange={(e) => onChange({ ...prefs, opacity: Number(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  )
}

export function subtitleClassName(prefs: SubtitlePrefs): string {
  const sizeMap = { S: 'text-sm', M: 'text-base', L: 'text-lg', XL: 'text-xl' }
  const posMap = { bottom: 'bottom-24', middle: 'bottom-1/2' }
  return `${sizeMap[prefs.size]} ${posMap[prefs.position]} absolute inset-x-0 mx-auto max-w-3xl px-4 text-center font-medium text-white`
}

export function subtitleStyle(prefs: SubtitlePrefs): React.CSSProperties {
  return {
    backgroundColor: `rgba(0,0,0,${prefs.opacity / 100})`,
    textShadow: prefs.style === 'outline' ? '0 0 4px #000, 0 0 4px #000' : undefined,
  }
}
