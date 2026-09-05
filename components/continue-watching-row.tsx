'use client'

import { useEffect, useState } from 'react'
import { resolveTitle } from '@/lib/movies'
import { getContinueWatching, type ContinueItem } from '@/lib/user-store'
import { movieToPosterTitle, PosterCard } from '@/components/saintstream/poster-card'
import { ShelfSection, ShelfTrack, useShelfScroller } from '@/components/shelf-section'

type ContinueCard = {
  item: ContinueItem
  poster: ReturnType<typeof movieToPosterTitle>
  href: string
}

export function ContinueWatchingRow() {
  const [cards, setCards] = useState<ContinueCard[]>([])
  const { scroller, onKeyDown, scrollByDir } = useShelfScroller()

  useEffect(() => {
    const items = getContinueWatching()
    const next: ContinueCard[] = []
    for (const item of items) {
      const movie = resolveTitle(item.movieId)
      if (!movie) continue
      const href =
        movie.type === 'Series' && item.seasonId != null && item.episodeId != null
          ? `/watch/${item.movieId}?s=${item.seasonId}&e=${item.episodeId}`
          : `/watch/${item.movieId}`
      next.push({
        item,
        poster: movieToPosterTitle(movie),
        href,
      })
    }
    setCards(next)
  }, [])

  if (!cards.length) return null

  return (
    <ShelfSection title="ادامه تماشا" href="/profile/history">
      <ShelfTrack
        scrollerRef={scroller}
        label="ادامه تماشا"
        onKeyDown={onKeyDown}
        onScrollStart={() => scrollByDir('start')}
        onScrollEnd={() => scrollByDir('end')}
      >
        {cards.map(({ item, poster, href }) => (
          <PosterCard
            key={`${item.movieId}-${item.seasonId ?? 0}-${item.episodeId ?? 0}`}
            title={poster}
            progress={item.progress}
            href={href}
          />
        ))}
      </ShelfTrack>
    </ShelfSection>
  )
}
