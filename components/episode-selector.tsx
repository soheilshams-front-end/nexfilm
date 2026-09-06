'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { fa } from '@/lib/format-fa'
import { getSeasons } from '@/lib/movies'
import { cn } from '@/lib/utils'
import { TitleText } from '@/components/title-text'

export function EpisodeSelector({
  seriesId,
  showTitle = true,
  compact = false,
  currentSeason,
  currentEpisode,
}: {
  seriesId: string
  showTitle?: boolean
  /** فشرده‌تر برای سایدبار صفحه پخش */
  compact?: boolean
  currentSeason?: number
  currentEpisode?: number
}) {
  const seasons = getSeasons(seriesId)
  const [seasonId, setSeasonId] = useState(currentSeason ?? seasons[0]?.id ?? 1)
  const season = seasons.find((s) => s.id === seasonId) ?? seasons[0]

  useEffect(() => {
    if (currentSeason != null) setSeasonId(currentSeason)
  }, [currentSeason])

  if (!season) return null

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden">
      <div
        className={cn(
          'flex w-full min-w-0 flex-col gap-2',
          showTitle ? 'sm:flex-row sm:items-center sm:justify-between sm:gap-3' : null,
        )}
      >
        {showTitle ? (
          <h2 className="shrink-0 text-sm font-semibold text-white sm:text-base">قسمت‌ها</h2>
        ) : null}
        <div className="-mx-0.5 w-full min-w-0 overflow-x-auto overscroll-x-contain no-scrollbar">
          <div className="flex w-max min-w-full gap-1.5 px-0.5 pb-0.5">
            {seasons.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSeasonId(s.id)}
                className={cn(
                  'shrink-0 rounded-full font-semibold whitespace-nowrap transition-colors',
                  compact
                    ? 'px-2.5 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-[12px]'
                    : 'px-3 py-1.5 text-[12px] sm:px-4 sm:py-2 sm:text-[13px]',
                  seasonId === s.id
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white',
                )}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul
        className={cn(
          'w-full min-w-0 divide-y divide-white/[0.06]',
          compact ? 'mt-2.5 sm:mt-3' : 'mt-3 sm:mt-5',
        )}
      >
        {season.episodes.map((ep) => {
          const active = currentSeason === season.id && currentEpisode === ep.id
          return (
            <li key={ep.id} className="min-w-0">
              <Link
                href={`/watch/${seriesId}?s=${season.id}&e=${ep.id}`}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'group grid w-full min-w-0 items-start rounded-[12px] transition-all duration-200 hover:bg-white/[0.06] hover:translate-x-0.5',
                  compact
                    ? 'grid-cols-[auto_minmax(0,1fr)] gap-x-2.5 gap-y-1 px-1.5 py-2.5'
                    : 'grid-cols-[auto_auto_minmax(0,1fr)] gap-x-2 gap-y-1 py-3 sm:gap-x-3 sm:py-3.5 md:gap-x-4 md:py-4',
                  active && 'bg-[var(--brand-soft)] ring-1 ring-[rgba(29,214,111,0.28)]',
                )}
              >
                {!compact ? (
                  <span className="w-4 shrink-0 self-center text-center text-[11px] tabular-nums text-white/40 sm:w-5 sm:self-start sm:pt-5 sm:text-sm md:pt-6">
                    {fa(ep.id)}
                  </span>
                ) : null}

                <div
                  className={cn(
                    'relative shrink-0 overflow-hidden rounded-[10px] bg-[var(--bg-2)] ring-1 ring-white/10',
                    compact
                      ? 'h-12 w-[4.75rem] sm:h-14 sm:w-[5.5rem]'
                      : 'h-12 w-[5.25rem] sm:h-16 sm:w-[7.25rem] md:h-[4.75rem] md:w-32 lg:h-20 lg:w-36',
                  )}
                >
                  {compact ? (
                    <span className="absolute left-1 top-1 z-[1] rounded bg-black/65 px-1 py-px text-[9px] font-semibold tabular-nums text-white/80">
                      {fa(ep.id)}
                    </span>
                  ) : null}
                  <img
                    src={ep.thumbnail}
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span
                      className={cn(
                        'grid place-items-center rounded-full bg-white text-black',
                        compact ? 'size-6 sm:size-7' : 'size-7 sm:size-8 md:size-9',
                      )}
                    >
                      <Play
                        className={cn(
                          'ms-0.5 fill-current',
                          compact ? 'size-3 sm:size-3.5' : 'size-3.5 sm:size-4',
                        )}
                      />
                    </span>
                  </span>
                </div>

                <div className="min-w-0 max-w-full self-center overflow-hidden sm:self-start sm:pt-0.5">
                  <div className="flex min-w-0 items-baseline gap-2">
                    <TitleText
                      as="h3"
                      className={cn(
                        'min-w-0 flex-1 truncate font-medium text-white',
                        compact ? 'text-[12px] sm:text-[13px]' : 'text-[13px] sm:text-sm',
                      )}
                    >
                      {ep.title}
                    </TitleText>
                    {ep.duration ? (
                      <span
                        className={cn(
                          'hidden shrink-0 text-white/45 sm:inline',
                          compact ? 'text-[10px]' : 'text-[10px] sm:text-xs',
                        )}
                      >
                        {ep.duration}
                      </span>
                    ) : null}
                  </div>

                  {ep.duration ? (
                    <p
                      className={cn(
                        'mt-0.5 text-white/40 sm:hidden',
                        compact ? 'text-[10px]' : 'text-[10px]',
                      )}
                    >
                      {ep.duration}
                    </p>
                  ) : null}

                  {ep.description ? (
                    <p
                      className={cn(
                        'mt-0.5 text-white/50',
                        compact
                          ? 'line-clamp-1 text-[10px] leading-4 sm:text-[11px]'
                          : 'line-clamp-1 text-[11px] leading-4 sm:mt-1 sm:line-clamp-2 sm:text-xs sm:leading-5 md:text-[13px] md:leading-6',
                      )}
                    >
                      {ep.description}
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
