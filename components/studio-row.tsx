'use client'

import { fa } from '@/lib/format-fa'
import { studios } from '@/lib/movies'

export function StudioRow() {
  return (
    <section className="reveal">
      <div className="mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white sm:text-xl">استودیوها</h2>
        <p className="text-xs text-muted-foreground">از بهترین سازندگان</p>
      </div>

      <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-8">
        {studios.map((s) => (
          <a
            key={s.id}
            href="#"
            className="group flex w-40 shrink-0 flex-col items-center rounded-lg border border-white/[0.08] bg-card p-4 text-center transition-colors hover:border-primary/40"
          >
            <img
              src={s.logo}
              alt={s.name}
              className="size-16 rounded-lg border border-white/10 object-cover transition-transform group-hover:scale-105"
            />
            <h3 className="mt-3 truncate text-sm font-bold text-white">{s.name}</h3>
            <p className="text-xs text-muted-foreground">{fa(s.titles)} عنوان</p>
          </a>
        ))}
      </div>
    </section>
  )
}
