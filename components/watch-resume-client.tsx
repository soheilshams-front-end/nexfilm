'use client'

import { useMemo } from 'react'
import type { Movie } from '@/lib/movies'
import { VideoPlayer } from '@/components/video-player'
import { getContinueWatching } from '@/lib/user-store'

export function WatchResumeClient({
  movie,
  playbackUrl,
  nextEpisode,
  seasonId,
  episodeId,
}: {
  movie: Movie
  playbackUrl: string
  nextEpisode?: { title: string; href: string }
  seasonId?: number
  episodeId?: number
}) {
  const resumeSeconds = useMemo(() => {
    const item = getContinueWatching().find((c) => c.movieId === movie.id)
    if (!item) return undefined
    if (seasonId != null && item.seasonId != null && item.seasonId !== seasonId) return undefined
    if (episodeId != null && item.episodeId != null && item.episodeId !== episodeId) return undefined
    return item.seconds
  }, [movie.id, seasonId, episodeId])

  return (
    <VideoPlayer
      movie={{ ...movie, progress: resumeSeconds ? undefined : movie.progress }}
      playbackUrl={playbackUrl}
      nextEpisode={nextEpisode}
      seasonId={seasonId}
      episodeId={episodeId}
      resumeSeconds={resumeSeconds}
      compact
    />
  )
}
