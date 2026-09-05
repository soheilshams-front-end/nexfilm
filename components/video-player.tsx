'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Play, Pause, SkipForward, Volume2, VolumeX,
  Maximize, Minimize, ChevronRight, RotateCcw,
  AlertCircle, RefreshCw, Gauge, Monitor, X, PictureInPicture2,
} from 'lucide-react'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'
import { playerSettings } from '@/lib/movies'
import { cn } from '@/lib/utils'
import { updateContinueWatching } from '@/lib/user-store'

type Panel = null | 'speed' | 'subtitleSettings'

const speedMap: Record<string, number> = {
  '۰.۵×': 0.5,
  '۰.۷۵×': 0.75,
  '۱×': 1,
  '۱.۲۵×': 1.25,
  '۱.۵×': 1.5,
  '۲×': 2,
}

export function VideoPlayer({
  movie,
  playbackUrl,
  nextEpisode,
  seasonId,
  episodeId,
  resumeSeconds,
  compact = false,
}: {
  movie: Movie
  playbackUrl?: string
  nextEpisode?: { title: string; href: string }
  seasonId?: number
  episodeId?: number
  resumeSeconds?: number
  /** Hide internal top chrome when page already has a cinema header */
  compact?: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasRealVideo = Boolean(playbackUrl)

  const [playing, setPlaying] = useState(Boolean(playbackUrl))
  const [progress, setProgress] = useState(movie.progress ?? 0)
  const [durationSec, setDurationSec] = useState(0)
  const [volume, setVolume] = useState(80)
  const [muted, setMuted] = useState(false)
  const [speed, setSpeed] = useState('۱×')
  const [panel, setPanel] = useState<Panel>(null)
  const [showControls, setShowControls] = useState(true)
  const [buffering, setBuffering] = useState(hasRealVideo)
  const [error, setError] = useState(false)
  const [theater, setTheater] = useState(false)
  const [mini, setMini] = useState(false)
  const [showSkipIntro] = useState(false)
  const [showNextUp, setShowNextUp] = useState(false)
  const [autoPlayCountdown, setAutoPlayCountdown] = useState<number | null>(null)
  const [hoverPos, setHoverPos] = useState<number | null>(null)

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bufferTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pctFromVideo = useCallback((video: HTMLVideoElement) => {
    if (!video.duration || !Number.isFinite(video.duration)) return 0
    return (video.currentTime / video.duration) * 100
  }, [])

  useEffect(() => {
    if (!hasRealVideo) return
    updateContinueWatching(movie.id, progress, {
      seasonId,
      episodeId,
      seconds: durationSec > 0 ? (progress / 100) * durationSec : undefined,
    })
    if (progress >= 92) {
      // completed — history handled inside updateContinueWatching when progress high
    }
  }, [movie.id, Math.floor(progress), seasonId, episodeId, durationSec, hasRealVideo])

  useEffect(() => {
    if (!showNextUp || !nextEpisode || progress < 98) {
      setAutoPlayCountdown(null)
      return
    }
    setAutoPlayCountdown(10)
    const interval = setInterval(() => {
      setAutoPlayCountdown((c) => {
        if (c === null || c <= 1) {
          window.location.href = nextEpisode.href
          return null
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [showNextUp, nextEpisode, progress])

  // No fake progress simulation when there is no real stream
  useEffect(() => {
    if (hasRealVideo) return
    setPlaying(false)
    setBuffering(false)
  }, [hasRealVideo])

  // Real video element wiring
  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasRealVideo) return

    const onLoaded = () => {
      setDurationSec(video.duration)
      setBuffering(false)
      if (resumeSeconds && resumeSeconds > 0 && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(resumeSeconds, video.duration * 0.95)
      } else if (movie.progress && movie.progress > 0 && video.duration) {
        video.currentTime = (movie.progress / 100) * video.duration
      }
      if (playing) void video.play().catch(() => setPlaying(false))
    }
    const onTimeUpdate = () => {
      const pct = pctFromVideo(video)
      setProgress(pct)
      if (pct >= 98) setShowNextUp(true)
    }
    const onWaiting = () => setBuffering(true)
    const onPlaying = () => setBuffering(false)
    const onError = () => {
      setError(true)
      setBuffering(false)
    }

    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)

    video.volume = volume / 100
    video.muted = muted
    video.playbackRate = speedMap[speed] ?? 1

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', onError)
    }
  }, [hasRealVideo, playbackUrl, movie.progress, resumeSeconds, pctFromVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasRealVideo) return
    video.volume = volume / 100
    video.muted = muted
  }, [volume, muted, hasRealVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasRealVideo) return
    video.playbackRate = speedMap[speed] ?? 1
  }, [speed, hasRealVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasRealVideo) return
    if (playing) void video.play().catch(() => setPlaying(false))
    else video.pause()
  }, [playing, hasRealVideo])

  const onSeek = (val: number) => {
    setProgress(val)
    setShowNextUp(val >= 98)

    if (hasRealVideo && videoRef.current?.duration) {
      videoRef.current.currentTime = (val / 100) * videoRef.current.duration
    }
  }

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      if (playing && !panel) setShowControls(false)
    }, 2800)
  }, [playing, panel])

  useEffect(() => {
    resetHideTimer()
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [resetHideTimer])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === ' ' || k === 'k') { e.preventDefault(); setPlaying((p) => !p) }
      else if (k === 'arrowright') onSeek(Math.min(100, progress + 5))
      else if (k === 'arrowleft') onSeek(Math.max(0, progress - 5))
      else if (k === 'arrowup') setVolume((v) => Math.min(100, v + 10))
      else if (k === 'arrowdown') setVolume((v) => Math.max(0, v - 10))
      else if (k === 'm') setMuted((m) => !m)
      else if (k === 'f') {
        const el = sectionRef.current
        if (el && document.fullscreenElement) document.exitFullscreen()
        else if (el?.requestFullscreen) el.requestFullscreen()
      }
      else if (k === 't') setTheater((t) => !t)
      else if (k === 'i') setMini((m) => !m)
      else if (k === 'escape') { setTheater(false); setMini(false); setPanel(null) }
      resetHideTimer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [progress, resetHideTimer])

  const togglePlay = () => { setPlaying((p) => !p); resetHideTimer() }

  const panelData = playerSettings.speeds
  const panelValue = speed
  const setPanelValue = (v: string) => {
    setSpeed(v)
    setPanel(null)
  }
  const panelLabel = 'سرعت'

  const timeLabel = (pct: number) => formatTime(pct, durationSec, hasRealVideo)

  if (mini) {
    return (
      <div className="mini-player overflow-hidden rounded bg-black">
        <div className="relative aspect-video">
          {hasRealVideo ? (
            <video ref={videoRef} src={playbackUrl} className="size-full object-cover" playsInline />
          ) : (
            <img src={movie.backdrop} alt="" className="size-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          <button type="button" onClick={() => setMini(false)} className="absolute left-2 top-2 grid size-8 place-items-center rounded-full bg-black/60 text-white" aria-label="بستن مینی‌پلیر">
            <X className="size-4" />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="truncate text-xs font-medium text-white">{movie.title}</p>
            <div className="mt-1.5 h-0.5 w-full bg-white/20">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button type="button" onClick={togglePlay} className="grid size-7 place-items-center rounded-full bg-primary text-white" aria-label={playing ? 'توقف' : 'پخش'}>
                {playing ? <Pause className="size-3.5 fill-current" /> : <Play className="size-3.5 fill-current" />}
              </button>
              <span className="text-[10px] text-white/60" dir="ltr">{timeLabel(progress)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        'group/player relative overflow-hidden bg-black transition-all duration-300',
        theater ? 'aspect-auto h-[80vh] w-full' : compact ? 'aspect-video w-full' : 'aspect-video w-full rounded',
      )}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && !panel && setShowControls(false)}
      onTouchStart={resetHideTimer}
    >
      {hasRealVideo ? (
        <video
          ref={videoRef}
          src={playbackUrl}
          className="absolute inset-0 size-full object-contain bg-black"
          playsInline
          preload="metadata"
        />
      ) : (
        <>
          <img src={movie.backdrop || '/placeholder.svg'} alt="" className="absolute inset-0 size-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35" />
        </>
      )}

      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 text-center">
          <AlertCircle className="size-10 text-white/70" />
          <p className="mt-3 text-base font-semibold text-white">خطا در پخش</p>
          <p className="mt-1 max-w-xs text-sm text-white/50">مشکلی در بارگذاری ویدیو پیش آمد.</p>
          <button
            type="button"
            onClick={() => {
              setError(false)
              setBuffering(true)
              const v = videoRef.current
              if (v) {
                v.load()
                void v.play().catch(() => setPlaying(false))
              } else {
                setTimeout(() => setBuffering(false), 1000)
              }
            }}
            className="mt-5 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <RefreshCw className="size-4" />
            تلاش مجدد
          </button>
        </div>
      )}

      {buffering && !error && (
        <div className="absolute inset-0 z-20 grid place-items-center">
          <div className="relative size-12">
            <div className="absolute inset-0 rounded-full border-2 border-white/15" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary anim-buffer-ring" />
          </div>
        </div>
      )}

      {!compact ? (
      <div className={cn(
        'absolute inset-x-0 top-0 z-20 flex items-center gap-2 p-3 transition-opacity duration-250 sm:p-4',
        showControls ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}>
        <div className="flex w-full items-center gap-2 rounded-xl bg-[var(--bg-secondary)]/95 px-2 py-1.5 shadow-[inset_0_0_0_1px_var(--border-secondary)]">
        <Link
          href={movie.type === 'Series' ? `/series/${movie.id}` : `/movie/${movie.id}`}
          className="grid size-9 place-items-center rounded-lg text-white/90 transition-colors hover:bg-white/10"
          aria-label="بازگشت"
        >
          <ChevronRight className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-medium text-white sm:text-base">{movie.title}</h1>
        </div>
        <PlayerBtn label="مینی‌پلیر" onClick={() => setMini(true)}>
          <PictureInPicture2 className="size-4" />
        </PlayerBtn>
        <PlayerBtn label={theater ? 'خروج از حالت سینما' : 'حالت سینما'} onClick={() => setTheater((t) => !t)}>
          {theater ? <Minimize className="size-4" /> : <Monitor className="size-4" />}
        </PlayerBtn>
        </div>
      </div>
      ) : null}

      <button
        type="button"
        onClick={togglePlay}
        className="absolute inset-0 z-10 grid place-items-center"
        aria-label={playing ? 'توقف' : 'پخش'}
      >
        <span className={cn(
          'grid size-14 place-items-center rounded-xl bg-[var(--bg-secondary)] text-white shadow-[inset_0_0_0_1px_var(--border-primary)] transition-all duration-200',
          playing ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
        )}>
          <Play className="size-7 fill-current" />
        </span>
      </button>

      {false && !buffering && !error && (
        <p className="absolute bottom-28 left-1/2 z-10 -translate-x-1/2 text-sm text-white">
          نمونه زیرنویس
        </p>
      )}

      {false && showSkipIntro && !buffering && !error && (
        <button
          type="button"
          onClick={() => onSeek(16)}
          className="absolute bottom-28 left-4 z-20 rounded border border-white/25 bg-black/70 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15 sm:bottom-32 sm:left-6"
        >
          رد کردن تیتراژ
        </button>
      )}

      {showNextUp && nextEpisode && !error && (
        <div className="absolute bottom-28 left-4 z-20 w-64 overflow-hidden rounded bg-black/85 sm:bottom-32 sm:left-6 sm:w-72">
          <div className="relative h-20">
            <img src={movie.backdrop} alt="" className="size-full object-cover opacity-60" />
            <p className="absolute bottom-2 right-3 text-xs text-white/80">قسمت بعدی</p>
          </div>
          <div className="p-3">
            <p className="truncate text-sm font-medium text-white">{nextEpisode.title}</p>
            {autoPlayCountdown !== null && (
              <p className="mt-1 text-xs text-white/50">پخش خودکار در {fa(autoPlayCountdown)} ثانیه</p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <Link href={nextEpisode.href} className="flex-1 rounded bg-primary py-2 text-center text-xs font-semibold text-white">
                پخش بعدی
              </Link>
              <button type="button" onClick={() => setShowNextUp(false)} className="rounded border border-white/20 px-3 py-2 text-xs text-white/70 hover:bg-white/10">
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {panel && (
        <div className="absolute bottom-24 left-3 z-30 w-52 overflow-hidden rounded-xl bg-[var(--bg-secondary)] text-white shadow-[inset_0_0_0_1px_var(--border-secondary)] sm:bottom-28 sm:left-4 sm:w-56">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <p className="text-xs text-white/50">{panelLabel}</p>
            <button type="button" onClick={() => setPanel(null)} className="text-white/50 hover:text-white"><X className="size-3.5" /></button>
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {panelData.map((opt) => {
              const active = panelValue === opt
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPanelValue(opt)}
                  className={cn(
                    'flex w-full items-center justify-between rounded px-3 py-2 text-sm transition-colors hover:bg-white/8',
                    active && 'text-primary',
                  )}
                >
                  <span>{opt}</span>
                  {active && <span className="size-1.5 rounded-full bg-primary" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className={cn(
        'absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/40 to-transparent px-3 pb-3 pt-16 transition-opacity duration-250 sm:px-4',
        showControls ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}>
        <div className="group/seek px-3 pt-2 sm:px-4">
          <div className="flex items-center gap-2.5 text-[11px] text-white/65">
            <span dir="ltr">{timeLabel(progress)}</span>
            <div
              className="player-scrubber relative h-1 flex-1 cursor-pointer rounded-full bg-white/20"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const pct = ((rect.right - e.clientX) / rect.width) * 100
                setHoverPos(Math.max(0, Math.min(100, pct)))
              }}
              onMouseLeave={() => setHoverPos(null)}
            >
              {hoverPos !== null && (
                <div className="absolute -top-8 z-10 -translate-x-1/2 rounded bg-black/85 px-1.5 py-0.5 text-[10px] text-white" style={{ right: `${hoverPos}%` }}>
                  {timeLabel(hoverPos)}
                </div>
              )}
              <div className="absolute inset-y-0 right-0 rounded-full bg-white/20" style={{ width: `${Math.min(100, progress + 8)}%` }} />
              <div className="absolute inset-y-0 right-0 rounded-full bg-primary" style={{ width: `${progress}%` }} />
              <div
                className="absolute top-1/2 size-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary opacity-0 transition-opacity group-hover/seek:opacity-100"
                style={{ right: `${progress}%` }}
              />
              <input
                type="range" min={0} max={100} value={progress}
                onChange={(e) => onSeek(Number(e.target.value))}
                aria-label="جلو/عقب‌بردن"
                className="player-range absolute inset-0 w-full"
              />
            </div>
            <span dir="ltr">-{timeLabel(100 - progress)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 pb-3 pt-1.5 sm:px-3">
          <div className="flex items-center">
            <PlayerBtn label="عقب" onClick={() => onSeek(Math.max(0, progress - 5))}>
              <RotateCcw className="size-[1.1rem]" />
            </PlayerBtn>
            <PlayerBtn label={playing ? 'توقف' : 'پخش'} onClick={togglePlay}>
              {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
            </PlayerBtn>
            <PlayerBtn label="جلو" onClick={() => onSeek(Math.min(100, progress + 5))}>
              <SkipForward className="size-[1.1rem]" />
            </PlayerBtn>
            <div className="group/vol flex items-center">
              <PlayerBtn label="بی‌صدا" onClick={() => setMuted((m) => !m)}>
                {muted || volume === 0 ? <VolumeX className="size-[1.1rem]" /> : <Volume2 className="size-[1.1rem]" />}
              </PlayerBtn>
              <input
                type="range" min={0} max={100} value={muted ? 0 : volume}
                onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false) }}
                aria-label="صدا"
                className="player-range hidden h-1 w-0 overflow-hidden rounded-full bg-white/20 opacity-0 transition-all duration-200 group-hover/vol:w-16 group-hover/vol:opacity-100 sm:block"
                style={{ background: `linear-gradient(to left, var(--primary) ${muted ? 0 : volume}%, rgba(255,255,255,0.2) ${muted ? 0 : volume}%)` }}
              />
            </div>
          </div>

          <div className="flex items-center">
            <PlayerBtn label="سرعت" active={panel === 'speed'} onClick={() => setPanel((p) => (p === 'speed' ? null : 'speed'))}>
              <Gauge className="size-[1.1rem]" />
            </PlayerBtn>
            <PlayerBtn label="تمام‌صفحه" onClick={() => {
              const el = sectionRef.current
              if (el && document.fullscreenElement) document.exitFullscreen()
              else if (el?.requestFullscreen) el.requestFullscreen()
            }}>
              <Maximize className="size-[1.1rem]" />
            </PlayerBtn>
          </div>
        </div>
      </div>
    </section>
  )
}

function PlayerBtn({
  children, label, onClick, active,
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'grid size-9 place-items-center rounded-lg text-white/85 transition-colors hover:bg-white/10',
        active && 'text-primary',
      )}
    >
      {children}
    </button>
  )
}

function formatTime(progressPct: number, durationSec: number, real: boolean) {
  const totalSec = real && durationSec > 0 ? durationSec : 138 * 60
  const cur = Math.round((progressPct / 100) * totalSec)
  const h = Math.floor(cur / 3600)
  const m = Math.floor((cur % 3600) / 60)
  const s = cur % 60
  if (h > 0) {
    return `${fa(h)}:${fa(m.toString().padStart(2, '0'))}:${fa(s.toString().padStart(2, '0'))}`
  }
  return `${fa(m)}:${fa(s.toString().padStart(2, '0'))}`
}
