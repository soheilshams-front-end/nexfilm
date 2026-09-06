'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import { fa } from '@/lib/format-fa'
import type { Movie } from '@/lib/movies'
import type { SaintstreamTitle } from '@/lib/saintstream-home'
import { cn } from '@/lib/utils'

export type PosterCardTitle = {
  id: string
  titleFa: string
  poster: string
  rating: number
  genres: string[]
  type: 'Film' | 'Series'
}

export function movieToPosterTitle(movie: Movie): PosterCardTitle {
  return {
    id: movie.id,
    titleFa: movie.titleEn || movie.title,
    poster: movie.poster,
    rating: movie.rating,
    genres: movie.genres,
    type: movie.type,
  }
}

export function PosterCard({
  title,
  className,
  widthClass = 'w-[var(--poster-card-w)]',
  progress,
  href,
}: {
  title: PosterCardTitle | SaintstreamTitle
  className?: string
  widthClass?: string
  /** 0–100 continue-watching progress */
  progress?: number
  /** Override detail link (e.g. /watch/id) */
  href?: string
}) {
  const displayTitle =
    'titleEn' in title && title.titleEn ? title.titleEn : title.titleFa
  const detailHref =
    href ?? (title.type === 'Series' ? `/series/${title.id}` : `/movie/${title.id}`)
  const typeLabel = title.type === 'Series' ? 'سریال' : 'فیلم'

  return (
    <Link
      href={detailHref}
      tabIndex={0}
      className={cn('focus-tile group block shrink-0 snap-start outline-none', widthClass, className)}
    >
      <div className="relative aspect-[2/3] focus-tile-media overflow-hidden rounded-[var(--radius-card)] bg-[var(--bg-secondary)] ring-1 ring-white/[0.08]">
        <img
          src={title.poster}
          alt={displayTitle}
          className="size-full object-cover transition-transform duration-500 ease-out sm:group-hover:scale-[1.03]"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg'
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[rgba(var(--bg-rgb),0.92)] via-[rgba(var(--bg-rgb),0.45)] to-transparent transition-[height] duration-300 sm:group-hover:h-[62%]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-[rgba(var(--bg-rgb),0.55)] to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 z-[1] p-1.5 sm:p-3.5 md:p-4">
          <h3
            className="font-en line-clamp-2 text-center text-[11px] font-semibold leading-snug text-white drop-shadow-sm sm:text-[14px] md:text-[15px]"
            dir="ltr"
          >
            {displayTitle}
          </h3>
          <p className="mt-0.5 flex items-center justify-center gap-1 text-[10px] tracking-wide text-white/70 sm:mt-1.5 sm:gap-1.5 sm:text-[11px] md:text-[12px]">
            <Star className="size-2.5 shrink-0 fill-[var(--star)] text-[var(--star)] sm:size-3" />
            <span className="text-white/90">{fa(title.rating.toFixed(1))}</span>
            <span aria-hidden className="hidden text-white/35 sm:inline">
              ·
            </span>
            <span className="hidden truncate sm:inline">{title.genres[0] ?? typeLabel}</span>
            <span aria-hidden className="hidden text-white/35 sm:inline">
              ·
            </span>
            <span className="hidden shrink-0 sm:inline">{typeLabel}</span>
          </p>
          {typeof progress === 'number' && progress > 0 ? (
            <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-white/20 sm:mt-2.5 sm:h-1">
              <div
                className="h-full rounded-full bg-[var(--brand)]"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
