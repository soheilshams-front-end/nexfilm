'use client'

import type { SaintstreamTitle } from '@/lib/saintstream-home'
import {
  movieToPosterTitle,
  PosterCard,
  type PosterCardTitle,
} from '@/components/saintstream/poster-card'
import type { Movie } from '@/lib/movies'
import { ShelfSection, ShelfTrack, useShelfScroller } from '@/components/shelf-section'

export function MovieScroller({
  title,
  items,
  href = '/movies',
}: {
  title: string
  items: Array<SaintstreamTitle | PosterCardTitle | Movie>
  href?: string
}) {
  const { scroller, onKeyDown, scrollByDir } = useShelfScroller()
  if (!items.length) return null

  return (
    <ShelfSection title={title} href={href}>
      <ShelfTrack
        scrollerRef={scroller}
        label={title}
        onKeyDown={onKeyDown}
        onScrollStart={() => scrollByDir('start')}
        onScrollEnd={() => scrollByDir('end')}
      >
        {items.map((item) => {
          const poster = 'titleFa' in item ? item : movieToPosterTitle(item as Movie)
          return <PosterCard key={poster.id} title={poster} />
        })}
      </ShelfTrack>
    </ShelfSection>
  )
}
