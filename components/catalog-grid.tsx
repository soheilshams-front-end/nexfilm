'use client'

import { Clapperboard } from 'lucide-react'
import type { Movie } from '@/lib/movies'
import { movieToPosterTitle, PosterCard } from '@/components/saintstream/poster-card'
import { EmptyState } from '@/components/empty-state'

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
      <EmptyState
        icon={Clapperboard}
        title={emptyLabel}
        description="عنوان دیگری را امتحان کنید یا به آرشیو سر بزنید."
        actionHref={emptyHref}
        actionLabel={emptyCta}
        className="py-16"
      />
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
