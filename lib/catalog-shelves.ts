import type { Movie } from '@/lib/movies'
import type { SaintstreamTitle } from '@/lib/saintstream-home'

/** Map Movie → shape used by FeaturedBanner / Saintstream shelves */
export function movieToSaintstreamTitle(movie: Movie): SaintstreamTitle {
  const displayTitle = movie.titleEn || movie.title
  return {
    id: movie.id,
    titleEn: displayTitle,
    titleFa: displayTitle,
    poster: movie.poster,
    backdrop: movie.backdrop,
    year: movie.year,
    rating: movie.rating,
    maturity: movie.maturity,
    duration: movie.duration,
    genres: movie.genres,
    description: movie.description,
    type: movie.type,
    rank: movie.rank,
  }
}

export function pickTopRated(items: Movie[]): Movie | null {
  if (!items.length) return null
  return [...items].sort((a, b) => b.rating - a.rating)[0]
}

export function pickNewest(items: Movie[], count = 12): Movie[] {
  return [...items]
    .sort((a, b) => {
      if (Boolean(b.isNew) !== Boolean(a.isNew)) return Number(b.isNew) - Number(a.isNew)
      return b.year - a.year
    })
    .slice(0, count)
}

export function pickPopular(items: Movie[], count = 12): Movie[] {
  return [...items]
    .sort((a, b) => {
      const ra = a.rank ?? 999
      const rb = b.rank ?? 999
      if (ra !== rb) return ra - rb
      return b.match - a.match || b.rating - a.rating
    })
    .slice(0, count)
}

export function pickByGenre(items: Movie[], genre: string, count = 12): Movie[] {
  const matched = items.filter((m) => m.genres.some((g) => g.includes(genre)))
  return (matched.length ? matched : items).slice(0, count)
}
