'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Dices, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { surprisePick } from '@/lib/recommendations'
import type { Movie } from '@/lib/movies'
import { fa } from '@/lib/format-fa'

export function SurpriseMe() {
  const [revealed, setRevealed] = useState<Movie | null>(null)
  const [spinning, setSpinning] = useState(false)

  const pick = () => {
    setSpinning(true)
    setRevealed(null)
    setTimeout(() => {
      setRevealed(surprisePick())
      setSpinning(false)
    }, 900)
  }

  return (
    <section className="reveal px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-white/[0.08] bg-surface p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Sparkles className="size-5 text-primary" />
            برای من چی ببینم؟
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            بر اساس ژانر، تاریخچه و پسندهای شما — یک انتخاب تصادفی
          </p>
        </div>
        <button
          onClick={pick}
          disabled={spinning}
          className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          <Dices className={`size-4 ${spinning ? 'animate-spin' : ''}`} />
          {spinning ? 'در حال انتخاب...' : 'شانسی انتخاب کن 🎲'}
        </button>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4"
          >
            <img
              src={revealed.poster}
              alt=""
              className="size-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-xs text-primary">پیشنهاد شما</p>
              <h3 className="text-lg font-bold text-white">{revealed.title}</h3>
              <p className="text-sm text-muted-foreground">
                {fa(revealed.year)} • ⭐ {fa(revealed.rating.toFixed(1))}
              </p>
            </div>
            <Link
              href={`/watch/${revealed.id}`}
              className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              تماشا
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
