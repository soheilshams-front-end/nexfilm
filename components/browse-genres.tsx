'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { fa } from '@/lib/format-fa'
import { cn } from '@/lib/utils'

export type GenreCardData = {
  name: string
  count: number
  titleFa: string
  titleEn: string
  poster: string
  backdrop: string
  movieId: string
  labelEn: string
  href: string
}

export function BrowseGenres({ genres }: { genres: GenreCardData[] }) {
  const reduceMotion = useReducedMotion()

  if (!genres.length) {
    return <p className="py-20 text-center text-[var(--fg-tertiary)]">ژانری برای نمایش نیست.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 xl:grid-cols-6">
      {genres.map((g, i) => {
        const atmosphere = g.backdrop || g.poster

        return (
          <motion.article
            key={g.name}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-16px' }}
            transition={{
              delay: reduceMotion ? 0 : Math.min(i * 0.028, 0.32),
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={g.href}
              className={cn(
                'group relative block aspect-square overflow-hidden rounded-xl sm:rounded-2xl',
                'bg-[var(--bg-secondary)] ring-1 ring-white/[0.1]',
                'shadow-[0_10px_28px_rgba(0,0,0,0.35)]',
                'transition-[transform,box-shadow,ring-color] duration-300 ease-out',
                'hover:scale-[1.03] hover:ring-white/20 hover:shadow-[0_18px_44px_rgba(0,0,0,0.5)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
                'active:scale-[0.98]',
              )}
              aria-label={`ژانر ${g.name} — ${fa(g.count)} عنوان`}
            >
              {/* Atmospheric full-bleed image */}
              <img
                src={atmosphere}
                alt=""
                aria-hidden
                className="absolute inset-0 size-full scale-110 object-cover blur-[6px] saturate-110 transition-transform duration-700 ease-out group-hover:scale-125 sm:blur-[8px]"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = g.poster || '/placeholder.svg'
                }}
              />

              {/* Soft cinematic veil — keeps typography readable without flat color */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-transparent"
              />

              {/* Sharp tilted poster — Spotify cover gesture */}
              <div
                aria-hidden
                className={cn(
                  'pointer-events-none absolute -end-2 -top-1 z-[1]',
                  'h-[56%] w-[44%] sm:h-[60%] sm:w-[46%]',
                  'origin-bottom-start rotate-[22deg]',
                  'transition-transform duration-500 ease-out',
                  'group-hover:rotate-[16deg] group-hover:scale-105',
                )}
              >
                <img
                  src={g.poster}
                  alt=""
                  className="size-full rounded-md object-cover shadow-[0_14px_32px_rgba(0,0,0,0.55)] ring-1 ring-white/25"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg'
                  }}
                />
              </div>

              {/* Typography */}
              <div className="absolute inset-x-0 bottom-0 z-[2] p-3 sm:p-4 md:p-5">
                <h2
                  className={cn(
                    'max-w-[80%] text-start text-[1.35rem] font-black leading-[0.95] tracking-tight text-white',
                    'drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]',
                    'sm:text-[1.55rem] md:text-[1.7rem] lg:text-[1.85rem]',
                  )}
                >
                  {g.name}
                </h2>
                <p
                  className="font-en mt-1.5 max-w-[72%] text-start text-[13px] uppercase tracking-[0.14em] text-white/75 sm:mt-2 sm:text-[15px] md:text-[16px]"
                  dir="ltr"
                >
                  {g.labelEn}
                </p>
                <p className="mt-1.5 text-start text-[10px] font-medium tabular-nums text-white/45 sm:text-[11px]">
                  {fa(g.count)} عنوان
                </p>
              </div>
            </Link>
          </motion.article>
        )
      })}
    </div>
  )
}
