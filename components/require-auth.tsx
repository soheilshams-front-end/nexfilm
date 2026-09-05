'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/lib/user-store'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login')
      return
    }
    setOk(true)
  }, [router])

  if (!ok) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--bg)] text-sm text-[var(--fg-tertiary)]">
        در حال بررسی ورود…
      </div>
    )
  }

  return <>{children}</>
}
