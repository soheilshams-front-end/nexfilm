export type PaidPlanId = 'monthly' | 'quarterly' | 'yearly'
export type PlanId = 'free' | PaidPlanId

export type SubscriptionPlan = {
  id: PaidPlanId
  name: string
  priceLabel: string
  periodLabel: string
  /** Approximate months covered — used for mock renewsAt */
  months: number
  badge?: string
  featured?: boolean
  perMonthHint?: string
}

export type CompareRow = {
  feature: string
  free: string
  premium: string
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'ماهانه',
    priceLabel: '۱۹۹٬۰۰۰',
    periodLabel: 'ماه',
    months: 1,
  },
  {
    id: 'quarterly',
    name: 'سه‌ماهه',
    priceLabel: '۴۹۹٬۰۰۰',
    periodLabel: '۳ ماه',
    months: 3,
    perMonthHint: 'حدود ۱۶۶٬۰۰۰ تومان / ماه',
  },
  {
    id: 'yearly',
    name: 'سالانه',
    priceLabel: '۱٬۴۹۰٬۰۰۰',
    periodLabel: 'سال',
    months: 12,
    badge: 'پیشنهادی',
    featured: true,
    perMonthHint: 'حدود ۱۲۴٬۰۰۰ تومان / ماه',
  },
]

export const freemiumCompareRows: CompareRow[] = [
  { feature: 'تماشای کاتالوگ', free: 'بله', premium: 'بله' },
  { feature: 'کیفیت پایه (۷۲۰p)', free: 'بله', premium: 'بله' },
  { feature: 'کیفیت ۱۰۸۰p / ۴K', free: 'خیر', premium: 'بله' },
  { feature: 'زیرنویس عمومی', free: 'بله', premium: 'بله' },
  { feature: 'زیرنویس اختصاصی', free: 'خیر', premium: 'بله' },
  { feature: 'دانلود آفلاین', free: 'خیر', premium: 'بله' },
  { feature: 'پروفایل بیشتر', free: '۱', premium: 'تا ۴' },
  { feature: 'دسترسی زودتر به تازه‌ها', free: 'خیر', premium: 'بله' },
]

export const subscriptionFaq = [
  {
    q: 'بدون اشتراک می‌توانم فیلم ببینم؟',
    a: 'بله. تماشای پایه با کیفیت ۷۲۰p و زیرنویس عمومی رایگان است. اشتراک فقط امکانات پرمیوم را باز می‌کند.',
  },
  {
    q: 'اگر اشتراک را لغو کنم چه می‌شود؟',
    a: 'تا پایان دورهٔ پرداخت‌شده دسترسی پرمیوم دارید؛ بعد از آن به رایگان برمی‌گردید.',
  },
  {
    q: 'پرداخت الان واقعی است؟',
    a: 'فعلاً فعال‌سازی آزمایشی است و درگاه بانکی در فاز بعدی اضافه می‌شود.',
  },
]

export function getPaidPlan(id: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((p) => p.id === id)
}

export function planDisplayName(planId: PlanId): string {
  if (planId === 'free') return 'رایگان'
  return getPaidPlan(planId)?.name ?? 'پرمیوم'
}
