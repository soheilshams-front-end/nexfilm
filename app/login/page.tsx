'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { login } from '@/lib/user-store'
import { Button } from '@/components/untitled/button'
import { Input } from '@/components/untitled/input'
import { Card } from '@/components/untitled/card'
import { BrandMark } from '@/components/brand-logo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('soheil@nextfilm.ir')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    login(email)
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
              <p className="text-sm text-[var(--fg-tertiary)]">ورود به حساب کاربری</p>
            </div>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/">انصراف</Link>
          </Button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Input
            label="ایمیل"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired
          />

          <div className="relative">
            <Input
              label="رمز عبور"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور"
            />
            <button
              type="button"
              className="absolute end-3 top-[2.35rem] text-[var(--brand)]"
              onClick={() => setShow((s) => !s)}
              aria-label="نمایش رمز"
            >
              {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm font-semibold text-[var(--brand)]">
              رمز را فراموش کرده‌اید؟
            </Link>
          </div>

          <Button type="submit" className="w-full" size="lg" isDisabled={!password.trim()}>
            ورود
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--fg-tertiary)]">
          حساب ندارید؟{' '}
          <Link href="/signup" className="font-semibold text-[var(--brand)]">
            ثبت‌نام
          </Link>
        </p>
      </Card>
    </main>
  )
}
