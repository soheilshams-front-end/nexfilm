'use client'

import { useCallback, useRef, type KeyboardEvent } from 'react'
import type { Movie } from '@/lib/movies'
import { MovieCard } from '@/components/movie-card'
import { SectionHeader } from '@/components/section-header'
import { cn } from '@/lib/utils'

export function MovieRow({
  title,
  movies,
  showProgress,
  variant = 'default',
  href = '#',
}: {
  title: string
  movies: Movie[]
  showProgress?: boolean
  variant?: 'default' | 'wide'
  href?: string
}) {
  const scroller = useRef<HTMLDivElement>(null)
  if (!movies.length) return null

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const el = scroller.current
    if (!el) return
    const step = Math.round(el.clientWidth * 0.7)
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      el.scrollBy({ left: -step, behavior: 'smooth' })
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      el.scrollBy({ left: step, behavior: 'smooth' })
    }
  }, [])

  return (
    <section className="reveal py-4 md:py-9">
      <SectionHeader title={title} href={href} />
      <div className="relative md:mask-fade-x">
        <div
          ref={scroller}
          role="list"
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label={title}
          className={cn(
            'shelf-track no-scrollbar flex gap-2 overflow-x-auto px-[var(--space-page-x)] pb-2 pt-1 sm:gap-4 md:gap-6',
            '[scroll-snap-type:x_mandatory]',
          )}
        >
          {movies.map((movie, i) => (
            <MovieCard
              key={`${movie.id}-${i}`}
              movie={movie}
              showProgress={showProgress}
              variant={variant}
              className={cn(
                'snap-start',
                variant === 'wide'
                  ? 'w-[70vw] max-w-[320px] sm:w-[260px]'
                  : 'w-[var(--poster-card-w)]',
              )}
            />
          ))}
          <div className="w-px shrink-0" aria-hidden />
        </div>
      </div>
    </section>
  )
}
