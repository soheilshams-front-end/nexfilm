'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Crown } from 'lucide-react'
import { hasPremiumAccess } from '@/lib/user-store'
import { Button } from '@/components/untitled/button'

export function HomePremiumBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(!hasPremiumAccess())
  }, [])

  if (!show) return null

  return (
    <div className="page-max page-pad pb-2 pt-1">
      <div className="flex flex-col items-start gap-3 rounded-2xl bg-[var(--brand)]/10 px-4 py-3.5 ring-1 ring-[var(--border-brand)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--brand)]/20 text-[var(--brand)]">
            <Crown className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">کیفیت بالاتر با اشتراک</p>
            <p className="mt-0.5 text-xs leading-5 text-[var(--fg-tertiary)]">
              تماشا رایگان بماند؛ ۱۰۸۰/۴K و زیرنویس اختصاصی با پرمیوم.
            </p>
          </div>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/subscription">مشاهده اشتراک</Link>
        </Button>
      </div>
    </div>
  )
}
