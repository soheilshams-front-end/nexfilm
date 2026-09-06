'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, Star } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'
import { DetailActions } from '@/components/detail-actions'
import { Button } from '@/components/untitled/button'

export function DetailHero({ movie }: { movie: Movie }) {
  const reduceMotion = useReducedMotion()
  const watchHref = `/watch/${movie.id}`
  const poster = movie.poster || '/placeholder.svg'
  const backdropCandidate = movie.backdrop && movie.backdrop !== movie.poster ? movie.backdrop : null
  const [useBackdrop, setUseBackdrop] = useState(Boolean(backdropCandidate))

  const ambient = useBackdrop && backdropCandidate ? backdropCandidate : poster

  return (
    <section className="relative isolate min-h-[70vh] w-full overflow-hidden sm:min-h-[76vh]">
      <img
        src={ambient}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full scale-110 object-cover opacity-45 blur-2xl"
      />

      {useBackdrop && backdropCandidate ? (
        <img
          src={backdropCandidate}
          alt=""
          className="absolute inset-0 size-full object-cover object-[center_22%]"
          onLoad={(e) => {
            const img = e.currentTarget
            // Reject portrait / headshot backdrops that ruin the hero
            if (img.naturalWidth <= img.naturalHeight * 1.15) {
              setUseBackdrop(false)
            }
          }}
          onError={() => setUseBackdrop(false)}
        />
      ) : (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 m-auto h-[82%] max-h-[560px] w-auto max-w-[min(42%,340px)] object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/25 to-transparent" />

      <div className="page-max page-pad relative z-10 flex min-h-[64vh] items-end pb-8 pt-24 sm:min-h-[70vh] sm:pb-10 sm:pt-28 md:min-h-[76vh] md:pb-12">
        <div className="flex w-full min-w-0 flex-col gap-5 sm:flex-row sm:items-end sm:gap-8">
          <img
            src={poster}
            alt=""
            className="hidden w-[148px] shrink-0 rounded-[14px] shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/15 sm:block md:w-[170px]"
          />

          <motion.div
            className="min-w-0 max-w-2xl flex-1"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {movie.titleEn && movie.titleEn !== movie.title ? (
              <p className="font-en text-end text-[13px] font-medium tracking-wide text-white/45" dir="ltr">
                {movie.titleEn}
              </p>
            ) : null}
            <h1
              className={`mt-1 text-balance text-[clamp(1.7rem,6vw,3.6rem)] font-bold leading-[1.1] text-white${
                !movie.titleEn || movie.titleEn === movie.title ? ' font-en text-end' : ''
              }`}
              dir={!movie.titleEn || movie.titleEn === movie.title ? 'ltr' : undefined}
            >
              {movie.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-white/70">
              {movie.rating ? (
                <span className="inline-flex items-center gap-1 font-semibold text-white">
                  <Star className="size-3.5 fill-[var(--star)] text-[var(--star)]" />
                  {fa(movie.rating.toFixed(1))}
                </span>
              ) : null}
              {movie.year ? <span>{fa(movie.year)}</span> : null}
              {movie.duration ? <span>{movie.duration}</span> : null}
              {movie.maturity ? (
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[12px] font-semibold text-white/85 ring-1 ring-white/15">
                  {movie.maturity}
                </span>
              ) : null}
            </div>

            {movie.genres.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {movie.genres.slice(0, 4).map((g) => (
                  <Link
                    key={g}
                    href={`/movies?genre=${encodeURIComponent(g)}`}
                    className="rounded-full bg-white/[0.08] px-3 py-1 text-[12px] font-medium text-white/75 ring-1 ring-white/10 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            ) : null}

            {movie.tagline ? (
              <p className="mt-4 text-[15px] font-medium text-[var(--brand)]/90">{movie.tagline}</p>
            ) : null}

            {movie.description ? (
              <p className="mt-3 line-clamp-4 max-w-xl text-[15px] leading-7 text-white/70 sm:text-[16px]">
                {movie.description}
              </p>
            ) : null}

            {movie.director && movie.director !== '—' ? (
              <p className="mt-3 text-[13px] text-white/45">
                کارگردان: <span className="text-white/75">{movie.director}</span>
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3">
              <Button asChild size="lg" className="min-w-[7.5rem] px-6 sm:min-w-[9.5rem] sm:px-8">
                <Link href={watchHref}>
                  <Play className="size-4 fill-current" />
                  پخش
                </Link>
              </Button>
              <DetailActions movieId={movie.id} watchHref={watchHref} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
