import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { forumTopics } from '@/lib/forum'
import { fa } from '@/lib/format-fa'
import { Button } from '@/components/untitled/button'
import { Badge } from '@/components/untitled/badge'
import { Card } from '@/components/untitled/card'

export default function ForumPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />
      <PageHero title="انجمن" subtitle="گفتگو درباره فیلم، سریال و تماشای گروهی" />

      <div className="page-max page-pad mt-8 grid gap-8 pb-14 lg:grid-cols-[1fr_300px]">
        <div className="space-y-3">
          {forumTopics.map((t) => (
            <Link
              key={t.id}
              href={`/forum/${t.id}`}
              className="uu-panel block p-4 outline-none transition-colors hover:bg-[var(--bg-tertiary)] focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge color="brand">{t.tag}</Badge>
                <span className="text-xs text-[var(--fg-quaternary)]">
                  {fa(t.replies)} پاسخ · {fa(t.views)} بازدید
                </span>
              </div>
              <h2 className="mt-2 text-base font-semibold text-[var(--fg-primary)]">{t.title}</h2>
              <p className="mt-1 text-sm text-[var(--fg-tertiary)]">{t.excerpt}</p>
              <p className="mt-2 text-xs text-[var(--fg-quaternary)]">نویسنده: {t.author}</p>
            </Link>
          ))}
        </div>

        <aside className="space-y-4">
          <Card>
            <p className="text-base font-semibold text-[var(--fg-primary)]">اینفلوئنسر شو</p>
            <p className="mt-2 text-sm text-[var(--fg-tertiary)]">
              پروفایل عمومی بسازید، نقد بنویسید و دنبال‌کننده جذب کنید.
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href="/forum/influencer">ساخت پروفایل</Link>
            </Button>
          </Card>
          <Card>
            <p className="text-sm font-semibold text-[var(--fg-primary)]">قوانین کوتاه</p>
            <ul className="mt-2 list-disc space-y-1 pe-4 text-sm text-[var(--fg-tertiary)]">
              <li>اسپویل را علامت بزنید</li>
              <li>احترام به دیگران الزامی است</li>
              <li>لینک اسپم ممنوع</li>
            </ul>
          </Card>
        </aside>
      </div>

      <SiteFooter />
    </main>
  )
}
