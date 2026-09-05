'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  User,
  PlayCircle,
  Clock,
  Heart,
  Bookmark,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Globe,
  Settings,
  ChevronLeft,
  LogOut,
  Crown,
  Users,
} from 'lucide-react'
import { userStats } from '@/lib/user-data'
import { fa } from '@/lib/format-fa'
import { Button } from '@/components/untitled/button'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { RequireAuth } from '@/components/require-auth'
import { getActiveProfile, getAccountEmail, logout, hasPremiumAccess } from '@/lib/user-store'

const navSections = [
  {
    title: 'حساب',
    items: [
      { href: '/profile', label: 'پروفایل', icon: User },
      { href: '/profile/settings', label: 'ویرایش حساب', icon: Settings },
      { href: '/profile/security', label: 'تغییر رمز', icon: Shield },
      { href: '/profile/subscription', label: 'اشتراک', icon: CreditCard },
    ],
  },
  {
    title: 'کتابخانه',
    items: [
      { href: '/profile/continue-watching', label: 'ادامه تماشا', icon: PlayCircle },
      { href: '/profile/watchlist', label: 'لیست تماشا', icon: Bookmark },
      { href: '/profile/favorites', label: 'علاقه‌مندی‌ها', icon: Heart },
      { href: '/profile/history', label: 'تاریخچه', icon: Clock },
    ],
  },
  {
    title: 'ترجیحات',
    items: [
      { href: '/profile/notifications', label: 'اعلان‌ها', icon: Bell },
      { href: '/profile/language', label: 'زبان', icon: Globe },
      { href: '/profile/appearance', label: 'ظاهر', icon: Palette },
      { href: '/profiles/manage', label: 'مدیریت پروفایل‌ها', icon: Users },
    ],
  },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <RequireAuth>
      <div className="page-max mx-auto flex min-h-screen min-w-0 gap-4 overflow-x-clip px-[var(--space-page-x)] pb-8 pt-24 sm:gap-6 sm:pt-28 md:pb-24 md:pt-32">
        <aside className="sticky top-28 hidden h-fit w-72 shrink-0 lg:block">
          <div className="uu-panel overflow-hidden p-4">
            <SidebarContent pathname={pathname} />
          </div>
        </aside>

        {open && (
          <div className="fixed inset-0 z-[80] lg:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
            <aside className="absolute right-0 top-0 h-full w-[min(20rem,88vw)] overflow-y-auto border-s border-[var(--border-secondary)] bg-[var(--bg-secondary)] sidebar-scroll p-4 pb-[calc(var(--tabbar-h)+1rem)] sm:p-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mb-4 mr-auto grid size-9 place-items-center rounded-lg bg-[var(--bg-tertiary)]"
              >
                <ChevronLeft className="size-5" />
              </button>
              <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between sm:mb-6 lg:hidden">
            <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
              <ChevronLeft className="size-4" />
              منو
            </Button>
          </div>
          {children}
        </main>
      </div>
    </RequireAuth>
  )
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const router = useRouter()
  const [name, setName] = useState('کاربر')
  const [avatar, setAvatar] = useState('/avatars/user.png')
  const [email, setEmail] = useState<string | null>(null)
  const [premium, setPremium] = useState(false)

  useEffect(() => {
    const profile = getActiveProfile()
    if (profile) {
      setName(profile.name)
      setAvatar(profile.avatar)
    }
    setEmail(getAccountEmail())
    setPremium(hasPremiumAccess())
  }, [pathname])

  return (
    <div>
      <Link
        href="/profile"
        onClick={onNavigate}
        className="mb-4 flex items-center gap-3 rounded-xl bg-[var(--bg-tertiary)] p-3 transition-colors hover:bg-[var(--bg-quaternary)]"
      >
        <div className="relative">
          <img src={avatar} alt={name} className="size-12 rounded-[12px] object-cover" />
          {premium ? (
            <span className="absolute -bottom-1 -left-1 grid size-5 place-items-center rounded-full bg-[var(--brand)] text-white ring-2 ring-[var(--bg-secondary)]">
              <Crown className="size-3" />
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-white">{name}</p>
          <p className="truncate text-footnote text-[var(--brand)]">
            {premium ? 'عضو پرمیوم' : email || 'عضو رایگان'}
          </p>
        </div>
      </Link>

      <div className="mb-5 rounded-xl bg-[var(--bg-tertiary)] p-3.5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-white">سطح {fa(userStats.level)}</span>
          <span className="text-[var(--label-2)]">
            {fa(userStats.xp)} / {fa(userStats.xpToNext)} XP
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-all duration-700"
            style={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
          />
        </div>
      </div>

      <nav className="space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="mb-1.5 px-2 text-[12px] font-semibold text-[var(--label-3)]">{section.title}</p>
            <div className="settings-group">
              {section.items.map((item) => {
                const active = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'settings-row transition-colors',
                      active
                        ? 'bg-[var(--brand)]/12 text-[var(--brand)]'
                        : 'text-[var(--label-2)] hover:bg-white/5 hover:text-white',
                    )}
                  >
                    <Icon className="size-[18px]" />
                    <span className="flex-1 text-[15px] font-medium text-inherit">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <Button
        variant="ghost"
        className="mt-5 w-full justify-start text-[15px] text-[var(--label-2)]"
        onPress={() => {
          logout()
          onNavigate?.()
          router.push('/')
        }}
      >
        <LogOut className="size-[18px]" />
        خروج از حساب
      </Button>
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-title-1 text-white">{title}</h1>
        {subtitle ? <p className="mt-1 text-[15px] text-[var(--label-2)]">{subtitle}</p> : null}
      </motion.div>
      {action}
    </div>
  )
}
