'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signup } from '@/lib/user-store'
import { Button } from '@/components/untitled/button'
import { Input } from '@/components/untitled/input'
import { Card } from '@/components/untitled/card'
import { BrandMark } from '@/components/brand-logo'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    signup(email, name)
    router.push('/profiles')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-10">
      <Card className="w-full max-w-md" padding>
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandMark size={40} />
            <div>
              <p className="text-base font-semibold text-[var(--fg-primary)]">نکس‌فیلم</p>
              <p className="text-sm text-[var(--fg-tertiary)]">ساخت حساب جدید</p>
            </div>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/">انصراف</Link>
          </Button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Input label="نام" value={name} onChange={(e) => setName(e.target.value)} isRequired />
          <Input
            label="ایمیل"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired
          />
          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
          />
          <Button type="submit" className="w-full" size="lg" isDisabled={!email.trim() || !password.trim()}>
            ثبت‌نام
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--fg-tertiary)]">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link href="/login" className="font-semibold text-[var(--brand)]">
            ورود
          </Link>
        </p>
      </Card>
    </main>
  )
}
