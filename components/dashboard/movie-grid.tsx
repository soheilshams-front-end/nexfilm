'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, Plus, Check, Play, Star } from 'lucide-react'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'
import { cn } from '@/lib/utils'

/** Compact movie card for dashboard grids — shows progress + favorite. */
export function DashboardMovieCard({ movie, showProgress }: { movie: Movie; showProgress?: boolean }) {
  const [fav, setFav] = useState(false)
  const [added, setAdded] = useState(false)

  return (
    <Link
      href={`/movie/${movie.id}`}
      className={cn(
        'group relative block overflow-hidden rounded-xl border border-border/60 bg-card',
        'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_24px_50px_-18px_rgba(0,0,0,0.9)]',
      )}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />

        {/* Favorite */}
        <button
          onClick={(e) => { e.preventDefault(); setFav(!fav) }}
          className={cn(
            'absolute left-2 top-2 grid size-7 place-items-center rounded-full backdrop-blur-md transition-all',
            fav ? 'bg-destructive/90 text-white' : 'bg-background/70 text-foreground/80 opacity-0 group-hover:opacity-100 hover:bg-background',
          )}
          aria-label="علاقه‌مندی"
        >
          <Heart className={cn('size-3.5', fav && 'fill-current')} />
        </button>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[rgba(var(--bg-rgb),0.92)] via-[rgba(var(--bg-rgb),0.45)] to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 z-[1] p-1.5 sm:p-3">
          <h4 className="line-clamp-2 text-[11px] font-semibold leading-snug text-white drop-shadow-sm sm:text-sm">
            {movie.title}
          </h4>
          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/70 sm:mt-1 sm:gap-1.5 sm:text-[11px]">
            <Star className="size-2.5 fill-[var(--star)] text-[var(--star)] sm:size-3" />
            <span className="text-white/90">{fa(movie.rating.toFixed(1))}</span>
            <span aria-hidden className="hidden text-white/35 sm:inline">
              ·
            </span>
            <span className="hidden sm:inline">{fa(movie.year)}</span>
          </p>
          <div className="mt-2 hidden gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:flex">
            <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
              <Play className="size-3 fill-current" />
            </span>
            <button
              onClick={(e) => { e.preventDefault(); setAdded(!added) }}
              className={cn(
                'grid size-7 place-items-center rounded-full border backdrop-blur-md',
                added ? 'border-primary/60 bg-primary/20 text-primary' : 'border-border bg-background/70 text-foreground',
              )}
            >
              {added ? <Check className="size-3" /> : <Plus className="size-3" />}
            </button>
          </div>
          {showProgress && typeof movie.progress === 'number' ? (
            <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-white/20 sm:h-1">
              <div
                className="h-full rounded-full bg-[var(--brand)]"
                style={{ width: `${movie.progress}%` }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

/** Grid of dashboard movie cards. */
export function MovieGrid({ movies, showProgress }: { movies: Movie[]; showProgress?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((m) => (
        <DashboardMovieCard key={m.id} movie={m} showProgress={showProgress} />
      ))}
    </div>
  )
}
