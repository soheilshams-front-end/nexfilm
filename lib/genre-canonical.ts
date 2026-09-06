/** Canonical Persian genre labels used across browse + catalog filters */

const ALIASES: Record<string, string> = {
  'علمی-تخیلی': 'علمی‌تخیلی',
  'علمی تخیلی': 'علمی‌تخیلی',
  هیجان: 'هیجان‌انگیز',
}

export function canonicalizeGenre(genre: string): string {
  return ALIASES[genre] ?? genre
}

export function canonicalizeGenres(genres: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const g of genres) {
    const c = canonicalizeGenre(g)
    if (seen.has(c)) continue
    seen.add(c)
    out.push(c)
  }
  return out
}

export function genresMatch(titleGenres: string[], filterGenre: string): boolean {
  const want = canonicalizeGenre(filterGenre)
  return titleGenres.some((g) => canonicalizeGenre(g) === want)
}
