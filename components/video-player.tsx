'use client'

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Gauge,
  PictureInPicture2,
  Film,
  Settings2,
  Captions,
  Subtitles,
} from 'lucide-react'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'
import { cn } from '@/lib/utils'
import { updateContinueWatching, hasPremiumAccess } from '@/lib/user-store'
import { getSampleCue, DEMO_CLOCK_DURATION } from '@/lib/player-cues'
import { loadPlayerPrefs, savePlayerPrefs, type PlayerPrefs } from '@/lib/player-prefs'
import { subtitleClassName, subtitleStyle } from '@/components/subtitle-settings'
import { TitleText } from '@/components/title-text'
import {
  PlayerSettingsSheet,
  type SettingsView,
} from '@/components/player-settings-sheet'

const speedMap: Record<string, number> = {
  '۰.۵×': 0.5,
  '۰.۷۵×': 0.75,
  '۱×': 1,
  '۱.۲۵×': 1.25,
  '۱.۵×': 1.5,
  '۲×': 2,
}

const SKIP_SEC = 10

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
  compact?: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)
  const hasRealVideo = Boolean(playbackUrl)
  const reduceMotion = useReducedMotion()

  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(movie.progress ?? 0)
  const [durationSec, setDurationSec] = useState(0)
  const [bufferedPct, setBufferedPct] = useState(0)
  const [volume, setVolume] = useState(80)
  const [muted, setMuted] = useState(false)
  const [prefs, setPrefs] = useState<PlayerPrefs>(() => loadPlayerPrefs())
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsView, setSettingsView] = useState<SettingsView>('root')
  const [showControls, setShowControls] = useState(true)
  const [buffering, setBuffering] = useState(false)
  const [error, setError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [pipSupported, setPipSupported] = useState(false)
  const [inPip, setInPip] = useState(false)
  const [showNextUp, setShowNextUp] = useState(false)
  const [autoPlayCountdown, setAutoPlayCountdown] = useState<number | null>(null)
  const [hoverPos, setHoverPos] = useState<number | null>(null)
  const [previewReady, setPreviewReady] = useState(false)
  const [idleHint, setIdleHint] = useState(false)
  const [skipFlash, setSkipFlash] = useState<'back' | 'fwd' | null>(null)
  const [skipRipple, setSkipRipple] = useState<{ side: 'back' | 'fwd'; key: number } | null>(null)
  const [qualityToast, setQualityToast] = useState<string | null>(null)
  const [premium, setPremium] = useState(false)
  const [demoElapsed, setDemoElapsed] = useState(0)
  const [cueNow, setCueNow] = useState<string | null>(null)

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipFlashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const qualityTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTap = useRef<{ at: number; x: number } | null>(null)
  const durationRef = useRef(durationSec)
  const prefsRef = useRef(prefs)

  durationRef.current = durationSec
  prefsRef.current = prefs

  const persist = useCallback((next: PlayerPrefs) => {
    setPrefs(next)
    savePlayerPrefs(next)
  }, [])

  const clockSeconds = useCallback(() => {
    if (hasRealVideo && videoRef.current?.duration) return videoRef.current.currentTime
    return demoElapsed
  }, [hasRealVideo, demoElapsed])

  const refreshCue = useCallback(() => {
    setCueNow(getSampleCue(clockSeconds(), prefsRef.current.subtitle))
  }, [clockSeconds])

  useEffect(() => {
    setPremium(hasPremiumAccess())
    setPrefs(loadPlayerPrefs())
  }, [])

  useEffect(() => {
    refreshCue()
  }, [prefs.subtitle, demoElapsed, progress, refreshCue])

  useEffect(() => {
    if (hasRealVideo) return
    if (!playing) return
    const id = window.setInterval(() => {
      setDemoElapsed((s) => {
        const rate = speedMap[prefsRef.current.speed] ?? 1
        return (s + 0.25 * rate) % DEMO_CLOCK_DURATION
      })
    }, 250)
    return () => window.clearInterval(id)
  }, [hasRealVideo, playing])

  const pctFromVideo = useCallback((video: HTMLVideoElement) => {
    if (!video.duration || !Number.isFinite(video.duration)) return 0
    return (video.currentTime / video.duration) * 100
  }, [])

  const seekToPct = useCallback(
    (val: number) => {
      const clamped = Math.max(0, Math.min(100, val))
      setProgress(clamped)
      setShowNextUp(clamped >= 98)
      if (hasRealVideo && videoRef.current?.duration) {
        videoRef.current.currentTime = (clamped / 100) * videoRef.current.duration
      } else {
        setDemoElapsed((clamped / 100) * DEMO_CLOCK_DURATION)
      }
    },
    [hasRealVideo],
  )

  const seekBySeconds = useCallback(
    (delta: number) => {
      setSkipFlash(delta < 0 ? 'back' : 'fwd')
      setSkipRipple({ side: delta < 0 ? 'back' : 'fwd', key: Date.now() })
      if (skipFlashTimer.current) clearTimeout(skipFlashTimer.current)
      skipFlashTimer.current = setTimeout(() => {
        setSkipFlash(null)
        setSkipRipple(null)
      }, 620)

      if (hasRealVideo && videoRef.current) {
        const video = videoRef.current
        const dur = video.duration
        if (!dur || !Number.isFinite(dur)) return
        const next = Math.max(0, Math.min(dur, video.currentTime + delta))
        video.currentTime = next
        setProgress((next / dur) * 100)
        return
      }
      setDemoElapsed((s) => Math.max(0, Math.min(DEMO_CLOCK_DURATION, s + delta)))
      setProgress((p) => Math.max(0, Math.min(100, p + (delta / DEMO_CLOCK_DURATION) * 100)))
    },
    [hasRealVideo],
  )

  useEffect(() => {
    setPipSupported(
      typeof document !== 'undefined' &&
        'pictureInPictureEnabled' in document &&
        Boolean(document.pictureInPictureEnabled),
    )
  }, [])

  useEffect(() => {
    if (!hasRealVideo) return
    updateContinueWatching(movie.id, progress, {
      seasonId,
      episodeId,
      seconds: durationSec > 0 ? (progress / 100) * durationSec : undefined,
    })
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

  useEffect(() => {
    if (hasRealVideo) return
    setError(false)
  }, [hasRealVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasRealVideo) return

    const syncBuffer = () => {
      try {
        if (video.buffered.length && video.duration) {
          const end = video.buffered.end(video.buffered.length - 1)
          setBufferedPct((end / video.duration) * 100)
        }
      } catch {
        /* ignore */
      }
    }

    const onLoaded = () => {
      setDurationSec(video.duration)
      setBuffering(false)
      setError(false)
      if (resumeSeconds && resumeSeconds > 0 && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(resumeSeconds, video.duration * 0.95)
      } else if (movie.progress && movie.progress > 0 && video.duration) {
        video.currentTime = (movie.progress / 100) * video.duration
      }
      syncBuffer()
    }
    const onTimeUpdate = () => {
      const pct = pctFromVideo(video)
      setProgress(pct)
      if (pct >= 98) setShowNextUp(true)
      syncBuffer()
    }
    const onWaiting = () => setBuffering(true)
    const onPlaying = () => {
      setBuffering(false)
      setPlaying(true)
    }
    const onPause = () => setPlaying(false)
    const onError = () => {
      setError(true)
      setBuffering(false)
      setPlaying(false)
    }
    const onEnded = () => {
      setPlaying(false)
      setShowNextUp(true)
    }

    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('progress', syncBuffer)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('pause', onPause)
    video.addEventListener('error', onError)
    video.addEventListener('ended', onEnded)

    video.volume = volume / 100
    video.muted = muted
    video.playbackRate = speedMap[prefs.speed] ?? 1

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('progress', syncBuffer)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('error', onError)
      video.removeEventListener('ended', onEnded)
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
    video.playbackRate = speedMap[prefs.speed] ?? 1
  }, [prefs.speed, hasRealVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasRealVideo) return
    if (playing) void video.play().catch(() => setPlaying(false))
    else video.pause()
  }, [playing, hasRealVideo])

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const onEnter = () => setInPip(true)
    const onLeave = () => setInPip(false)
    document.addEventListener('enterpictureinpicture', onEnter)
    document.addEventListener('leavepictureinpicture', onLeave)
    return () => {
      document.removeEventListener('enterpictureinpicture', onEnter)
      document.removeEventListener('leavepictureinpicture', onLeave)
    }
  }, [])

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      if (playing && !settingsOpen && !error) setShowControls(false)
    }, 2800)
  }, [playing, settingsOpen, error])

  useEffect(() => {
    resetHideTimer()
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [resetHideTimer])

  const toggleFullscreen = useCallback(() => {
    const el = sectionRef.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void el.requestFullscreen?.()
  }, [])

  const togglePip = useCallback(async () => {
    const video = videoRef.current
    if (!video || !pipSupported) return
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await video.requestPictureInPicture()
      }
    } catch {
      /* unsupported / denied */
    }
  }, [pipSupported])

  const togglePlay = useCallback(() => {
    if (!hasRealVideo) {
      setPlaying((p) => {
        const next = !p
        if (!next) setIdleHint(true)
        return next
      })
      resetHideTimer()
      return
    }
    setPlaying((p) => !p)
    resetHideTimer()
  }, [hasRealVideo, resetHideTimer])

  const cycleSubtitle = useCallback(() => {
    const list = ['خاموش', 'فارسی', 'انگلیسی']
    const idx = list.indexOf(prefsRef.current.subtitle)
    const next = list[(idx + 1) % list.length]
    persist({ ...prefsRef.current, subtitle: next })
  }, [persist])

  const openSettings = useCallback((view: SettingsView = 'root') => {
    setSettingsView(view)
    setSettingsOpen(true)
    setShowControls(true)
  }, [])

  const switchQuality = useCallback(
    (next: string) => {
      if (next === prefsRef.current.quality) {
        setSettingsOpen(false)
        return
      }
      setQualityToast(next)
      setBuffering(true)
      if (qualityTimer.current) clearTimeout(qualityTimer.current)
      qualityTimer.current = setTimeout(() => {
        persist({ ...prefsRef.current, quality: next })
        setBuffering(false)
        setQualityToast(null)
        setSettingsOpen(false)
      }, 720)
    },
    [persist],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }
      const k = e.key.toLowerCase()
      if (k === ' ' || k === 'k') {
        e.preventDefault()
        togglePlay()
      } else if (k === 'arrowright' || k === 'l') {
        e.preventDefault()
        seekBySeconds(SKIP_SEC)
      } else if (k === 'arrowleft' || k === 'j') {
        e.preventDefault()
        seekBySeconds(-SKIP_SEC)
      } else if (k === 'arrowup') {
        e.preventDefault()
        setVolume((v) => Math.min(100, v + 10))
        setMuted(false)
      } else if (k === 'arrowdown') {
        e.preventDefault()
        setVolume((v) => Math.max(0, v - 10))
      } else if (k === 'm') {
        e.preventDefault()
        setMuted((m) => !m)
      } else if (k === 'f') {
        e.preventDefault()
        toggleFullscreen()
      } else if (k === 'c') {
        e.preventDefault()
        cycleSubtitle()
      } else if (k === 's') {
        e.preventDefault()
        setSettingsOpen((o) => {
          if (o) return false
          setSettingsView('root')
          return true
        })
      } else if (k === 'escape') {
        setSettingsOpen(false)
        setIdleHint(false)
      }
      resetHideTimer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePlay, seekBySeconds, toggleFullscreen, resetHideTimer, cycleSubtitle])

  const paintPreview = useCallback(async (pct: number) => {
    const src = playbackUrl
    const canvas = previewCanvasRef.current
    if (!src || !canvas || !durationRef.current) return

    let preview = previewVideoRef.current
    if (!preview) {
      preview = document.createElement('video')
      preview.muted = true
      preview.preload = 'auto'
      preview.playsInline = true
      preview.src = src
      previewVideoRef.current = preview
    }

    const seekTime = (pct / 100) * durationRef.current
    try {
      if (preview.readyState < 1) {
        await new Promise<void>((resolve, reject) => {
          const onMeta = () => {
            preview!.removeEventListener('loadedmetadata', onMeta)
            preview!.removeEventListener('error', onErr)
            resolve()
          }
          const onErr = () => {
            preview!.removeEventListener('loadedmetadata', onMeta)
            preview!.removeEventListener('error', onErr)
            reject()
          }
          preview!.addEventListener('loadedmetadata', onMeta)
          preview!.addEventListener('error', onErr)
          preview!.load()
        })
      }
      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          preview!.removeEventListener('seeked', onSeeked)
          resolve()
        }
        preview!.addEventListener('seeked', onSeeked)
        preview!.currentTime = seekTime
      })
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)
      const vw = preview.videoWidth || 16
      const vh = preview.videoHeight || 9
      const scale = Math.min(w / vw, h / vh)
      const dw = vw * scale
      const dh = vh * scale
      ctx.drawImage(preview, (w - dw) / 2, (h - dh) / 2, dw, dh)
      setPreviewReady(true)
    } catch {
      setPreviewReady(false)
    }
  }, [playbackUrl])

  const onScrubberMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = ((rect.right - e.clientX) / rect.width) * 100
    const clamped = Math.max(0, Math.min(100, pct))
    setHoverPos(clamped)
    if (!hasRealVideo) return
    if (previewTimer.current) clearTimeout(previewTimer.current)
    previewTimer.current = setTimeout(() => {
      void paintPreview(clamped)
    }, 80)
  }

  const onStagePointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (error) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const now = Date.now()
    const prev = lastTap.current
    if (prev && now - prev.at < 280) {
      if (tapTimer.current) clearTimeout(tapTimer.current)
      lastTap.current = null
      const side = x < rect.width / 2 ? 'fwd' : 'back'
      seekBySeconds(side === 'fwd' ? SKIP_SEC : -SKIP_SEC)
      return
    }
    lastTap.current = { at: now, x }
    if (tapTimer.current) clearTimeout(tapTimer.current)
    tapTimer.current = setTimeout(() => {
      lastTap.current = null
      togglePlay()
    }, 260)
  }

  const demoDuration = hasRealVideo ? durationSec : DEMO_CLOCK_DURATION
  const displayProgress = hasRealVideo
    ? progress
    : (demoElapsed / DEMO_CLOCK_DURATION) * 100
  const timeLabel = (pct: number) => formatTime(pct, demoDuration, true)
  const currentTimeLabel =
    demoDuration > 0 ? formatClock((displayProgress / 100) * demoDuration) : '−−:−−'
  const remainLabel =
    demoDuration > 0
      ? `−${formatClock(Math.max(0, demoDuration - (displayProgress / 100) * demoDuration))}`
      : '−−:−−'

  const poster = movie.backdrop || movie.poster || '/placeholder.svg'
  const showIdleCover = !hasRealVideo && !playing && !error
  const chromeOn = showControls || settingsOpen || !playing

  return (
    <section
      ref={sectionRef}
      className={cn(
        'nf-player group/player relative isolate overflow-hidden bg-black',
        compact ? 'aspect-video w-full' : 'aspect-video w-full rounded-[18px]',
        isFullscreen && 'rounded-none',
      )}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => {
        if (playing && !settingsOpen) setShowControls(false)
        setHoverPos(null)
      }}
      onTouchStart={resetHideTimer}
      role="region"
      aria-label={`پخش‌کننده ویدیو — ${movie.title}`}
    >
      {hasRealVideo ? (
        <video
          ref={videoRef}
          src={playbackUrl}
          className="absolute inset-0 size-full object-contain bg-black"
          playsInline
          preload="metadata"
          poster={poster}
        />
      ) : (
        <>
          <img src={poster} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.78)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50" />
        </>
      )}

      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300',
          chromeOn ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div className="absolute inset-0 z-10" onPointerUp={onStagePointer} />

      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 px-6 text-center backdrop-blur-sm">
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="nf-player-glass flex max-w-sm flex-col items-center rounded-[22px] px-6 py-8"
          >
            <AlertCircle className="size-10 text-white/70" aria-hidden />
            <p className="mt-4 text-base font-semibold text-white">خطا در پخش</p>
            <p className="mt-1.5 text-sm leading-6 text-white/55">
              بارگذاری جریان ویدیو با مشکل مواجه شد. اتصال را بررسی کنید و دوباره تلاش کنید.
            </p>
            <button
              type="button"
              onClick={() => {
                setError(false)
                setBuffering(true)
                const v = videoRef.current
                if (v) {
                  v.load()
                  setPlaying(true)
                }
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-[#0b120e] transition-colors hover:bg-[var(--brand-600)] hover:text-white"
            >
              <RefreshCw className="size-4" />
              تلاش مجدد
            </button>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {buffering && !error ? (
          <motion.div
            key="buf"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 grid place-items-center"
            aria-live="polite"
            aria-label="در حال بارگذاری"
          >
            <div className="relative size-14">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--brand)] anim-buffer-ring" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {qualityToast ? (
          <motion.p
            key={qualityToast}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="nf-player-glass pointer-events-none absolute left-1/2 top-1/3 z-[25] -translate-x-1/2 rounded-full px-4 py-2 text-[13px] font-semibold text-white"
          >
            در حال سوییچ به {qualityToast}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {skipFlash ? (
          <motion.div
            key={`skip-${skipFlash}`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
          >
            <div className="nf-player-glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white">
              {skipFlash === 'back' ? (
                <>
                  <RotateCcw className="size-4" />
                  <span dir="ltr">−{fa(SKIP_SEC)}ث</span>
                </>
              ) : (
                <>
                  <RotateCw className="size-4" />
                  <span dir="ltr">+{fa(SKIP_SEC)}ث</span>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {skipRipple ? (
        <span
          key={skipRipple.key}
          className={cn(
            'nf-skip-ripple pointer-events-none absolute top-1/2 z-20 size-28 -translate-y-1/2 rounded-full',
            skipRipple.side === 'fwd' ? 'right-6' : 'left-6',
          )}
        />
      ) : null}

      <AnimatePresence mode="wait">
        {cueNow && !showIdleCover ? (
          <motion.p
            key={cueNow}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.28 }}
            className={subtitleClassName(
              prefs.caption,
              prefs.subtitle === 'انگلیسی' || prefs.subtitle === 'اسپانیایی',
            )}
            style={subtitleStyle(prefs.caption)}
            dir={prefs.subtitle === 'انگلیسی' || prefs.subtitle === 'اسپانیایی' ? 'ltr' : 'rtl'}
          >
            {cueNow}
          </motion.p>
        ) : null}
      </AnimatePresence>

      {showIdleCover ? (
        <div className="absolute inset-0 z-[15] flex flex-col items-center justify-center px-5 text-center">
          <motion.button
            type="button"
            onClick={togglePlay}
            initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="group/idle relative grid size-[4.5rem] place-items-center rounded-full bg-white text-black shadow-[0_16px_50px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:size-20"
            aria-label="شروع پیش‌نمایش"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-white/25 opacity-40 [animation-duration:2.4s]" />
            <Play className="relative ms-1 size-8 fill-current sm:size-9" />
          </motion.button>
          <p className="font-en mt-5 text-end text-lg font-bold text-white sm:text-xl" dir="ltr">
            {movie.titleEn || movie.title}
          </p>
          <p className="mt-2 max-w-md text-[13px] leading-6 text-white/60 sm:text-sm">
            پخش کامل این عنوان هنوز در دمو فعال نیست. زیرنویس و کیفیت را همین‌جا امتحان کنید.
          </p>
          {idleHint ? (
            <p
              className="nf-player-glass mt-4 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] text-white/80"
              role="status"
            >
              <Film className="size-3.5 text-[var(--brand)]" />
              جریان کامل به‌زودی اضافه می‌شود
            </p>
          ) : null}
        </div>
      ) : null}

      {!compact ? (
        <motion.div
          animate={{ opacity: chromeOn ? 1 : 0, y: chromeOn ? 0 : -8 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.28 }}
          className={cn(
            'absolute inset-x-0 top-0 z-20 flex items-center gap-2 p-3 sm:p-4',
            !chromeOn && 'pointer-events-none',
          )}
        >
          <div className="nf-player-glass flex w-full items-center gap-2 rounded-2xl px-2 py-1.5">
            <Link
              href={movie.type === 'Series' ? `/series/${movie.id}` : `/movie/${movie.id}`}
              className="grid size-10 place-items-center rounded-xl text-white/90 transition-colors hover:bg-white/10"
              aria-label="بازگشت"
            >
              <ChevronRight className="size-5" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="font-en truncate text-end text-sm font-semibold text-white sm:text-base" dir="ltr">
                {movie.titleEn || movie.title}
              </h1>
            </div>
          </div>
        </motion.div>
      ) : null}

      <AnimatePresence>
        {hasRealVideo && !playing && !buffering && !error ? (
          <motion.div
            key="center-play"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="pointer-events-none absolute inset-0 z-[12] grid place-items-center"
          >
            <span className="grid size-16 place-items-center rounded-full bg-white/95 text-black shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:size-[4.25rem]">
              <Play className="ms-1 size-7 fill-current sm:size-8" />
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showNextUp && nextEpisode && !error ? (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="nf-player-glass absolute bottom-28 right-3 z-20 w-[min(100%-1.5rem,18rem)] overflow-hidden rounded-2xl sm:bottom-32 sm:right-5"
          >
            <div className="relative h-20">
              <img src={poster} alt="" className="size-full object-cover opacity-55" />
              <p className="absolute bottom-2 right-3 text-xs font-medium text-white/85">قسمت بعدی</p>
            </div>
            <div className="p-3">
            <p className="truncate text-sm font-semibold text-white">
              <TitleText className="block truncate text-end">{nextEpisode.title}</TitleText>
            </p>
              {autoPlayCountdown !== null && (
                <p className="mt-1 text-xs text-white/50">پخش خودکار در {fa(autoPlayCountdown)} ثانیه</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={nextEpisode.href}
                  className="flex-1 rounded-full bg-[var(--brand)] py-2 text-center text-xs font-bold text-[#0b120e]"
                >
                  پخش بعدی
                </Link>
                <button
                  type="button"
                  onClick={() => setShowNextUp(false)}
                  className="rounded-full px-3 py-2 text-xs text-white/70 ring-1 ring-white/15 hover:bg-white/10"
                >
                  بستن
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <PlayerSettingsSheet
        open={settingsOpen}
        view={settingsView}
        onView={setSettingsView}
        onClose={() => setSettingsOpen(false)}
        quality={prefs.quality}
        subtitle={prefs.subtitle}
        audio={prefs.audio}
        speed={prefs.speed}
        caption={prefs.caption}
        premium={premium}
        onQuality={switchQuality}
        onSubtitle={(v) => persist({ ...prefs, subtitle: v })}
        onAudio={(v) => persist({ ...prefs, audio: v })}
        onSpeed={(v) => persist({ ...prefs, speed: v })}
        onCaption={(v) => persist({ ...prefs, caption: v })}
      />

      <motion.div
        animate={{ opacity: chromeOn ? 1 : 0, y: chromeOn ? 0 : 12 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.3 }}
        className={cn(
          'absolute inset-x-0 bottom-0 z-20 px-2.5 pb-2.5 pt-20 sm:px-4 sm:pb-4',
          !chromeOn && 'pointer-events-none',
        )}
      >
        <div className="nf-player-glass rounded-2xl px-2.5 py-2.5 sm:px-3.5 sm:py-3">
          <div className="group/seek px-1 pt-0.5 sm:px-1.5">
            <div className="flex items-center gap-2.5 text-[11px] tabular-nums text-white/65">
              <span dir="ltr" data-en="true" className="font-en min-w-[2.75rem] shrink-0 text-start tracking-wide">
                {currentTimeLabel}
              </span>
              <div
                className="player-scrubber relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/15 touch-none"
                onPointerMove={onScrubberMove}
                onPointerLeave={() => {
                  setHoverPos(null)
                  setPreviewReady(false)
                }}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId)
                  const rect = e.currentTarget.getBoundingClientRect()
                  const pct = Math.max(0, Math.min(100, ((rect.right - e.clientX) / rect.width) * 100))
                  setHoverPos(pct)
                  seekToPct(pct)
                  if (hasRealVideo) void paintPreview(pct)
                }}
              >
                <div
                  className={cn(
                    'pointer-events-none absolute bottom-[calc(100%+10px)] z-10 flex -translate-x-1/2 flex-col overflow-hidden rounded-lg bg-black/90 shadow-lg ring-1 ring-white/15 transition-opacity',
                    hoverPos !== null && hasRealVideo ? 'opacity-100' : 'pointer-events-none opacity-0',
                  )}
                  style={hoverPos !== null ? { right: `${hoverPos}%` } : { right: '50%' }}
                >
                  <canvas
                    ref={previewCanvasRef}
                    width={160}
                    height={90}
                    className={cn(
                      'block h-[4.5rem] w-28 sm:h-[5.25rem] sm:w-36',
                      previewReady ? 'bg-black' : 'bg-[#141414]',
                    )}
                    aria-hidden
                  />
                  <p className="font-en border-t border-white/10 py-1 text-center text-[10px] tracking-wide text-white/80" dir="ltr" data-en="true">
                    {hoverPos !== null ? timeLabel(hoverPos) : '−−:−−'}
                  </p>
                </div>
                <div
                  className="absolute inset-y-0 right-0 rounded-full bg-white/20"
                  style={{ width: `${Math.min(100, hasRealVideo ? bufferedPct : displayProgress)}%` }}
                />
                <div
                  className="absolute inset-y-0 right-0 rounded-full bg-[var(--brand)]"
                  style={{ width: `${displayProgress}%` }}
                />
                <div
                  className="absolute top-1/2 size-3.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-white opacity-0 shadow-[0_0_0_3px_rgba(var(--brand-rgb),0.35)] transition-opacity group-hover/seek:opacity-100"
                  style={{ right: `${displayProgress}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={displayProgress}
                  onChange={(e) => seekToPct(Number(e.target.value))}
                  aria-label="جلو و عقب بردن ویدیو"
                  className="player-range absolute inset-0 h-full w-full opacity-0"
                />
              </div>
              <span dir="ltr" data-en="true" className="font-en min-w-[2.75rem] shrink-0 text-end tracking-wide">
                {remainLabel}
              </span>
            </div>
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-1 sm:mt-2">
            <div className="flex items-center">
              <PlayerBtn label={`عقب ${fa(SKIP_SEC)} ثانیه`} onClick={() => seekBySeconds(-SKIP_SEC)}>
                <RotateCcw className="size-[1.15rem]" />
              </PlayerBtn>
              <PlayerBtn label={playing ? 'توقف' : 'پخش'} onClick={togglePlay} className="size-11">
                {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
              </PlayerBtn>
              <PlayerBtn label={`جلو ${fa(SKIP_SEC)} ثانیه`} onClick={() => seekBySeconds(SKIP_SEC)}>
                <RotateCw className="size-[1.15rem]" />
              </PlayerBtn>

              <div className="group/vol flex items-center">
                <PlayerBtn
                  label={muted || volume === 0 ? 'باصدا کردن' : 'بی‌صدا کردن'}
                  onClick={() => setMuted((m) => !m)}
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="size-[1.15rem]" />
                  ) : (
                    <Volume2 className="size-[1.15rem]" />
                  )}
                </PlayerBtn>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value))
                    setMuted(false)
                  }}
                  aria-label="میزان صدا"
                  className="player-range hidden h-1 w-0 overflow-hidden rounded-full bg-white/20 opacity-0 transition-all duration-200 group-hover/vol:w-20 group-hover/vol:opacity-100 group-focus-within/vol:w-20 group-focus-within/vol:opacity-100 sm:block"
                  style={{
                    background: `linear-gradient(to left, var(--brand) ${muted ? 0 : volume}%, rgba(255,255,255,0.2) ${muted ? 0 : volume}%)`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center">
              <PlayerBtn
                label="زیرنویس"
                active={prefs.subtitle !== 'خاموش'}
                onClick={() => openSettings('subtitle')}
              >
                {prefs.subtitle === 'خاموش' ? (
                  <Captions className="size-[1.15rem]" />
                ) : (
                  <Subtitles className="size-[1.15rem]" />
                )}
              </PlayerBtn>
              <PlayerBtn
                label="سرعت پخش"
                active={prefs.speed !== '۱×'}
                onClick={() => openSettings('speed')}
              >
                <span className="font-en text-[11px] font-bold tabular-nums tracking-wide" dir="ltr" data-en="true">
                  {prefs.speed === '۱×' ? <Gauge className="size-[1.15rem]" /> : prefs.speed}
                </span>
              </PlayerBtn>
              <PlayerBtn
                label="تنظیمات پخش"
                active={settingsOpen}
                onClick={() => (settingsOpen ? setSettingsOpen(false) : openSettings('root'))}
              >
                <Settings2 className="size-[1.15rem]" />
              </PlayerBtn>
              {pipSupported && hasRealVideo ? (
                <PlayerBtn
                  label={inPip ? 'خروج از تصویر در تصویر' : 'تصویر در تصویر'}
                  active={inPip}
                  onClick={() => void togglePip()}
                >
                  <PictureInPicture2 className="size-[1.15rem]" />
                </PlayerBtn>
              ) : null}
              <PlayerBtn
                label={isFullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize className="size-[1.15rem]" /> : <Maximize className="size-[1.15rem]" />}
              </PlayerBtn>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function PlayerBtn({
  children,
  label,
  onClick,
  active,
  disabled,
  className,
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'grid size-10 place-items-center rounded-xl text-white/90 transition-colors',
        'hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60',
        'disabled:pointer-events-none disabled:opacity-35',
        active && 'bg-white/10 text-[var(--brand)]',
        className,
      )}
    >
      {children}
    </button>
  )
}

function formatClock(totalSec: number) {
  const cur = Math.max(0, Math.round(totalSec))
  const h = Math.floor(cur / 3600)
  const m = Math.floor((cur % 3600) / 60)
  const s = cur % 60
  if (h > 0) {
    return `${fa(h)}:${fa(m.toString().padStart(2, '0'))}:${fa(s.toString().padStart(2, '0'))}`
  }
  return `${fa(m)}:${fa(s.toString().padStart(2, '0'))}`
}

function formatTime(progressPct: number, durationSec: number, real: boolean) {
  if (!real || !durationSec || !Number.isFinite(durationSec)) return '−−:−−'
  return formatClock((progressPct / 100) * durationSec)
}
