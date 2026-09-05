'use client'

import Link from 'next/link'
import { Share2, Globe, MessageCircle } from 'lucide-react'
import { fa } from '@/lib/format-fa'
import { BrandLockup } from '@/components/brand-logo'
import { cn } from '@/lib/utils'

const catalogLinks = [
  { label: 'خانه', href: '/' },
  { label: 'فیلم‌ها', href: '/movies' },
  { label: 'سریال‌ها', href: '/series' },
  { label: 'دسته‌بندی', href: '/browse' },
  { label: 'لیست من', href: '/my-list' },
  { label: 'اشتراک', href: '/subscription' },
]

const trustLinks = [
  { label: 'درباره', href: '/about' },
  { label: 'سوالات متداول', href: '/faq' },
  { label: 'پشتیبانی', href: '/support' },
  { label: 'شرایط استفاده', href: '/terms' },
  { label: 'حریم خصوصی', href: '/privacy' },
]

const social = [
  { Icon: Share2, label: 'اشتراک‌گذاری' },
  { Icon: Globe, label: 'وب' },
  { Icon: MessageCircle, label: 'گفتگو' },
]

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn('min-w-0 overflow-x-clip', className)}>
      <div className="page-max page-pad border-t border-[var(--border-secondary)] pt-10 tabbar-pad md:py-16">
        <div className="grid min-w-0 gap-8 sm:gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:items-start">
          <div className="min-w-0">
            <BrandLockup className="mb-3 text-base md:mb-4 md:text-lg" size={32} />
            <p className="max-w-md text-balance text-[17px] font-semibold leading-8 text-white sm:text-[20px] sm:leading-9 md:text-[28px] md:leading-10">
              تماشای پایه رایگان؛ پرمیوم برای کیفیت بالاتر و امکانات بیشتر.
            </p>
            <div className="mt-5 flex items-center gap-2 md:mt-6">
              {social.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="grid size-10 place-items-center rounded-lg text-[var(--brand)] ring-1 ring-[var(--border-brand)] transition-colors hover:bg-[var(--brand-soft)]"
                  aria-label={label}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:contents">
            <nav aria-label="کاتالوگ" className="min-w-0">
              <p className="mb-3 text-xs font-semibold text-[var(--fg-quaternary)]">کاتالوگ</p>
              <ul className="flex flex-col gap-2.5">
                {catalogLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm font-medium text-[var(--fg-tertiary)] transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="اعتماد و پشتیبانی" className="min-w-0">
              <p className="mb-3 text-xs font-semibold text-[var(--fg-quaternary)]">اعتماد</p>
              <ul className="flex flex-col gap-2.5">
                {trustLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm font-medium text-[var(--fg-tertiary)] transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[var(--border-secondary)] pt-5 text-sm text-[var(--fg-quaternary)] sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-[var(--fg-secondary)]">
              حریم خصوصی
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--fg-secondary)]">
              شرایط استفاده
            </Link>
            <Link href="/support" className="transition-colors hover:text-[var(--fg-secondary)]">
              پشتیبانی
            </Link>
          </div>
          <p className="shrink-0">© {fa(new Date().getFullYear())} نکس فیلم</p>
        </div>
      </div>
    </footer>
  )
}
