'use client'

import { useEffect, useMemo, useState } from 'react'
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
import { isKidsProfileActive } from '@/lib/user-store'
import { isKidsSafeMaturity } from '@/lib/title-credits'
import { genresMatch, canonicalizeGenre } from '@/lib/genre-canonical'

const DEFAULT_FILTER: HomeFilterState = {
  kind: 'all',
  genre: null,
  sort: 'newest',
  scope: 'all',
}

function applyHomeFilter(
  catalog: SaintstreamTitle[],
  filter: HomeFilterState,
  kidsMode: boolean,
): SaintstreamTitle[] {
  let list = [...catalog]
  if (kidsMode) list = list.filter((t) => isKidsSafeMaturity(t.maturity))

  if (filter.kind === 'film') list = list.filter((t) => t.type === 'Film')
  if (filter.kind === 'series') list = list.filter((t) => t.type === 'Series')
  if (filter.genre) list = list.filter((t) => genresMatch(t.genres, filter.genre!))

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

function kidsSafe(list: SaintstreamTitle[], kids: boolean) {
  return kids ? list.filter((t) => isKidsSafeMaturity(t.maturity)) : list
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

  const [kidsMode, setKidsMode] = useState(false)
  useEffect(() => {
    setKidsMode(isKidsProfileActive())
  }, [])

  const genres = useMemo(
    () => getSaintstreamGenres().map(canonicalizeGenre),
    [],
  )
  const catalog = useMemo(() => getAllSaintstreamTitles(), [])
  const [filter, setFilter] = useState<HomeFilterState>(DEFAULT_FILTER)

  const showDefault = isDefaultFilter(filter)
  const filtered = useMemo(
    () => applyHomeFilter(catalog, filter, kidsMode),
    [catalog, filter, kidsMode],
  )

  const safeJust = useMemo(() => kidsSafe(justRelease, kidsMode), [justRelease, kidsMode])
  const safePopular = useMemo(() => kidsSafe(popularWeek, kidsMode), [popularWeek, kidsMode])
  const safeMovies = useMemo(() => kidsSafe(movies, kidsMode), [movies, kidsMode])
  const safeSeries = useMemo(() => kidsSafe(series, kidsMode), [series, kidsMode])
  const safeKorean = useMemo(() => kidsSafe(koreanSeries, kidsMode), [koreanSeries, kidsMode])
  const safeFeaturedSide = useMemo(() => kidsSafe(featuredSide, kidsMode), [featuredSide, kidsMode])
  const safePopularList = useMemo(() => kidsSafe(popularList, kidsMode), [popularList, kidsMode])
  const safeFeatured =
    kidsMode && !isKidsSafeMaturity(featured.maturity)
      ? safeJust[0] ?? featured
      : featured
  const safeAward =
    kidsMode && !isKidsSafeMaturity(award.maturity) ? safeMovies[0] ?? award : award

  const editors = useMemo(() => {
    const ids = new Set<string>()
    const out: SaintstreamTitle[] = []
    const pool = kidsSafe(
      [saintstreamHome.featured, ...saintstreamHome.featuredSide, ...saintstreamHome.popularList],
      kidsMode,
    )
    for (const t of pool) {
      if (ids.has(t.id)) continue
      ids.add(t.id)
      out.push(t)
      if (out.length >= 4) break
    }
    return out
  }, [kidsMode])

  return (
    <div className="relative z-10 space-y-0 bg-transparent pb-4">
      <HomeFilterBar genres={genres} value={filter} onChange={setFilter} />
      <HomePremiumBanner />

      {showDefault ? (
        <>
          <ContinueWatchingRow />
          <MovieScroller title="تازه منتشر شده" items={safeJust} href="/movies" />
          {!kidsMode ? <NewEpisodesRow /> : null}
          <PopularWeekRow items={safePopular} />
          <FeaturedBanner featured={safeFeatured} sidePosters={safeFeaturedSide} />
          <MovieScroller title="فیلم‌ها" items={safeMovies} href="/movies" />
          <MovieScroller title="سریال‌ها" items={safeSeries} href="/series" />
          <MovieScroller title="سریال‌های آسیایی" items={safeKorean} href="/series" />
          <HomeBottomGrid award={safeAward} popular={safePopularList} editors={editors} />
        </>
      ) : (
        <>
          <ContinueWatchingRow />
          <MovieScroller title={filterLabel(filter)} items={filtered} href="/browse" />
          {filtered.length === 0 ? (
            <div className="page-pad page-max pb-16 text-center">
              <p className="text-white/60">نتیجه‌ای پیدا نشد.</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
