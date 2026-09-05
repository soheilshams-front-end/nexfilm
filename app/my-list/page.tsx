'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { AnimatedTabs } from '@/components/animated-tabs'
import { CatalogGrid } from '@/components/catalog-grid'
import { resolveTitle, type Movie } from '@/lib/movies'
import { getMyListIds } from '@/lib/user-store'
import { Button } from '@/components/untitled/button'

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
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-lg font-medium text-white">لیست شما خالی است</p>
            <p className="mt-2 max-w-sm text-[15px] text-[var(--fg-tertiary)]">
              محتوای مورد علاقه را به لیست اضافه کنید تا بعداً ببینید.
            </p>
            <Button asChild className="mt-6">
              <Link href="/browse">برو به دسته‌بندی</Link>
            </Button>
          </div>
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
