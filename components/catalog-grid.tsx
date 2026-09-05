'use client'

import Link from 'next/link'
import type { Movie } from '@/lib/movies'
import { movieToPosterTitle, PosterCard } from '@/components/saintstream/poster-card'
import { Button } from '@/components/untitled/button'

export function CatalogGrid({
  items,
  emptyLabel = 'عنوانی پیدا نشد',
  emptyHref = '/browse',
  emptyCta = 'برو به دسته‌بندی',
}: {
  items: Movie[]
  emptyLabel?: string
  emptyHref?: string
  emptyCta?: string
}) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <p className="text-lg font-medium text-white">{emptyLabel}</p>
        <Button asChild className="mt-6">
          <Link href={emptyHref}>{emptyCta}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 gap-y-3 sm:grid-cols-3 sm:gap-x-3 sm:gap-y-5 md:grid-cols-4 md:gap-x-4 md:gap-y-7 lg:grid-cols-5 xl:grid-cols-6 lg:gap-x-5 lg:gap-y-8">
      {items.map((movie) => (
        <PosterCard
          key={movie.id}
          title={movieToPosterTitle(movie)}
          className="!w-full max-w-none"
          widthClass="w-full"
        />
      ))}
    </div>
  )
}
