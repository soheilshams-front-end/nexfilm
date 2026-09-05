'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Search, Home, LayoutGrid, List, User, Crown } from 'lucide-react'
import { useSearch } from '@/components/search-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/untitled/button'
import { Avatar } from '@/components/untitled/avatar'
import { BrandLockup } from '@/components/brand-logo'
import { loadUserState } from '@/lib/user-store'

const desktopLinks = [
  { href: '/', label: 'خانه' },
  { href: '/movies', label: 'فیلم‌ها' },
  { href: '/series', label: 'سریال‌ها' },
  { href: '/browse', label: 'دسته‌بندی' },
]

const mobileTabs = [
  { href: '/', label: 'خانه', icon: Home },
  { href: '/search', label: 'جستجو', icon: Search, isSearch: true },
  { href: '/browse', label: 'دسته‌ها', icon: LayoutGrid },
  { href: '/my-list', label: 'لیست من', icon: List },
  { href: '/profile', label: 'پروفایل', icon: User },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const pathname = usePathname()
  const { openSearch } = useSearch()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const state = loadUserState()
    setLoggedIn(state.loggedIn === true)
    if (state.loggedIn) {
      const active = state.profiles.find((p) => p.id === state.activeProfileId)
      setAvatar(active?.avatar ?? null)
    } else {
      setAvatar(null)
    }
  }, [pathname])

  const profileHref = loggedIn ? '/profile' : '/login'

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 min-w-0',
          'px-2 pt-2 md:px-5 md:pt-4',
        )}
      >
        <div
          className={cn(
            'page-max mx-auto flex min-w-0 items-center gap-1.5 transition-all duration-300 sm:gap-2',
            'h-12 rounded-xl px-2 md:h-16 md:gap-4 md:rounded-2xl md:px-5',
            scrolled
              ? 'border border-white/10 bg-[rgba(var(--bg-rgb),0.82)] shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-xl'
              : 'border border-transparent bg-transparent md:border-transparent',
          )}
        >
          <BrandLockup size={36} compactMobile />

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/10 lg:flex">
            {desktopLinks.map((l) => {
              const active =
                pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href))
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={cn(
                    'relative rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/55 hover:text-white',
                  )}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>

          <div className="mr-auto flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-1 md:gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden rounded-xl text-white hover:bg-white/10 md:inline-flex"
              onClick={() => openSearch()}
              aria-label="جستجو"
            >
              <Search className="size-5" />
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden rounded-xl text-white/80 hover:text-white lg:inline-flex"
            >
              <Link href="/my-list">لیست من</Link>
            </Button>

            {/* Mobile: icon-only crown */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-9 rounded-lg text-[var(--brand)] hover:bg-white/10 md:hidden"
            >
              <Link href="/subscription" aria-label="اشتراک">
                <Crown className="size-4" />
              </Link>
            </Button>

            {/* Desktop: full subscription CTA */}
            <Button
              asChild
              size="sm"
              className="hidden rounded-xl shadow-[0_0_20px_rgba(29,214,111,0.25)] md:inline-flex"
            >
              <Link href="/subscription" className="inline-flex items-center gap-1.5">
                <Crown className="size-3.5" />
                اشتراک
              </Link>
            </Button>

            {loggedIn && avatar ? (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="size-9 overflow-hidden rounded-lg p-0 md:size-10 md:rounded-xl"
              >
                <Link href="/profile" aria-label="پروفایل">
                  <Avatar src={avatar} size="md" alt="پروفایل" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-9 rounded-lg px-2.5 text-[13px] text-white/80 hover:text-white md:h-10 md:rounded-xl md:px-3.5 md:text-sm"
              >
                <Link href="/login">ورود</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <nav
        className="fixed inset-x-2 bottom-2 z-50 rounded-xl border border-white/10 bg-[rgba(var(--bg-rgb),0.88)] shadow-[0_8px_28px_rgba(0,0,0,0.4)] backdrop-blur-xl md:hidden"
        aria-label="ناوبری موبایل"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex h-12 items-stretch px-0.5">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon
            const active = pathname === tab.href
            if ('isSearch' in tab && tab.isSearch) {
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => openSearch()}
                  className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-[9px] font-medium text-[var(--fg-quaternary)]"
                >
                  <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{tab.label}</span>
                </button>
              )
            }
            const isActive =
              active || (tab.href === '/profile' && pathname.startsWith('/profile'))
            return (
              <Link
                key={tab.label}
                href={tab.href === '/profile' ? profileHref : tab.href}
                className={cn(
                  'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-[9px] font-medium transition-colors',
                  isActive ? 'text-[var(--brand)]' : 'text-[var(--fg-quaternary)]',
                )}
              >
                <Icon className="size-[18px] shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />
                <span className="truncate">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
