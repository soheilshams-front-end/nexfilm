import {
  getAllTitles,
  getRecentlyAdded,
  getSeries,
  getSimilar,
  getTopRated,
  resolveTitle,
  type Movie,
} from '@/lib/movies'
import { getLikedIds, getContinueWatching } from '@/lib/user-store'

export type HomeRowConfig = {
  id: string
  title: string
  subtitle?: string
  icon?: string
  movieIds: string[]
  showProgress?: boolean
  variant?: 'default' | 'wide'
}

function idsByGenre(genre: string, count = 8): string[] {
  return getAllTitles()
    .filter((m) => m.genres.includes(genre))
    .slice(0, count)
    .map((m) => m.id)
}

function filmsOnly(list: Movie[], count: number): string[] {
  return list.filter((m) => m.type === 'Film').slice(0, count).map((m) => m.id)
}

/** Intentional home row order — only include rows that have real data. */
export function getPersonalizedHomeRows(): HomeRowConfig[] {
  const liked = typeof window !== 'undefined' ? getLikedIds() : []
  const continueItems = typeof window !== 'undefined' ? getContinueWatching() : []
  const rows: HomeRowConfig[] = []

  if (continueItems.length) {
    rows.push({
      id: 'continue',
      title: 'ادامه تماشا',
      movieIds: continueItems.map((c) => c.movieId),
      showProgress: true,
      variant: 'wide',
    })
  }

  const recommended = liked.length
    ? getSimilarToLikes(liked, 10).map((m) => m.id)
    : filmsOnly(getTopRated(12), 10)
  if (recommended.length) {
    rows.push({
      id: 'recommended',
      title: 'پیشنهاد شده برای شما',
      subtitle: 'بر اساس سلیقه و امتیاز کاربران',
      movieIds: recommended,
    })
  }

  const trending = [
    'dune-part-two',
    'oppenheimer',
    'stranger-things',
    'the-boys',
    'shogun',
    'arcane',
  ].filter((id) => resolveTitle(id))
  if (trending.length) {
    rows.push({
      id: 'trending',
      title: 'داغ‌ترین‌ها',
      movieIds: trending,
    })
  }

  const popularMovies = filmsOnly(getTopRated(14), 10)
  if (popularMovies.length) {
    rows.push({
      id: 'popular-movies',
      title: 'محبوب‌ترین فیلم‌ها',
      movieIds: popularMovies,
    })
  }

  const popularSeries = getSeries().slice(0, 10).map((m) => m.id)
  if (popularSeries.length) {
    rows.push({
      id: 'popular-series',
      title: 'محبوب‌ترین سریال‌ها',
      movieIds: popularSeries,
    })
  }

  const fresh = getRecentlyAdded(10).map((m) => m.id)
  if (fresh.length) {
    rows.push({
      id: 'new',
      title: 'تازه‌ها',
      movieIds: fresh,
    })
  }

  if (liked.length) {
    const anchor = resolveTitle(liked[0])
    if (anchor) {
      const because = getSimilar(anchor.id, 8).map((m) => m.id)
      if (because.length) {
        rows.push({
          id: 'because',
          title: `چون «${anchor.title}» را دوست داشتید`,
          movieIds: because,
        })
      }
    }
  }

  const topGenre = liked.length ? resolveTitle(liked[0])?.genres[0] : 'درام'
  if (topGenre) {
    const genreIds = idsByGenre(topGenre, 8)
    if (genreIds.length >= 4) {
      rows.push({
        id: `genre-${topGenre}`,
        title: topGenre,
        movieIds: genreIds,
      })
    }
  }

  return rows
}

function getSimilarToLikes(likedIds: string[], count: number): Movie[] {
  const genres = new Set<string>()
  likedIds.forEach((id) => resolveTitle(id)?.genres.forEach((g) => genres.add(g)))
  return getAllTitles()
    .filter((m) => !likedIds.includes(m.id))
    .sort((a, b) => {
      const aScore = a.genres.filter((g) => genres.has(g)).length
      const bScore = b.genres.filter((g) => genres.has(g)).length
      return bScore - aScore || b.rating - a.rating
    })
    .slice(0, count)
}

export function surprisePick(): Movie {
  const liked = typeof window !== 'undefined' ? getLikedIds() : []
  const pool = liked.length ? getSimilarToLikes(liked, 20) : getTopRated(20)
  return pool[Math.floor(Math.random() * pool.length)] ?? getAllTitles()[0]
}
