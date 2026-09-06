'use client'

import Link from 'next/link'
import { Trophy, Star, Play } from 'lucide-react'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'

export function AwardWinnersGrid({ movies }: { movies: Movie[] }) {
  return (
    <section className="reveal">
      <div className="mb-4 flex items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
          <Trophy className="size-4" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">برنده‌های جایزه</h2>
          <p className="text-xs text-muted-foreground">آثار تقدیرشده در جشنواره‌ها</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 px-3 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:grid-cols-5 lg:px-8">
        {movies.map((m) => (
          <Link
            key={m.id}
            href={`/movie/${m.id}`}
            className="group overflow-hidden rounded-lg border border-white/[0.08] bg-card transition-transform hover:scale-[1.02]"
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden">
              <img
                src={m.poster}
                alt={m.title}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                <Trophy className="size-3" />
                جایزه
              </span>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[rgba(var(--bg-rgb),0.92)] via-[rgba(var(--bg-rgb),0.4)] to-transparent"
              />
              <span className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <span className="grid size-10 place-items-center rounded-full bg-primary text-white">
                  <Play className="size-4 fill-current" />
                </span>
              </span>
              <div className="absolute inset-x-0 bottom-0 z-[1] p-1.5 sm:p-2.5">
                <h3 className="font-en line-clamp-2 text-center text-[11px] font-semibold leading-snug text-white drop-shadow-sm sm:text-sm" dir="ltr">
                  {m.titleEn || m.title}
                </h3>
                <p className="mt-0.5 flex items-center justify-center gap-1 text-[10px] text-white/70 sm:text-[11px]">
                  <Star className="size-2.5 fill-[var(--star)] text-[var(--star)] sm:size-3" />
                  <span className="text-white/90">{fa(m.rating.toFixed(1))}</span>
                </p>
                {m.award ? (
                  <p className="mt-0.5 truncate text-center text-[10px] text-[var(--brand)] sm:text-[11px]">{m.award}</p>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
