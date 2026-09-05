'use client'

import { useEffect, useState } from 'react'
import { MovieGrid } from '@/components/dashboard/movie-grid'
import { getBecauseYouLikedRows } from '@/lib/taste'
import type { Movie } from '@/lib/movies'

export function RecommendationsContent() {
  const [rows, setRows] = useState<{ title: string; movies: Movie[] }[]>([])
  const [fallback, setFallback] = useState<Movie[]>([])

  useEffect(() => {
    const because = getBecauseYouLikedRows()
    setRows(because)
    if (!because.length) {
      import('@/lib/movies').then(({ getTopRated }) => setFallback(getTopRated(8)))
    }
  }, [])

  if (rows.length) {
    return (
      <div className="space-y-10">
        {rows.map((row) => (
          <section key={row.title}>
            <h3 className="mb-4 text-lg font-semibold text-white">{row.title}</h3>
            <MovieGrid movies={row.movies} />
          </section>
        ))}
      </div>
    )
  }

  return <MovieGrid movies={fallback} />
}
