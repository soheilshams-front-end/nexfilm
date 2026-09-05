import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { CatalogBrowser } from '@/components/catalog-browser'
import { getFilms } from '@/lib/movies'

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>
}) {
  const { genre } = await searchParams
  const films = getFilms()

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />
      <CatalogBrowser
        items={films}
        kindLock="Film"
        title={genre ? `فیلم‌های ${genre}` : 'فیلم‌ها'}
        subtitle="جستجو، فیلتر ژانر و مرور کل آرشیو"
        searchPlaceholder="جستجوی نام فیلم…"
        initialGenre={genre ?? null}
      />
      <SiteFooter />
    </main>
  )
}
