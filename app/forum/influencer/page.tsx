import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { Button } from '@/components/untitled/button'

export default function InfluencerPage() {
  return (
    <main className="min-h-screen bg-black">
      <SiteNav />
      <PageHero title="پروفایل اینفلوئنسر" subtitle="نقد بنویسید و جامعه بسازید" />
      <div className="page-max page-pad mt-8 max-w-xl pb-14">
        <div className="settings-group space-y-4 p-5">
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-[var(--label-2)]">نام نمایشی</span>
            <input className="w-full rounded-[12px] border border-[var(--separator)] bg-black/40 px-4 py-3 text-[15px] outline-none focus:border-primary" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-[var(--label-2)]">بیو</span>
            <textarea rows={3} className="w-full rounded-[12px] border border-[var(--separator)] bg-black/40 px-4 py-3 text-[15px] outline-none focus:border-primary" />
          </label>
          <Button className="w-full">ایجاد پروفایل</Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/forum">بازگشت</Link>
          </Button>
        </div>
      </div>
      <SiteFooter />
    </main>
  )
}
