'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Check } from 'lucide-react'
import { isInMyList, toggleMyList } from '@/lib/user-store'
import { useToast } from '@/components/toast-provider'
import { LikeButton } from '@/components/like-button'
import { Button } from '@/components/untitled/button'

export function DetailActions({ movieId, watchHref }: { movieId: string; watchHref: string }) {
  const [inList, setInList] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setInList(isInMyList(movieId))
  }, [movieId])

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={() => {
          const next = toggleMyList(movieId)
          setInList(next)
          toast(next ? 'به لیست من اضافه شد' : 'از لیست من حذف شد')
        }}
      >
        {inList ? <Check className="size-4" /> : <Plus className="size-4" />}
        {inList ? 'در لیست' : 'لیست من'}
      </Button>
      <LikeButton movieId={movieId} />
    </div>
  )
}
