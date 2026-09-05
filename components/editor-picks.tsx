'use client'

import Link from 'next/link'
import { Quote, Play } from 'lucide-react'
import { fa } from '@/lib/format-fa'
import { getEditorPicks } from '@/lib/movies'

export function EditorPicks() {
  const picks = getEditorPicks()
  if (!picks.length) return null

  return (
    <section className="reveal space-y-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
          <Quote className="size-4" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">انتخاب سردبیر</h2>
          <p className="text-xs text-muted-foreground">دست‌چین‌شده توسط تیم نکس فیلم</p>
        </div>
      </div>

      {picks.map(({ movie, note }, i) => (
        <Link
          key={movie.id}
          href={`/movie/${movie.id}`}
          className="group relative block h-48 overflow-hidden rounded-lg border border-white/[0.08] sm:h-56"
        >
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex items-center p-6 sm:p-8">
            <div className="max-w-md">
              <span className="inline-flex items-center gap-1 rounded bg-primary/20 px-2.5 py-1 text-xs font-semibold text-primary">
                <Quote className="size-3" />
                انتخاب {fa(i + 1)}
              </span>
              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{movie.title}</h3>
              <p className="mt-2 text-sm italic text-white/80">«{note}»</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white">
                <Play className="size-4 fill-current" />
                تماشا
              </span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  )
}
