'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'motion/react'
import { BrandMark } from '@/components/brand-logo'
import { RequireAuth } from '@/components/require-auth'
import { getProfiles, setActiveProfile, type Profile } from '@/lib/user-store'
import { cn } from '@/lib/utils'

export default function ProfilesPage() {
  return (
    <RequireAuth>
      <ProfilesContent />
    </RequireAuth>
  )
}

function ProfilesContent() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    setProfiles(getProfiles())
  }, [])

  const select = (id: string) => {
    setActiveProfile(id)
    router.push('/')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 pb-20">
      <motion.div
        className="w-full max-w-4xl text-center"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex flex-col items-center gap-2">
          <BrandMark size={48} />
          <p className="text-[17px] font-semibold text-[var(--brand)]">نکس‌فیلم</p>
        </div>
        <h1 className="mt-4 text-large-title text-white md:text-[2.75rem]">چه کسی تماشا می‌کند؟</h1>

        <div className="mt-14 flex flex-wrap justify-center gap-8 sm:gap-10">
          {profiles.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => select(p.id)}
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="group flex flex-col items-center gap-4 rounded-2xl outline-none"
            >
              <span
                className={cn(
                  'size-28 overflow-hidden rounded-[22px] bg-[var(--bg-secondary)] sm:size-32',
                  p.isKids && 'ring-2 ring-[var(--brand)]/50',
                )}
              >
                <img src={p.avatar} alt="" className="size-full object-cover" />
              </span>
              <span className="text-[17px] font-medium text-white/55 transition-colors group-hover:text-white">
                {p.name}
              </span>
            </motion.button>
          ))}

          <Link
            href="/profiles/manage"
            className="group flex flex-col items-center gap-4 rounded-2xl outline-none"
          >
            <span className="grid size-28 place-items-center rounded-[22px] bg-[var(--bg-secondary)] text-4xl text-white/35 transition-colors group-hover:text-white sm:size-32">
              +
            </span>
            <span className="text-[17px] font-medium text-white/55 group-hover:text-white">مدیریت</span>
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
