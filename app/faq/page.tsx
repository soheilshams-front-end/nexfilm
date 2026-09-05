import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { faqItems } from '@/lib/trust-content'

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />
      <PageHero title="سوالات متداول" subtitle="پاسخ‌های کوتاه دربارهٔ فریمیوم، حساب و اشتراک" />

      <div className="page-max page-pad mx-auto mt-8 max-w-2xl space-y-3 pb-16">
        {faqItems.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl bg-[var(--bg-secondary)] px-4 py-3 ring-1 ring-white/10 open:ring-[var(--border-brand)]"
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-white marker:content-none">
              {item.q}
            </summary>
            <p className="mt-2 text-sm leading-7 text-[var(--fg-tertiary)]">{item.a}</p>
            {item.href ? (
              <Link
                href={item.href}
                className="mt-3 inline-block text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                {item.hrefLabel ?? 'بیشتر'}
              </Link>
            ) : null}
          </details>
        ))}
      </div>

      <SiteFooter />
    </main>
  )
}
