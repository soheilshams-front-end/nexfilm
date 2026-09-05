import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { CatalogBrowser } from '@/components/catalog-browser'
import { getSeries } from '@/lib/movies'

export default async function SeriesListPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>
}) {
  const { genre } = await searchParams
  const series = getSeries()

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />
      <CatalogBrowser
        items={series}
        kindLock="Series"
        title={genre ? `سریال‌های ${genre}` : 'سریال‌ها'}
        subtitle="جستجو، فیلتر ژانر و مرور کل آرشیو"
        searchPlaceholder="جستجوی نام سریال…"
        initialGenre={genre ?? null}
      />
      <SiteFooter />
    </main>
  )
}
