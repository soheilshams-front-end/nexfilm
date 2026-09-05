'use client'

import Link from 'next/link'
import { Play, Star } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'
import { Button } from '@/components/untitled/button'
import { cn } from '@/lib/utils'

export function ArchiveHero({
  kind,
  featured,
  count,
}: {
  kind: 'Film' | 'Series'
  featured: Movie
  count: number
}) {
  const reduceMotion = useReducedMotion()
  const isFilm = kind === 'Film'
  const title = isFilm ? 'فیلم‌ها' : 'سریال‌ها'
  const eyebrow = isFilm ? 'آرشیو سینمایی نکس‌فیلم' : 'آرشیو سریال نکس‌فیلم'
  const support = isFilm
    ? 'از آثار تازه تا کلاسیک‌های ماندگار — همه در یک نگاه.'
    : 'فصل‌به‌فصل، از درام تا علمی‌تخیلی — آماده تماشا.'
  const detailHref = isFilm ? `/movie/${featured.id}` : `/series/${featured.id}`
  const media = featured.backdrop || featured.poster

  return (
    <section className="relative h-[min(78dvh,920px)] min-h-[440px] w-full overflow-hidden sm:h-[min(88dvh,920px)] sm:min-h-[540px]">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.2 : 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={media}
          alt=""
          className="size-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/55 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-l from-[var(--bg)]/90 via-[var(--bg)]/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent" />
      </motion.div>

      <div className="page-max page-pad relative z-10 flex h-full flex-col justify-end pb-[calc(var(--tabbar-h)+1.25rem)] pt-28 sm:pb-14 sm:pt-36 md:pb-20 md:pt-40">
        <motion.div
          className="min-w-0 max-w-2xl"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[12px] font-semibold tracking-wide text-[var(--brand)] sm:text-[13px] md:text-sm">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-balance text-[clamp(2rem,10vw,4.75rem)] font-bold leading-[1.05] tracking-tight text-white sm:mt-3">
            {title}
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-7 text-white/70 md:text-base">
            {support}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/55">
            <span className="font-semibold text-white/85">{fa(count)} عنوان</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5 fill-[var(--star)] text-[var(--star)]" />
              ویژه: {featured.title}
            </span>
            <span aria-hidden>·</span>
            <span>{fa(featured.year)}</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-6 shadow-[0_12px_32px_rgba(29,214,111,0.35)]"
            >
              <Link href={`/watch/${featured.id}`}>
                <Play className="size-4 fill-current" />
                تماشای {featured.title}
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className={cn(
                'rounded-xl border-0 bg-white/10 px-5 text-white',
                'ring-1 ring-white/15 backdrop-blur-md hover:bg-white/16',
              )}
            >
              <Link href={detailHref}>جزئیات عنوان</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
