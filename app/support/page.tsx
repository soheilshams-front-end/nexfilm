'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { Button } from '@/components/untitled/button'
import { Card } from '@/components/untitled/card'
import { supportChannels } from '@/lib/trust-content'
import { useToast } from '@/components/toast-provider'

export default function SupportPage() {
  const toast = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !message.trim()) {
      toast('ایمیل و پیام الزامی است')
      return
    }
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      setMessage('')
      toast('پیام شما ثبت شد (شبیه‌سازی — بدون ارسال سرور)')
    }, 400)
  }

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <SiteNav />
      <PageHero title="پشتیبانی" subtitle="کمک دربارهٔ حساب، پخش و اشتراک" />

      <div className="page-max page-pad mt-8 grid gap-4 pb-8 md:grid-cols-3">
        {supportChannels.map((c) => (
          <Card key={c.title} padding>
            <h2 className="text-base font-semibold text-white">{c.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--fg-tertiary)]">{c.body}</p>
            {c.href && c.actionLabel ? (
              <Button asChild variant="secondary" size="sm" className="mt-4">
                <Link href={c.href}>{c.actionLabel}</Link>
              </Button>
            ) : null}
          </Card>
        ))}
      </div>

      <div className="page-max page-pad mx-auto max-w-xl pb-16">
        <Card padding>
          <h2 className="text-lg font-semibold text-white">ارسال پیام</h2>
          <p className="mt-1 text-sm text-[var(--fg-quaternary)]">
            فرم آزمایشی است؛ پیام به سرور ارسال نمی‌شود.
          </p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام"
              className="h-11 w-full rounded-lg bg-[var(--bg)] px-3.5 text-sm text-white ring-1 ring-inset ring-[var(--border-primary)] outline-none placeholder:text-white/35 focus:ring-2 focus:ring-[var(--brand)]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل"
              required
              className="h-11 w-full rounded-lg bg-[var(--bg)] px-3.5 text-sm text-white ring-1 ring-inset ring-[var(--border-primary)] outline-none placeholder:text-white/35 focus:ring-2 focus:ring-[var(--brand)]"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="پیام شما"
              required
              rows={5}
              className="w-full resize-y rounded-lg bg-[var(--bg)] px-3.5 py-3 text-sm text-white ring-1 ring-inset ring-[var(--border-primary)] outline-none placeholder:text-white/35 focus:ring-2 focus:ring-[var(--brand)]"
            />
            <Button type="submit" className="w-full" size="lg" isDisabled={busy}>
              {busy ? 'در حال ثبت…' : 'ارسال پیام'}
            </Button>
          </form>
        </Card>
      </div>

      <SiteFooter />
    </main>
  )
}
