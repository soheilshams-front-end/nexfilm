'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Check, Crown } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { Button } from '@/components/untitled/button'
import {
  cancelSubscription,
  getSubscription,
  hasPremiumAccess,
  type SubscriptionState,
} from '@/lib/user-store'
import { planDisplayName, getPaidPlan } from '@/lib/subscription-plans'
import { useToast } from '@/components/toast-provider'

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function ProfileSubscriptionPage() {
  const toast = useToast()
  const [sub, setSub] = useState<SubscriptionState | null>(null)
  const [premium, setPremium] = useState(false)

  const refresh = () => {
    setSub(getSubscription())
    setPremium(hasPremiumAccess())
  }

  useEffect(() => {
    refresh()
  }, [])

  if (!sub) {
    return (
      <main className="min-h-screen">
        <SiteNav />
        <DashboardShell>
          <PageHeader title="اشتراک" subtitle="در حال بارگذاری…" />
        </DashboardShell>
        <SiteFooter />
      </main>
    )
  }

  const paid = getPaidPlan(sub.planId)
  const statusLabel =
    !premium && sub.planId === 'free'
      ? 'رایگان'
      : sub.status === 'canceled'
        ? 'لغو تمدید — تا پایان دوره فعال'
        : 'فعال'

  return (
    <main className="min-h-screen">
      <SiteNav />
      <DashboardShell>
        <PageHeader title="اشتراک" subtitle="وضعیت پلن و مدیریت تمدید" />

        <div className="mb-8 overflow-hidden rounded-2xl bg-[var(--bg-secondary)] p-6 ring-1 ring-white/10 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-2xl bg-[var(--brand)] text-white shadow-[0_0_24px_rgba(29,214,111,0.25)]">
                <Crown className="size-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white">
                    پلن {planDisplayName(sub.planId)}
                  </h2>
                  <span
                    className={
                      premium
                        ? 'rounded-full bg-[var(--brand)] px-2.5 py-0.5 text-[11px] font-bold text-white'
                        : 'rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-white/80'
                    }
                  >
                    {statusLabel}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--fg-tertiary)]">
                  {premium
                    ? 'کیفیت بالاتر و زیرنویس اختصاصی برای شما فعال است.'
                    : 'تماشای پایه رایگان است؛ برای پرمیوم ارتقا دهید.'}
                </p>
              </div>
            </div>
            {premium && sub.renewsAt ? (
              <div className="text-start">
                <p className="flex items-center gap-1.5 text-sm text-[var(--fg-quaternary)]">
                  <Calendar className="size-4" />
                  {sub.status === 'canceled' ? 'پایان دسترسی' : 'تمدید بعدی'}
                </p>
                <p className="mt-0.5 font-bold text-white">{formatDate(sub.renewsAt)}</p>
              </div>
            ) : null}
          </div>
        </div>

        {!premium ? (
          <div className="rounded-2xl bg-[var(--bg-secondary)] p-6 ring-1 ring-white/10">
            <h3 className="text-lg font-bold text-white">چرا پرمیوم؟</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--fg-secondary)]">
              {[
                'کیفیت ۱۰۸۰p و ۴K',
                'زیرنویس اختصاصی',
                'دانلود آفلاین',
                'پروفایل بیشتر',
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6">
              <Link href="/subscription">ارتقا به اشتراک</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[var(--bg-secondary)] p-6 ring-1 ring-white/10">
              <h3 className="text-base font-bold text-white">جزئیات پلن</h3>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-[var(--fg-quaternary)]">نام پلن</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">{planDisplayName(sub.planId)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--fg-quaternary)]">مبلغ</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">
                    {paid ? `${paid.priceLabel} تومان / ${paid.periodLabel}` : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--fg-quaternary)]">فعال‌سازی</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">{formatDate(sub.activatedAt)}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild variant="secondary">
                  <Link href="/subscription">تغییر پلن</Link>
                </Button>
                {sub.status === 'active' ? (
                  <Button
                    variant="ghost"
                    onPress={() => {
                      setSub(cancelSubscription())
                      setPremium(hasPremiumAccess())
                      toast('تمدید خودکار لغو شد؛ تا پایان دوره دسترسی دارید')
                    }}
                  >
                    لغو تمدید
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/subscription">فعال‌سازی دوباره</Link>
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-[var(--fg-quaternary)]">
              این یک شبیه‌سازی است؛ درگاه پرداخت واقعی هنوز متصل نیست.
            </p>
          </div>
        )}
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
