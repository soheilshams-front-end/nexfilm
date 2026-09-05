'use client'

import Link from 'next/link'
import { Play, Star, Flame } from 'lucide-react'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'

export function Top10Row({ movies }: { movies: Movie[] }) {
  return (
    <section className="reveal">
      <div className="mb-4 flex items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
          <Flame className="size-4" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">۱۰ عنوان برتر امروز</h2>
          <p className="text-xs text-muted-foreground">پرطرفدارترین‌های روز</p>
        </div>
      </div>

      <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-8">
        {movies.map((movie, i) => {
          const rank = fa(i + 1)
          return (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group relative flex shrink-0 items-center"
            >
              <span
                className="pointer-events-none select-none font-display text-[5.5rem] font-extrabold leading-none num-stroke transition-colors group-hover:text-primary/20 sm:text-[7rem]"
                style={{ marginLeft: '-1rem', zIndex: 0 }}
              >
                {rank}
              </span>
              <div className="relative z-10 w-[108px] shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-white/[0.08] bg-card transition-transform duration-300 group-hover:scale-105 sm:w-[150px]">
                <div className="relative aspect-[2/3] w-full">
                  <img
                    src={movie.poster || '/placeholder.svg'}
                    alt={movie.title}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="grid size-10 place-items-center rounded-full bg-primary text-white">
                      <Play className="size-4 fill-current" />
                    </span>
                  </span>
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold">
                    <Star className="size-3 fill-primary text-primary" />
                    {fa(movie.rating.toFixed(1))}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
