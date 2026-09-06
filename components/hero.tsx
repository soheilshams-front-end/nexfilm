'use client'

import Link from 'next/link'
import { Play, Plus, Info, Star, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'

export function Hero({ movie }: { movie: Movie }) {
  return (
    <section className="relative h-[75vh] min-h-[480px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={movie.backdrop || '/placeholder.svg'}
          alt=""
          className="absolute inset-0 size-full object-cover anim-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-l from-background/75 via-background/25 to-transparent" />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-end px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {(movie.award || movie.featured) && (
            <span className="inline-flex items-center gap-1.5 rounded bg-primary/90 px-2.5 py-1 text-xs font-bold text-white">
              <Sparkles className="size-3.5" />
              {movie.award ?? 'ویژه'}
            </span>
          )}

          <h1 className="font-en mt-4 text-end text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl" dir="ltr">
            {movie.titleEn || movie.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="flex items-center gap-1 font-semibold text-primary">
              <Star className="size-4 fill-primary" />
              {fa(movie.rating.toFixed(1))}
            </span>
            <span className="text-white/80">{fa(movie.year)}</span>
            <span className="rounded border border-white/20 px-1.5 py-0.5 text-xs text-white/80">
              {movie.maturity}
            </span>
            <span className="text-white/80">{movie.duration}</span>
            <span className="text-muted-foreground">تطابق {fa(movie.match)}٪</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {movie.genres.slice(0, 4).map((g) => (
              <span
                key={g}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/85"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="mt-4 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            {movie.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/watch/${movie.id}`}
              className="inline-flex items-center gap-2 rounded bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="size-4 fill-current" />
              تماشا
            </Link>
            <Link
              href={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 rounded border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <Info className="size-4" />
              اطلاعات
            </Link>
            <button
              className="grid size-10 place-items-center rounded border border-white/25 text-white transition-colors hover:border-primary hover:text-primary"
              aria-label="افزودن به لیست"
            >
              <Plus className="size-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
