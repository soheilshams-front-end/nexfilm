'use client'

import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, ChevronLeft, Lock, X } from 'lucide-react'
import {
  playerSettings,
  PREMIUM_QUALITIES,
  PREMIUM_SUBTITLES,
} from '@/lib/movies'
import { cn } from '@/lib/utils'
import { SubtitleSettings, type SubtitlePrefs } from '@/components/subtitle-settings'

export type SettingsView = 'root' | 'quality' | 'subtitle' | 'audio' | 'speed' | 'caption'

const TITLES: Record<SettingsView, string> = {
  root: 'تنظیمات پخش',
  quality: 'کیفیت',
  subtitle: 'زیرنویس',
  audio: 'صدا',
  speed: 'سرعت',
  caption: 'ظاهر زیرنویس',
}

export function PlayerSettingsSheet({
  open,
  view,
  onView,
  onClose,
  quality,
  subtitle,
  audio,
  speed,
  caption,
  premium,
  onQuality,
  onSubtitle,
  onAudio,
  onSpeed,
  onCaption,
}: {
  open: boolean
  view: SettingsView
  onView: (v: SettingsView) => void
  onClose: () => void
  quality: string
  subtitle: string
  audio: string
  speed: string
  caption: SubtitlePrefs
  premium: boolean
  onQuality: (v: string) => void
  onSubtitle: (v: string) => void
  onAudio: (v: string) => void
  onSpeed: (v: string) => void
  onCaption: (v: SubtitlePrefs) => void
}) {
  const reduce = useReducedMotion()

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="sheet"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: reduce ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="nf-player-glass absolute bottom-[5.5rem] left-2 z-30 w-[min(100%-1rem,20.5rem)] overflow-hidden rounded-2xl text-white sm:bottom-32 sm:left-5"
          role="dialog"
          aria-label="تنظیمات پخش"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
            {view !== 'root' ? (
              <button
                type="button"
                onClick={() => onView('root')}
                className="grid size-9 place-items-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="بازگشت"
              >
                <ChevronLeft className="size-4" />
              </button>
            ) : (
              <span className="w-9" />
            )}
            <p className="text-[13px] font-semibold">{TITLES[view]}</p>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-xl text-white/50 hover:bg-white/10 hover:text-white"
              aria-label="بستن"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto p-1.5 sm:max-h-72">
            {view === 'root' ? (
              <div className="space-y-0.5">
                <RootRow label="کیفیت" value={quality} onClick={() => onView('quality')} />
                <RootRow label="زیرنویس" value={subtitle} onClick={() => onView('subtitle')} />
                <RootRow label="صدا" value={audio} onClick={() => onView('audio')} />
                <RootRow label="سرعت" value={speed} onClick={() => onView('speed')} />
                <RootRow
                  label="ظاهر زیرنویس"
                  value={`${caption.size} · ${caption.position === 'bottom' ? 'پایین' : 'وسط'}`}
                  onClick={() => onView('caption')}
                />
              </div>
            ) : null}

            {view === 'quality' ? (
              <OptionList
                options={playerSettings.qualities}
                active={quality}
                locked={!premium ? PREMIUM_QUALITIES : undefined}
                onSelect={onQuality}
              />
            ) : null}
            {view === 'subtitle' ? (
              <OptionList
                options={playerSettings.subtitles}
                active={subtitle}
                locked={!premium ? PREMIUM_SUBTITLES : undefined}
                onSelect={onSubtitle}
              />
            ) : null}
            {view === 'audio' ? (
              <OptionList options={playerSettings.audios} active={audio} onSelect={onAudio} />
            ) : null}
            {view === 'speed' ? (
              <OptionList options={playerSettings.speeds} active={speed} ltr onSelect={onSpeed} />
            ) : null}
            {view === 'caption' ? <SubtitleSettings prefs={caption} onChange={onCaption} /> : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function RootRow({
  label,
  value,
  onClick,
}: {
  label: string
  value: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-[13px] transition-colors hover:bg-white/8"
    >
      <span className="text-white/90">{label}</span>
      <span className="max-w-[9rem] truncate text-[12px] text-white/45">{value}</span>
    </button>
  )
}

function OptionList({
  options,
  active,
  locked,
  ltr,
  onSelect,
}: {
  options: string[]
  active: string
  locked?: Set<string>
  ltr?: boolean
  onSelect: (v: string) => void
}) {
  return (
    <div>
      {options.map((opt) => {
        const isLocked = locked?.has(opt)
        const isActive = active === opt
        if (isLocked) {
          return (
            <Link
              key={opt}
              href="/subscription"
              className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-[13px] text-white/45 transition-colors hover:bg-white/8"
            >
              <span className={cn('inline-flex items-center gap-2', ltr && 'font-en')} dir={ltr ? 'ltr' : undefined}>
                <Lock className="size-3.5" />
                {opt}
              </span>
              <span className="text-[11px] text-[var(--brand)]">پرمیوم</span>
            </Link>
          )
        }
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={cn(
              'flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-[13px] transition-colors hover:bg-white/8',
              isActive && 'text-[var(--brand)]',
            )}
          >
            <span className={ltr ? 'font-en' : undefined} dir={ltr ? 'ltr' : undefined}>
              {opt}
            </span>
            {isActive ? <Check className="size-3.5" /> : null}
          </button>
        )
      })}
    </div>
  )
}
