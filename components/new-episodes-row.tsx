'use client'

import Link from 'next/link'
import { Play, Calendar } from 'lucide-react'
import { fa } from '@/lib/format-fa'
import { getNewEpisodes } from '@/lib/movies'

export function NewEpisodesRow() {
  const eps = getNewEpisodes()
  if (!eps.length) return null

  return (
    <section className="reveal w-full min-w-0 overflow-x-hidden">
      <div className="mb-3 flex min-w-0 items-center gap-2.5 page-pad sm:mb-4 sm:gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary sm:size-8">
          <Calendar className="size-3.5 sm:size-4" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-white sm:text-lg md:text-xl">
            قسمت‌های جدید
          </h2>
          <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
            آخرین قسمت‌های سریال‌ها
          </p>
        </div>
      </div>

      <div className="no-scrollbar flex gap-2.5 overflow-x-auto overscroll-x-contain px-[var(--space-page-x)] pb-2 sm:gap-3">
        {eps.map(({ movie, ep }) => (
          <Link
            key={`${movie.id}-${ep.season}-${ep.episode}`}
            href={`/watch/${movie.id}?s=${ep.season}&e=${ep.episode}`}
            className="group flex w-[min(15.5rem,72vw)] shrink-0 gap-2 rounded-xl border border-white/[0.08] bg-card/80 p-2 transition-colors hover:border-primary/40 sm:w-[17.5rem] sm:gap-2.5 sm:rounded-lg sm:p-2.5 md:w-72 md:gap-3 md:p-3"
          >
            <div className="relative h-[3.75rem] w-[5.5rem] shrink-0 overflow-hidden rounded-md sm:h-[4.25rem] sm:w-[6.25rem] md:h-24 md:w-36">
              <img
                src={movie.backdrop || movie.poster}
                alt=""
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <Play className="size-4 fill-white text-white sm:size-5 md:size-6" />
              </span>
              <span className="absolute right-1 top-1 max-w-[calc(100%-0.5rem)] truncate rounded bg-primary px-1 py-0.5 text-[8px] font-bold text-white sm:right-1.5 sm:top-1.5 sm:px-1.5 sm:text-[10px]">
                {ep.addedAgo}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 overflow-hidden">
              <p className="truncate text-[10px] font-semibold text-primary sm:text-[11px]">
                فصل {fa(ep.season)} · قسمت {fa(ep.episode)}
              </p>
              <h3 className="truncate text-[12px] font-bold text-white sm:text-[13px] md:text-sm">
                {ep.episodeTitle}
              </h3>
              <p className="truncate text-[10px] text-muted-foreground sm:text-[11px] md:text-xs">
                {movie.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
