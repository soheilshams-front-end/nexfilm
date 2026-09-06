import { getAllTitles } from '@/lib/movies'
import { SearchResults } from '@/components/search-results'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const term = q.trim()
  const lower = term.toLowerCase()
  const catalog = getAllTitles()

  const results = term
    ? catalog.filter(
        (m) =>
          m.title.toLowerCase().includes(lower) ||
          m.titleEn.toLowerCase().includes(lower) ||
          m.genres.some((g) => g.toLowerCase().includes(lower)) ||
          m.cast.some((c) => c.toLowerCase().includes(lower)) ||
          m.director.toLowerCase().includes(lower) ||
          m.description.toLowerCase().includes(lower),
      )
    : []

  const suggestions = [...catalog].sort((a, b) => b.rating - a.rating).slice(0, 12)

  return <SearchResults term={term} results={results} suggestions={suggestions} />
}
