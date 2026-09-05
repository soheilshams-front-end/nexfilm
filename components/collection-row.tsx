'use client'

import Link from 'next/link'
import { fa } from '@/lib/format-fa'
import { collections } from '@/lib/movies'
import { Film, ChevronLeft } from 'lucide-react'

export function CollectionRow() {
  return (
    <section className="reveal">
      <div className="mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white sm:text-xl">مجموعه‌های منتخب</h2>
        <p className="text-xs text-muted-foreground">دست‌چین‌شده توسط تیم نکس فیلم</p>
      </div>

      <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-8">
        {collections.map((c) => (
          <Link
            key={c.id}
            href="#"
            className="group relative block h-48 w-72 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] sm:h-56 sm:w-80"
          >
            <img
              src={c.cover}
              alt={c.title}
              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: `linear-gradient(135deg, ${c.accent}, transparent)` }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <span className="inline-flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-[11px] font-medium text-primary">
                <Film className="size-3" />
                {fa(c.count)} عنوان
              </span>
              <h3 className="mt-2 text-2xl font-bold text-white">{c.title}</h3>
              <p className="text-sm text-white/70">{c.subtitle}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                مشاهده مجموعه
                <ChevronLeft className="size-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
