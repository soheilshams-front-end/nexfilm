'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { fa } from '@/lib/format-fa'
import { getNewEpisodes } from '@/lib/movies'
import { TitleText } from '@/components/title-text'
import { ShelfSection, ShelfTrack, useShelfScroller } from '@/components/shelf-section'

export function NewEpisodesRow() {
  const eps = getNewEpisodes()
  const { scroller, onKeyDown, scrollByDir } = useShelfScroller()
  if (!eps.length) return null

  return (
    <ShelfSection title="قسمت‌های جدید" href="/series" seeAllLabel="همه سریال‌ها">
      <ShelfTrack
        scrollerRef={scroller}
        label="قسمت‌های جدید"
        onKeyDown={onKeyDown}
        onScrollStart={() => scrollByDir('start')}
        onScrollEnd={() => scrollByDir('end')}
      >
        {eps.map(({ movie, ep }) => {
          const seriesName = movie.titleEn || movie.title
          return (
            <Link
              key={`${movie.id}-${ep.season}-${ep.episode}`}
              href={`/watch/${movie.id}?s=${ep.season}&e=${ep.episode}`}
              tabIndex={0}
              className="focus-tile group block w-[min(17.5rem,78vw)] shrink-0 snap-start outline-none sm:w-[19.5rem] md:w-[21rem]"
            >
              <div className="focus-tile-media relative aspect-video overflow-hidden rounded-[var(--radius-card)] bg-[var(--bg-secondary)] ring-1 ring-white/[0.08]">
                <img
                  src={movie.backdrop || movie.poster}
                  alt=""
                  className="size-full object-cover transition-transform duration-500 ease-out sm:group-hover:scale-[1.03]"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = movie.poster || '/placeholder.svg'
                  }}
                />

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(var(--bg-rgb),0.88)] via-[rgba(var(--bg-rgb),0.2)] to-transparent"
                />

                <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="grid size-11 place-items-center rounded-full bg-white/95 text-black shadow-[0_8px_28px_rgba(0,0,0,0.45)] sm:size-12">
                    <Play className="size-4 fill-current ms-0.5 sm:size-5" />
                  </span>
                </span>

                <span className="absolute start-2.5 top-2.5 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white/90 ring-1 ring-white/12 backdrop-blur-sm sm:start-3 sm:top-3 sm:text-[11px]">
                  فصل {fa(ep.season)} · قسمت {fa(ep.episode)}
                </span>

                <span className="absolute end-2.5 top-2.5 text-[10px] font-medium text-white/70 sm:end-3 sm:top-3 sm:text-[11px]">
                  {ep.addedAgo}
                </span>

                <div className="absolute inset-x-0 bottom-0 z-[1] p-2.5 sm:p-3.5">
                  <TitleText
                    as="h3"
                    className="line-clamp-1 text-[13px] font-semibold leading-snug text-white drop-shadow-sm sm:text-[15px]"
                  >
                    {ep.episodeTitle}
                  </TitleText>
                </div>
              </div>

              <p
                className="font-en mt-2 truncate px-0.5 text-start text-[12px] tracking-wide text-white/55 sm:mt-2.5 sm:text-[13px]"
                dir="ltr"
              >
                {seriesName}
              </p>
            </Link>
          )
        })}
      </ShelfTrack>
    </ShelfSection>
  )
}
