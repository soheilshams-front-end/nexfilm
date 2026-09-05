'use client'

import { useState } from 'react'
import { fa } from '@/lib/format-fa'
import { getReviews } from '@/lib/movies'
import { Star, ThumbsUp, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Reviews — user review cards with ratings, helpful votes, and expand.
 */
export function ReviewsSection({ titleId }: { titleId?: string }) {
  const reviews = getReviews(titleId)
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!reviews.length) return null

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <section className="reveal">
      <div className="mb-4 flex items-end justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">نظرات کاربران</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{fa(reviews.length)} نظر ثبت شده</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-1.5">
            <Star className="size-4 fill-primary text-primary" />
            <span className="font-display text-lg font-bold">{fa(avg.toFixed(1))}</span>
            <span className="text-xs text-muted-foreground">/ ۱۰</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-10">
        {reviews.map((r, i) => {
          const isOpen = expanded === r.id
          return (
            <div
              key={r.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="reveal-scale flex flex-col rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30"
            >
              <div className="flex items-center gap-3">
                <img src={r.avatar} alt={r.author} className="size-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{r.author}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-sm font-bold text-primary">
                  <Star className="size-3.5 fill-primary" />
                  {fa(r.rating)}
                </div>
              </div>

              <p className={cn('mt-3 text-sm leading-relaxed text-foreground/80', !isOpen && 'line-clamp-3')}>
                {r.content}
              </p>
              {r.content.length > 100 && (
                <button
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                  className="mt-2 w-fit text-xs font-semibold text-primary"
                >
                  {isOpen ? 'نمایش کمتر' : 'ادامه مطلب'}
                </button>
              )}

              <div className="mt-4 flex items-center gap-4 border-t border-border/40 pt-3 text-xs text-muted-foreground">
                <button className="flex items-center gap-1.5 transition-colors hover:text-primary">
                  <ThumbsUp className="size-3.5" />
                  مفید ({fa(r.helpful)})
                </button>
                <button className="flex items-center gap-1.5 transition-colors hover:text-primary">
                  <MessageSquare className="size-3.5" />
                  پاسخ
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
