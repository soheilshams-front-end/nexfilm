'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Bookmark,
  Crown,
  List,
  PlayCircle,
  Settings,
  Users,
} from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { RequireAuth } from '@/components/require-auth'
import { Button } from '@/components/untitled/button'
import { Card } from '@/components/untitled/card'
import { CatalogGrid } from '@/components/catalog-grid'
import { resolveTitle, type Movie } from '@/lib/movies'
import {
  getAccountEmail,
  getActiveProfile,
  getContinueWatching,
  getMyListIds,
  hasPremiumAccess,
} from '@/lib/user-store'

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileDashboard />
    </RequireAuth>
  )
}

function ProfileDashboard() {
  const [name, setName] = useState('کاربر')
  const [avatar, setAvatar] = useState('/avatars/user.webp')
  const [email, setEmail] = useState<string | null>(null)
  const [premium, setPremium] = useState(false)
  const [continueMovies, setContinueMovies] = useState<Movie[]>([])
  const [listMovies, setListMovies] = useState<Movie[]>([])

  useEffect(() => {
    const profile = getActiveProfile()
    if (profile) {
      setName(profile.name)
      setAvatar(profile.avatar)
    }
    setEmail(getAccountEmail())
    setPremium(hasPremiumAccess())

    const continueNext: Movie[] = []
    for (const c of getContinueWatching()) {
      const m = resolveTitle(c.movieId)
      if (m) continueNext.push({ ...m, progress: c.progress })
    }
    setContinueMovies(continueNext.slice(0, 6))

    setListMovies(
      getMyListIds()
        .map((id) => resolveTitle(id))
        .filter((m): m is Movie => Boolean(m))
        .slice(0, 6),
    )
  }, [])

  const shortcuts = [
    { href: '/profile/continue-watching', label: 'ادامه تماشا', icon: PlayCircle },
    { href: '/profile/watchlist', label: 'لیست من', icon: Bookmark },
    { href: '/profiles', label: 'تعویض پروفایل', icon: Users },
    { href: '/profile/settings', label: 'تنظیمات', icon: Settings },
  ]

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />
      <DashboardShell>
        <PageHeader title="حساب من" subtitle="مرکز کنترل پروفایل، لیست و اشتراک" />

        <Card className="mb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <img
              src={avatar}
              alt=""
              className="size-20 rounded-2xl object-cover ring-1 ring-white/10 sm:size-24"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-white sm:text-2xl">{name}</h2>
                <span
                  className={
                    premium
                      ? 'inline-flex items-center gap-1 rounded-full bg-[var(--brand)] px-2.5 py-0.5 text-[11px] font-bold text-white'
                      : 'rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-white/80'
                  }
                >
                  {premium ? (
                    <>
                      <Crown className="size-3" />
                      پرمیوم
                    </>
                  ) : (
                    'رایگان'
                  )}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--fg-tertiary)]">{email || 'ایمیل ثبت نشده'}</p>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-white">
                {premium ? 'اشتراک شما فعال است' : 'ارتقا به پرمیوم'}
              </p>
              <p className="mt-1 text-sm text-[var(--fg-tertiary)]">
                {premium
                  ? 'کیفیت بالاتر و زیرنویس اختصاصی در دسترس است.'
                  : 'تماشای پایه رایگان است؛ ۱۰۸۰/۴K با اشتراک.'}
              </p>
            </div>
            <Button asChild>
              <Link href={premium ? '/profile/subscription' : '/subscription'}>
                {premium ? 'مدیریت اشتراک' : 'مشاهده پلن‌ها'}
              </Link>
            </Button>
          </div>
        </Card>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shortcuts.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-start gap-3 rounded-xl bg-[var(--bg-secondary)] p-4 ring-1 ring-white/10 transition-colors hover:bg-[var(--bg-tertiary)]"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-[var(--brand)]/15 text-[var(--brand)]">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-semibold text-white">{label}</span>
            </Link>
          ))}
        </div>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">ادامه تماشا</h3>
            <Link
              href="/profile/continue-watching"
              className="text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              همه
            </Link>
          </div>
          {continueMovies.length ? (
            <CatalogGrid items={continueMovies} />
          ) : (
            <EmptyHint href="/browse" label="شروع تماشا از دسته‌بندی" />
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <List className="size-5" />
              لیست من
            </h3>
            <Link
              href="/profile/watchlist"
              className="text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              همه
            </Link>
          </div>
          {listMovies.length ? (
            <CatalogGrid items={listMovies} />
          ) : (
            <EmptyHint href="/browse" label="افزودن به لیست از مرور" />
          )}
        </section>
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}

function EmptyHint({ href, label }: { href: string; label: string }) {
  return (
    <div className="rounded-xl bg-[var(--bg-secondary)] px-4 py-8 text-center ring-1 ring-white/10">
      <p className="text-sm text-[var(--fg-tertiary)]">هنوز موردی نیست.</p>
      <Button asChild variant="secondary" size="sm" className="mt-4">
        <Link href={href}>{label}</Link>
      </Button>
    </div>
  )
}
