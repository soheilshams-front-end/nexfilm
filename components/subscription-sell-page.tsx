'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import {
  freemiumCompareRows,
  subscriptionFaq,
  subscriptionPlans,
  type PaidPlanId,
} from '@/lib/subscription-plans'
import { activatePlan, getSubscription, hasPremiumAccess } from '@/lib/user-store'
import { useToast } from '@/components/toast-provider'
import { Button } from '@/components/untitled/button'
import { cn } from '@/lib/utils'

const HERO_STILLS = [
  '/saintstream/posters/interstellar.webp',
  '/saintstream/posters/the-dark-knight.webp',
  '/saintstream/posters/dune-part-two.webp',
  '/saintstream/posters/oppenheimer.webp',
  '/saintstream/posters/the-matrix.webp',
  '/saintstream/posters/lotr-fellowship.webp',
  '/saintstream/posters/parasite.webp',
  '/saintstream/posters/the-godfather.webp',
]

function formatRenewDate(iso: string | null): string {
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

const INCLUDED = [
  { title: '۱۰۸۰ و ۴K', body: 'جزئیات تصویر همان‌طور که باید دیده شود، نه نسخهٔ فشرده.' },
  { title: 'زیرنویس اختصاصی', body: 'ترجمهٔ تمیز، زمان‌بندی درست — مخصوصاً برای دیالوگ تند.' },
  { title: 'دانلود آفلاین', body: 'برای مسیر و سفر، بدون وابستگی به آنتن.' },
  { title: 'تا چهار پروفایل', body: 'خانه، نه یک حساب مشترک شلوغ.' },
]

export function SubscriptionSellPage() {
  const router = useRouter()
  const toast = useToast()
  const [premium, setPremium] = useState(false)
  const [renewsAt, setRenewsAt] = useState<string | null>(null)
  const [selected, setSelected] = useState<PaidPlanId>('yearly')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setPremium(hasPremiumAccess())
    setRenewsAt(getSubscription().renewsAt)
  }, [])

  const plan = subscriptionPlans.find((p) => p.id === selected) ?? subscriptionPlans[2]

  const onBuy = () => {
    setBusy(true)
    activatePlan(plan.id)
    setPremium(true)
    toast(`پلن ${plan.name} فعال شد`)
    setBusy(false)
    router.push('/profile/subscription')
  }

  return (
    // Mobile: clear sticky CTA only — tab bar clearance lives on SiteFooter.tabbar-pad
    <div className="pb-[4.75rem] md:pb-12">
      <section className="relative overflow-hidden pt-20 md:pt-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-x-0 top-0 flex h-[200px] justify-center gap-1.5 opacity-[0.28] sm:h-[320px] sm:gap-2 md:h-[480px] md:gap-3">
            {HERO_STILLS.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="h-full w-[18%] min-w-[48px] max-w-[140px] object-cover sm:min-w-[64px]"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-[var(--bg)]/75 to-[var(--bg)]" />
        </div>

        <div className="page-max page-pad relative z-10 pb-4 md:pb-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-semibold tracking-wide text-white/50 md:text-[13px]">
              نکس‌فیلم پرمیوم
            </p>
            <h1 className="mt-2.5 text-balance text-[clamp(1.65rem,7vw,3.6rem)] font-bold leading-[1.12] tracking-tight text-[#f5f5f7] md:mt-4">
              تصویر درست.
              <br />
              تماشای آرام.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-6 text-white/58 md:mt-5 md:text-[17px] md:leading-7">
              کاتالوگ رایگان می‌ماند. پرمیوم فقط همان چیزهایی را باز می‌کند که واقعاً فرق دارند: کیفیت،
              زیرنویس، دانلود.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-[420px] md:mt-10">
            <div
              role="tablist"
              aria-label="دورهٔ پرداخت"
              className="grid grid-cols-3 rounded-xl bg-[#1c1c1e] p-1"
            >
              {subscriptionPlans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={selected === p.id}
                  onClick={() => setSelected(p.id)}
                  className={cn(
                    'relative h-9 rounded-[10px] text-[12px] font-semibold transition-colors md:h-10 md:text-[13px]',
                    selected === p.id
                      ? 'bg-[#2c2c2e] text-[#f5f5f7]'
                      : 'text-white/45 hover:text-white/75',
                  )}
                >
                  {p.name}
                  {p.badge ? (
                    <span className="absolute -top-2 left-1/2 hidden -translate-x-1/2 rounded-full bg-[var(--brand)] px-1.5 py-px text-[9px] font-bold text-[#0b120e] sm:inline">
                      {p.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="mt-5 text-center md:mt-8">
              <p className="flex items-baseline justify-center gap-1.5">
                <span className="text-[2.15rem] font-bold leading-none tracking-tight text-[#f5f5f7] md:text-[3.25rem]">
                  {plan.priceLabel}
                </span>
                <span className="text-[13px] text-white/40 md:text-[15px]">تومان</span>
              </p>
              <p className="mt-1.5 text-[12px] text-white/45 md:mt-2 md:text-[14px]">
                برای {plan.periodLabel}
                {plan.perMonthHint ? ` · ${plan.perMonthHint}` : ''}
              </p>
            </div>

            {/* Desktop CTA (inline) */}
            <div className="mt-6 hidden md:mt-8 md:block">
              {premium ? (
                <div className="space-y-3 text-center">
                  <p className="text-[14px] text-[var(--brand)]">
                    اشتراک فعال است تا {formatRenewDate(renewsAt)}
                  </p>
                  <Button asChild size="lg" className="w-full rounded-xl">
                    <Link href="/profile/subscription">مدیریت اشتراک</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="w-full rounded-xl"
                    isDisabled={busy}
                    onPress={onBuy}
                  >
                    {busy ? 'در حال فعال‌سازی…' : `شروع با پلن ${plan.name}`}
                  </Button>
                  <p className="mt-3 text-center text-[12px] text-white/35">
                    فعال‌سازی آزمایشی است. درگاه بانکی هنوز وصل نیست.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA above bottom tab */}
      <div className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+0.35rem)] z-40 border-t border-white/10 bg-[rgba(var(--bg-rgb),0.92)] px-3 py-2.5 backdrop-blur-xl md:hidden">
        {premium ? (
          <Button asChild size="lg" className="w-full rounded-xl">
            <Link href="/profile/subscription">مدیریت اشتراک</Link>
          </Button>
        ) : (
          <Button size="lg" className="w-full rounded-xl" isDisabled={busy} onPress={onBuy}>
            {busy ? 'در حال فعال‌سازی…' : `شروع با پلن ${plan.name}`}
          </Button>
        )}
      </div>

      <section className="page-max page-pad mt-10 md:mt-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[18px] font-semibold tracking-tight text-[#f5f5f7] md:text-[28px]">
            چه چیزی با پرمیوم عوض می‌شود
          </h2>
          <div className="mt-4 divide-y divide-white/[0.08] border-y border-white/[0.08] md:mt-8">
            {INCLUDED.map((item) => (
              <div
                key={item.title}
                className="grid gap-0.5 py-4 sm:grid-cols-[200px_1fr] sm:gap-8 sm:py-6"
              >
                <p className="text-[14px] font-semibold text-white md:text-[16px]">{item.title}</p>
                <p className="text-[13px] leading-6 text-white/50 md:text-[15px] md:leading-7">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-max page-pad mt-10 md:mt-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[18px] font-semibold tracking-tight text-[#f5f5f7] md:text-[28px]">
            رایگان در برابر پرمیوم
          </h2>
          <div className="mt-4 overflow-x-auto rounded-xl bg-[#141416] ring-1 ring-white/[0.08] md:mt-8 md:overflow-hidden md:rounded-2xl">
            <div className="min-w-[18rem]">
              <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(3.5rem,0.85fr)_minmax(3.5rem,0.85fr)] px-2.5 py-2.5 text-[10px] text-white/40 sm:grid-cols-[1.4fr_0.9fr_0.9fr] sm:px-3 sm:text-[11px] md:grid-cols-[1.5fr_1fr_1fr] md:px-6 md:py-3.5 md:text-[13px]">
                <span>امکان</span>
                <span className="text-center">رایگان</span>
                <span className="text-center">پرمیوم</span>
              </div>
              {freemiumCompareRows.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-[minmax(0,1.5fr)_minmax(3.5rem,0.85fr)_minmax(3.5rem,0.85fr)] border-t border-white/[0.06] px-2.5 py-2.5 text-[11px] sm:grid-cols-[1.4fr_0.9fr_0.9fr] sm:px-3 sm:text-[12px] md:grid-cols-[1.5fr_1fr_1fr] md:px-6 md:py-3.5 md:text-[14px]"
                >
                  <span className="min-w-0 pe-1 leading-5 text-white/75">{row.feature}</span>
                  <CompareCell value={row.free} muted />
                  <CompareCell value={row.premium} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-max page-pad mt-10 md:mt-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[18px] font-semibold tracking-tight text-[#f5f5f7] md:text-[28px]">
            سوال‌های کوتاه
          </h2>
          <div className="mt-4 divide-y divide-white/[0.08] border-y border-white/[0.08] md:mt-6">
            {subscriptionFaq.map((item) => (
              <details key={item.q} className="group py-3.5 md:py-5">
                <summary className="cursor-pointer list-none text-[14px] font-semibold text-white md:text-[16px]">
                  {item.q}
                </summary>
                <p className="mt-2 text-[13px] leading-6 text-white/50 md:mt-2.5 md:text-[15px] md:leading-7">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function CompareCell({ value, muted }: { value: string; muted?: boolean }) {
  if (value === 'بله') {
    return (
      <span className="flex justify-center">
        <Check className={cn('size-3.5 md:size-4', muted ? 'text-white/30' : 'text-[var(--brand)]')} />
      </span>
    )
  }
  if (value === 'خیر') {
    return <span className="text-center text-white/25">—</span>
  }
  return (
    <span className={cn('text-center', muted ? 'text-white/35' : 'font-medium text-white')}>
      {value}
    </span>
  )
}
