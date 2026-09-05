'use client'

import { useEffect, useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toggleLike, toggleDislike } from '@/lib/user-store'
import { useToast } from '@/components/toast-provider'

export function LikeButton({
  movieId,
  className,
  size = 'md',
}: {
  movieId: string
  className?: string
  size?: 'sm' | 'md'
}) {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const toast = useToast()
  const iconSize = size === 'sm' ? 'size-3.5' : 'size-4'
  const btnSize = size === 'sm' ? 'size-8' : 'size-9'

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem('nextfilm-user-state')
    if (!raw) return
    try {
      const s = JSON.parse(raw)
      const pid = s.activeProfileId
      setLiked((s.likes?.[pid] ?? []).includes(movieId))
      setDisliked((s.dislikes?.[pid] ?? []).includes(movieId))
    } catch {
      /* ignore */
    }
  }, [movieId])

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const state = toggleLike(movieId)
          setLiked(state === 'like')
          setDisliked(false)
          toast(state === 'like' ? 'پسندیدید' : 'پسند برداشته شد')
        }}
        className={cn(
          'grid place-items-center rounded-full border border-white/30 bg-black/40 text-white transition-colors hover:bg-white/10',
          btnSize,
          liked && 'border-white bg-white/15',
        )}
        aria-label="پسندیدم"
      >
        <ThumbsUp className={iconSize} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const d = toggleDislike(movieId)
          setDisliked(d)
          if (d) setLiked(false)
          toast(d ? 'برای شما پیشنهاد نمی‌شود' : 'علامت برداشته شد')
        }}
        className={cn(
          'grid place-items-center rounded-full border border-white/30 bg-black/40 text-white transition-colors hover:bg-white/10',
          btnSize,
          disliked && 'border-white/50 bg-white/10',
        )}
        aria-label="برای من نیست"
      >
        <ThumbsDown className={iconSize} />
      </button>
    </div>
  )
}
