'use client'

import { genreTiles } from '@/lib/movies'

export function GenreTiles() {
  return (
    <section className="reveal">
      <div className="mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white sm:text-xl">کاوش بر اساس ژانر</h2>
        <p className="text-xs text-muted-foreground">حال و هوای مورد علاقه‌ات را پیدا کن</p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:grid-cols-6 lg:px-8">
        {genreTiles.map((g) => (
          <a
            key={g.id}
            href="#"
            className="group relative h-28 overflow-hidden rounded-lg border border-white/[0.08] sm:h-32"
          >
            <img
              src={g.poster}
              alt={g.label}
              className="absolute inset-0 size-full object-cover opacity-60 transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${g.accent}40, transparent 70%)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-semibold text-white drop-shadow-lg">{g.label}</span>
            </div>
            <span className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/0 transition-all group-hover:ring-primary/50" />
          </a>
        ))}
      </div>
    </section>
  )
}
