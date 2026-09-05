'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/untitled/button'
import { Input } from '@/components/untitled/input'
import { Card } from '@/components/untitled/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-10">
      <Card className="w-full max-w-md">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[var(--brand)] shadow-xs">
              <Play className="size-4 fill-white text-white" />
            </span>
            <div>
              <p className="text-base font-semibold text-[var(--fg-primary)]">بازیابی رمز</p>
              <p className="text-sm text-[var(--fg-tertiary)]">لینک بازیابی به ایمیل شما ارسال می‌شود</p>
            </div>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/login">انصراف</Link>
          </Button>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-base font-semibold text-[var(--fg-primary)]">ایمیل ارسال شد</p>
            <p className="text-sm text-[var(--fg-tertiary)]">
              اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی را دریافت می‌کنید.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/login">بازگشت به ورود</Link>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
            className="space-y-4"
          >
            <Input
              label="ایمیل"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
            <Button type="submit" className="w-full" size="lg">
              ارسال لینک
            </Button>
          </form>
        )}
      </Card>
    </main>
  )
}
