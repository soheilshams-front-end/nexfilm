'use client'

import { useRef } from 'react'
import type { Movie } from '@/lib/movies'
import { movieToPosterTitle, PosterCard } from '@/components/saintstream/poster-card'
import { SectionHeader } from '@/components/section-header'

export function ReleaseRow({ title, movies, href = '/movies' }: { title: string; movies: Movie[]; href?: string }) {
  const scroller = useRef<HTMLDivElement>(null)
  if (!movies.length) return null

  return (
    <section className="reveal py-8 md:py-10">
      <SectionHeader title={title} href={href} />
      <div
        ref={scroller}
        className="no-scrollbar flex gap-2 overflow-x-auto px-[var(--space-page-x)] pb-1 sm:gap-4 md:gap-5"
      >
        {movies.map((movie) => (
          <PosterCard key={movie.id} title={movieToPosterTitle(movie)} />
        ))}
        <div className="w-px shrink-0" aria-hidden />
      </div>
    </section>
  )
}
