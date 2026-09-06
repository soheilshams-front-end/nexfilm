'use client'

import { AlertCircle } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/untitled/button'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-black">
      <SiteNav />
      <div className="flex flex-col items-center justify-center px-4 py-28 text-center anim-fade-up">
        <div className="grid size-[4.5rem] place-items-center rounded-full bg-white/[0.06] text-white/50 ring-1 ring-white/10">
          <AlertCircle className="size-8" />
        </div>
        <p className="mt-5 text-lg font-semibold text-white">یک مشکل پیش آمد</p>
        <p className="mt-2 max-w-sm text-[14px] leading-6 text-white/50">
          صفحه بارگذاری نشد. دوباره تلاش کنید یا به خانه برگردید.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onPress={reset}>
            تلاش دوباره
          </Button>
          <Button asChild variant="secondary">
            <a href="/">خانه</a>
          </Button>
        </div>
      </div>
      <SiteFooter />
    </main>
  )
}
