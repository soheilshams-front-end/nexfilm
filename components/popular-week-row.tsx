'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import type { SaintstreamTitle } from '@/lib/saintstream-home'
import { fa } from '@/lib/format-fa'
import { ShelfSection, ShelfTrack, useShelfScroller } from '@/components/shelf-section'
import { cn } from '@/lib/utils'

export function PopularWeekRow({ items }: { items: SaintstreamTitle[] }) {
  const { scroller, onKeyDown, scrollByDir } = useShelfScroller()
  const row = items.slice(0, 10)
  if (!row.length) return null

  return (
    <ShelfSection title="محبوب این هفته" href="/movies">
      <ShelfTrack
        scrollerRef={scroller}
        label="محبوب این هفته"
        onKeyDown={onKeyDown}
        onScrollStart={() => scrollByDir('start')}
        onScrollEnd={() => scrollByDir('end')}
        className="gap-1 sm:gap-2 md:gap-3"
      >
        {row.map((item, i) => {
          const detailHref = item.type === 'Series' ? `/series/${item.id}` : `/movie/${item.id}`
          const displayTitle = item.titleEn || item.titleFa
          const typeLabel = item.type === 'Series' ? 'سریال' : 'فیلم'
          const rank = i + 1
          const topThree = rank <= 3

          return (
            <Link
              key={item.id}
              href={detailHref}
              tabIndex={0}
              role="listitem"
              className="focus-tile group relative flex w-[min(9.75rem,42vw)] shrink-0 snap-start flex-col outline-none sm:w-[11.5rem] md:w-[12.75rem]"
            >
              <div className="relative flex min-h-[9.5rem] items-end sm:min-h-[11.5rem] md:min-h-[13rem]">
                <span
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute bottom-0 start-0 z-0 select-none leading-none',
                    'text-[5.25rem] font-black sm:text-[6.5rem] md:text-[7.25rem]',
                    'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.5)]',
                    topThree && '[-webkit-text-stroke:1.5px_rgba(var(--brand-rgb),0.9)]',
                    'opacity-90 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100',
                  )}
                >
                  {fa(rank)}
                </span>

                <div className="focus-tile-media relative z-10 ms-auto w-[68%] overflow-hidden rounded-[var(--radius-card)] bg-[var(--bg-secondary)] ring-1 ring-white/[0.1] sm:w-[70%]">
                  <div className="relative aspect-[2/3] w-full">
                    <img
                      src={item.poster}
                      alt={displayTitle}
                      className="size-full object-cover transition-transform duration-500 ease-out sm:group-hover:scale-[1.03]"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg'
                      }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[rgba(var(--bg-rgb),0.92)] via-[rgba(var(--bg-rgb),0.35)] to-transparent"
                    />
                    <p className="absolute inset-x-0 bottom-0 z-[1] flex items-center justify-center gap-1 p-1.5 text-[10px] text-white/80 sm:gap-1.5 sm:p-2.5 sm:text-[11px]">
                      <Star className="size-2.5 shrink-0 fill-[var(--star)] text-[var(--star)] sm:size-3" />
                      <span className="text-white/95">{fa(item.rating.toFixed(1))}</span>
                      <span aria-hidden className="text-white/30">
                        ·
                      </span>
                      <span className="truncate">{item.genres[0] ?? typeLabel}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 px-0.5 sm:mt-2.5">
                <h3
                  className="font-en line-clamp-2 text-center text-[12px] font-semibold leading-snug tracking-wide text-white sm:text-[13px] md:text-[14px]"
                  dir="ltr"
                >
                  {displayTitle}
                </h3>
                <p className="mt-0.5 text-center text-[10px] text-white/45 sm:text-[11px]">
                  {typeLabel}
                </p>
              </div>
            </Link>
          )
        })}
      </ShelfTrack>
    </ShelfSection>
  )
}
