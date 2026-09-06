'use client'

import { useEffect, useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { AnimatedTabs } from '@/components/animated-tabs'
import { CatalogGrid } from '@/components/catalog-grid'
import { resolveTitle, type Movie } from '@/lib/movies'
import { getMyListIds } from '@/lib/user-store'
import { Bookmark } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'

export default function MyListPage() {
  const [items, setItems] = useState<Movie[]>([])

  useEffect(() => {
    const ids = getMyListIds()
    setItems(ids.map((id) => resolveTitle(id)).filter((m): m is Movie => Boolean(m)))
  }, [])

  const movies = items.filter((m) => m.type === 'Film')
  const series = items.filter((m) => m.type === 'Series')

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />
      <PageHero title="لیست من" subtitle="عناوینی که برای بعد ذخیره کرده‌اید" />

      <div className="page-max page-pad mt-6 pb-12">
        {items.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="لیست شما خالی است"
            description="محتوای مورد علاقه را به لیست اضافه کنید تا بعداً ببینید."
            actionHref="/browse"
            actionLabel="برو به دسته‌بندی"
          />
        ) : (
          <AnimatedTabs
            tabs={[
              {
                label: 'همه',
                content: <CatalogGrid items={items} emptyHref="/browse" emptyCta="برو به دسته‌بندی" />,
              },
              {
                label: 'فیلم‌ها',
                content: (
                  <CatalogGrid
                    items={movies}
                    emptyLabel="فیلمی در لیست نیست"
                    emptyHref="/movies"
                    emptyCta="برو به فیلم‌ها"
                  />
                ),
              },
              {
                label: 'سریال‌ها',
                content: (
                  <CatalogGrid
                    items={series}
                    emptyLabel="سریالی در لیست نیست"
                    emptyHref="/series"
                    emptyCta="برو به سریال‌ها"
                  />
                ),
              },
            ]}
          />
        )}
      </div>
      <SiteFooter />
    </main>
  )
}
