'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Play, Plus, Check, Star, Volume2, VolumeX } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { SaintstreamTitle } from '@/lib/saintstream-home'
import { fa } from '@/lib/format-fa'
import { isInMyList, toggleMyList } from '@/lib/user-store'
import { useToast } from '@/components/toast-provider'
import { Button } from '@/components/untitled/button'
import { Badge } from '@/components/untitled/badge'

const INTERVAL = 4500
const SLIDE_EASE = [0.25, 0.1, 0.25, 1] as const

export function HeroCarousel({
  slides,
  index: controlledIndex,
  onIndexChange,
}: {
  slides: SaintstreamTitle[]
  index?: number
  onIndexChange?: (index: number) => void
}) {
  const [internalIndex, setInternalIndex] = useState(0)
  const index = controlledIndex ?? internalIndex
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  const [inList, setInList] = useState(false)
  const toast = useToast()
  const reduceMotion = useReducedMotion()
  const movie = slides[index] ?? slides[0]

  const goTo = useCallback(
    (next: number) => {
      const wrapped = ((next % slides.length) + slides.length) % slides.length
      if (onIndexChange) onIndexChange(wrapped)
      else setInternalIndex(wrapped)
    },
    [onIndexChange, slides.length],
  )

  useEffect(() => {
    if (!movie) return
    setInList(isInMyList(movie.id))
  }, [movie])

  const next = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [paused, next, slides.length])

  if (!movie) return null

  const watchHref = `/watch/${movie.id}`
  const backdrop = movie.backdrop || movie.poster || '/placeholder.svg'

  return (
    <section
      className="relative h-[min(100dvh,780px)] min-h-[520px] max-h-[1100px] w-full overflow-hidden bg-transparent md:h-[100dvh] md:min-h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`bg-${index}`}
          className="hero-media-mask absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.7, ease: SLIDE_EASE }}
        >
          <img
            src={backdrop}
            alt=""
            className="size-full object-cover object-[center_18%] scale-[1.03]"
          />
          <div className="hero-readability absolute inset-0" />
        </motion.div>
      </AnimatePresence>

      <div className="page-max page-pad relative z-10 flex h-full flex-col justify-end pb-[calc(var(--tabbar-h)+2.5rem)] pt-28 sm:pt-36 md:pb-28 md:pt-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            className="min-w-0 max-w-xl"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: SLIDE_EASE }}
          >
            <Badge
              color="brand"
              size="md"
              className="mb-3 border-0 bg-[var(--brand-soft)] text-[var(--brand)] ring-1 ring-[rgba(29,214,111,0.25)] sm:mb-4"
            >
              هفته آینده
            </Badge>

            <h1
              className="text-balance text-[clamp(1.65rem,6vw,3.5rem)] font-bold leading-[1.12] tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              dir="ltr"
            >
              {movie.titleEn || movie.titleFa}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[12px] text-[var(--fg-tertiary)] sm:mt-4 sm:text-[13px] md:text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-white backdrop-blur-sm">
                <Star className="size-3.5 fill-[var(--star)] text-[var(--star)]" />
                {fa(movie.rating.toFixed(1))}
              </span>
              <span>{movie.duration}</span>
              <span aria-hidden>·</span>
              <span>{fa(movie.year)}</span>
              <span aria-hidden>·</span>
              <span>{movie.genres.slice(0, 2).join(' · ')}</span>
              <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[11px] text-white/85 ring-1 ring-white/15">
                {movie.maturity}
              </span>
            </div>

            {movie.description ? (
              <p className="mt-3 line-clamp-2 max-w-lg text-[13px] leading-6 text-[var(--fg-secondary)] sm:mt-4 sm:line-clamp-3 sm:text-[14px] sm:leading-7 md:text-[15px]">
                {movie.description}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-5 shadow-[0_10px_30px_rgba(29,214,111,0.35)] sm:px-6"
              >
                <Link href={watchHref}>
                  <Play className="size-4 fill-current" />
                  تماشای تریلر
                </Link>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="rounded-xl border-0 bg-white/10 px-4 text-white ring-1 ring-white/15 backdrop-blur-md hover:bg-white/16 sm:px-5"
                onClick={() => {
                  const added = toggleMyList(movie.id)
                  setInList(added)
                  toast(added ? 'به لیست تماشا اضافه شد' : 'از لیست تماشا حذف شد')
                }}
              >
                {inList ? <Check className="size-4" /> : <Plus className="size-4" />}
                {inList ? 'در لیست' : 'افزودن به لیست'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="page-max page-pad absolute inset-x-0 bottom-[calc(var(--tabbar-h)+0.85rem)] z-20 mx-auto flex items-center justify-end gap-3 sm:gap-4 md:bottom-10">
        {slides.length > 1 ? (
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                className={
                  i === index
                    ? 'h-2 w-2 rounded-full bg-[var(--brand)] transition-all'
                    : 'h-2 w-2 rounded-full bg-white/35 transition-all hover:bg-white/55'
                }
                aria-label={`اسلاید ${fa(i + 1)}`}
              />
            ))}
          </div>
        ) : null}

        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="rounded-full bg-black/45"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'فعال‌سازی صدا' : 'قطع صدا'}
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </Button>
      </div>
    </section>
  )
}
