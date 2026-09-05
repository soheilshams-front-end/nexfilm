'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Play, Plus, Check, Star } from 'lucide-react'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'
import { cn } from '@/lib/utils'
import { isInMyList, toggleMyList } from '@/lib/user-store'
import { useToast } from '@/components/toast-provider'
import { LikeButton } from '@/components/like-button'

type Variant = 'default' | 'wide' | 'compact'

export function MovieCard({
  movie,
  className,
  showProgress,
  variant = 'default',
}: {
  movie: Movie
  className?: string
  showProgress?: boolean
  variant?: Variant
}) {
  const [added, setAdded] = useState(false)
  const toast = useToast()
  const aspect = variant === 'wide' ? 'aspect-video' : 'aspect-[2/3]'
  const detailHref = movie.type === 'Series' ? `/series/${movie.id}` : `/movie/${movie.id}`
  const episodeLabel = movie.type === 'Series' && showProgress ? 'S01 E01' : null

  useEffect(() => {
    setAdded(isInMyList(movie.id))
  }, [movie.id])

  return (
    <div className={cn('group shrink-0', className)}>
      <Link
        href={detailHref}
        className={cn(
          'relative block overflow-hidden rounded-[var(--radius-card)] bg-[var(--bg-secondary)] outline-none ring-1 ring-[var(--border-secondary)]',
        )}
        tabIndex={0}
      >
        <div className={cn('relative w-full overflow-hidden', aspect)}>
          <img
            src={movie.poster || '/placeholder.svg'}
            alt={`پوستر ${movie.title}`}
            className="size-full object-cover"
            loading="lazy"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[rgba(var(--bg-rgb),0.92)] via-[rgba(var(--bg-rgb),0.45)] to-transparent"
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-1.5 sm:p-2.5 md:pointer-events-auto">
            <div className="flex items-center gap-1.5 pt-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.location.href = `/watch/${movie.id}`
                }}
                className="grid size-9 cursor-pointer place-items-center rounded-full bg-primary text-white shadow-lg"
                aria-label="پخش"
              >
                <Play className="size-4 fill-current" />
              </span>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-full border border-white/25 bg-black/40 text-white"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const next = toggleMyList(movie.id)
                  setAdded(next)
                  toast(next ? 'به لیست من اضافه شد' : 'از لیست من حذف شد')
                }}
                aria-label="افزودن به لیست"
              >
                {added ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
              </button>
              <LikeButton movieId={movie.id} size="sm" />
            </div>

            <div className="relative z-[1]">
              <h3 className="line-clamp-2 text-[11px] font-semibold leading-snug text-white drop-shadow-sm sm:text-sm">
                {movie.title}
              </h3>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/70 sm:mt-1 sm:gap-1.5 sm:text-[11px]">
                <Star className="size-2.5 shrink-0 fill-[var(--star)] text-[var(--star)] sm:size-3" />
                <span className="text-white/90">{fa(movie.rating.toFixed(1))}</span>
                {episodeLabel ? (
                  <>
                    <span aria-hidden className="text-white/35">
                      ·
                    </span>
                    <span>{episodeLabel}</span>
                  </>
                ) : movie.genres[0] ? (
                  <>
                    <span aria-hidden className="hidden text-white/35 sm:inline">
                      ·
                    </span>
                    <span className="hidden truncate sm:inline">{movie.genres[0]}</span>
                  </>
                ) : null}
              </p>
              {showProgress && typeof movie.progress === 'number' ? (
                <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-white/20 sm:h-1">
                  <div
                    className="h-full rounded-full bg-[var(--brand)]"
                    style={{ width: `${Math.max(2, Math.min(100, movie.progress))}%` }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
