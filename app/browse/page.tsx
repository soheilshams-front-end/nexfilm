import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { BrowseGenres, type GenreCardData } from '@/components/browse-genres'
import { fa } from '@/lib/format-fa'
import { getAllTitles, resolveTitle } from '@/lib/movies'
import { GENRE_SHOWCASE } from '@/lib/genre-showcase'
import { genresMatch } from '@/lib/genre-canonical'
import { Button } from '@/components/untitled/button'

function buildGenreCards(): GenreCardData[] {
  const titles = getAllTitles()
  const cards: GenreCardData[] = []

  for (const row of GENRE_SHOWCASE) {
    const featured = resolveTitle(row.titleId)
    if (!featured) continue
    const inGenre = titles.filter((m) => genresMatch(m.genres, row.genre))
    const seriesCount = inGenre.filter((m) => m.type === 'Series').length
    const filmCount = inGenre.length - seriesCount
    const hrefBase = seriesCount > filmCount ? '/series' : '/movies'
    cards.push({
      name: row.genre,
      count: Math.max(1, inGenre.length),
      titleFa: featured.title,
      titleEn: featured.titleEn,
      poster: featured.poster,
      backdrop: featured.backdrop || featured.poster,
      movieId: featured.id,
      labelEn: row.labelEn,
      href: `${hrefBase}?genre=${encodeURIComponent(row.genre)}`,
    })
  }

  return cards
}

export default function BrowsePage() {
  const cards = buildGenreCards()

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />

      <div className="page-max page-pad pb-12 pt-20 sm:pt-24 md:pb-20 md:pt-32">
        <header className="mb-3.5 flex min-w-0 flex-col gap-2 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-5">
          <div>
            <p className="text-[12px] font-semibold text-[var(--brand)] md:text-[13px]">نکس‌فیلم</p>
            <h1 className="mt-1 text-[1.25rem] font-bold tracking-tight text-white md:mt-2 md:text-[2.75rem] md:leading-none">
              دسته‌بندی
            </h1>
            <p className="mt-2 max-w-lg text-[13px] leading-6 text-[var(--fg-tertiary)] md:mt-3 md:text-[15px] md:leading-7">
              هر ژانر به آرشیو فیلم یا سریال همان دسته لینک می‌شود.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[12px] font-semibold tabular-nums text-white/70 ring-1 ring-white/10 md:px-3 md:py-1.5 md:text-[13px]">
              {fa(cards.length)} ژانر
            </span>
            <Button asChild variant="secondary" size="sm" className="hidden rounded-full sm:inline-flex">
              <Link href="/movies">فیلم‌ها</Link>
            </Button>
            <Button asChild variant="secondary" size="sm" className="hidden rounded-full sm:inline-flex">
              <Link href="/series">سریال‌ها</Link>
            </Button>
          </div>
        </header>

        <BrowseGenres genres={cards} />
      </div>

      <SiteFooter />
    </main>
  )
}
