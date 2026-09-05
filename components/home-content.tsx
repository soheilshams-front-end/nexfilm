'use client'

import { useMemo, useState } from 'react'
import {
  saintstreamHome,
  getAllSaintstreamTitles,
  getSaintstreamGenres,
  type SaintstreamTitle,
} from '@/lib/saintstream-home'
import { HomeFilterBar, type HomeFilterState } from '@/components/home-filter-bar'
import { MovieScroller } from '@/components/saintstream/movie-scroller'
import { PopularWeekRow } from '@/components/popular-week-row'
import { FeaturedBanner } from '@/components/featured-banner'
import { HomeBottomGrid } from '@/components/home-bottom-grid'
import { ContinueWatchingRow } from '@/components/continue-watching-row'
import { HomePremiumBanner } from '@/components/home-premium-banner'
import { NewEpisodesRow } from '@/components/new-episodes-row'

const DEFAULT_FILTER: HomeFilterState = {
  kind: 'all',
  genre: null,
  sort: 'newest',
  scope: 'all',
}

function applyHomeFilter(catalog: SaintstreamTitle[], filter: HomeFilterState): SaintstreamTitle[] {
  let list = [...catalog]

  if (filter.kind === 'film') list = list.filter((t) => t.type === 'Film')
  if (filter.kind === 'series') list = list.filter((t) => t.type === 'Series')
  if (filter.genre) list = list.filter((t) => t.genres.includes(filter.genre!))

  if (filter.scope === 'trending') {
    list = [...list].sort((a, b) => b.rating - a.rating)
  } else if (filter.scope === 'featured') {
    list = list.filter((t) => t.rating >= 4.4)
  }

  if (filter.sort === 'newest') list = [...list].sort((a, b) => b.year - a.year)
  else if (filter.sort === 'oldest') list = [...list].sort((a, b) => a.year - b.year)
  else if (filter.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)

  return list
}

function isDefaultFilter(filter: HomeFilterState) {
  return (
    filter.kind === 'all' &&
    filter.genre === null &&
    filter.sort === 'newest' &&
    filter.scope === 'all'
  )
}

function filterLabel(filter: HomeFilterState): string {
  const parts: string[] = []
  if (filter.kind === 'film') parts.push('فیلم')
  else if (filter.kind === 'series') parts.push('سریال')
  if (filter.genre) parts.push(filter.genre)
  if (filter.scope === 'trending') parts.push('پربازدید')
  if (filter.scope === 'featured') parts.push('ویژه')
  if (filter.sort === 'rating') parts.push('بر اساس امتیاز')
  if (filter.sort === 'oldest') parts.push('قدیمی‌ترین')
  return parts.length ? `نتایج: ${parts.join(' · ')}` : 'نتایج فیلتر'
}

export function HomeContent() {
  const {
    justRelease,
    popularWeek,
    featured,
    featuredSide,
    movies,
    series,
    koreanSeries,
    award,
    popularList,
  } = saintstreamHome

  const genres = useMemo(() => getSaintstreamGenres(), [])
  const catalog = useMemo(() => getAllSaintstreamTitles(), [])
  const [filter, setFilter] = useState<HomeFilterState>(DEFAULT_FILTER)

  const showDefault = isDefaultFilter(filter)
  const filtered = useMemo(() => applyHomeFilter(catalog, filter), [catalog, filter])
  const editors = useMemo(() => {
    const ids = new Set<string>()
    const out: SaintstreamTitle[] = []
    for (const t of [saintstreamHome.featured, ...saintstreamHome.featuredSide, ...saintstreamHome.popularList]) {
      if (ids.has(t.id)) continue
      ids.add(t.id)
      out.push(t)
      if (out.length >= 4) break
    }
    return out
  }, [])

  return (
    <div className="relative z-10 space-y-0 bg-transparent pb-4">
      <HomeFilterBar genres={genres} value={filter} onChange={setFilter} />
      <HomePremiumBanner />

      {showDefault ? (
        <>
          <ContinueWatchingRow />
          <MovieScroller title="تازه منتشر شده" items={justRelease} href="/movies" />
          <NewEpisodesRow />
          <PopularWeekRow items={popularWeek} />
          <FeaturedBanner featured={featured} sidePosters={featuredSide} />
          <MovieScroller title="فیلم‌ها" items={movies} href="/movies" />
          <MovieScroller title="سریال‌ها" items={series} href="/series" />
          <MovieScroller title="سریال‌های آسیایی" items={koreanSeries} href="/series" />
          <HomeBottomGrid award={award} popular={popularList} editors={editors} />
        </>
      ) : (
        <>
          <ContinueWatchingRow />
          <MovieScroller title={filterLabel(filter)} items={filtered} href="/browse" />
          {filtered.length === 0 ? (
            <p className="page-pad page-max pb-16 text-center text-sm text-white/50">
              موردی با این فیلتر پیدا نشد. فیلتر دیگری را امتحان کنید.
            </p>
          ) : null}
          <PopularWeekRow items={popularWeek} />
        </>
      )}
    </div>
  )
}
