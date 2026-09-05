'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'

export function GenreGrid({ genres, movies }: { genres: string[]; movies: Movie[] }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
      {genres.map((name, i) => {
        const count = movies.filter((m) => m.genres.includes(name)).length
        if (!count) return null
        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              href={`/search?q=${encodeURIComponent(name)}`}
              tabIndex={0}
              className="uu-panel block px-4 py-5 outline-none transition-colors hover:bg-[var(--bg-tertiary)] focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              <p className="text-[17px] font-semibold text-white">{name}</p>
              <p className="mt-1 text-footnote">{fa(count)} عنوان</p>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
