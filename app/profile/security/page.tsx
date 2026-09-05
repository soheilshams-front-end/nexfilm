'use client'

import { Shield, KeyRound, Smartphone, Mail, Eye, AlertTriangle, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { Toggle } from '@/components/dashboard/toggle'
import { SectionCard } from '@/components/dashboard/ui-bits'
import { securityLog, userData } from '@/lib/user-data'
import { fa } from '@/lib/format-fa'
import { cn } from '@/lib/utils'

const logIcon = {
  success: { icon: CheckCircle2, color: 'text-green-400' },
  warning: { icon: AlertCircle, color: 'text-yellow-400' },
  danger: { icon: XCircle, color: 'text-destructive' },
}

export default function SecurityPage() {
  return (
    <main className="min-h-screen">      <SiteNav />
      <DashboardShell>
        <PageHeader title="امنیت و رمز عبور" subtitle="از حساب خود محافظت کنید" />

        <SectionCard title="تغییر رمز عبور">
          <div className="space-y-3 p-3">
            <input type="password" placeholder="رمز فعلی" className="w-full rounded-[12px] border border-[var(--separator)] bg-black/40 px-4 py-3 text-[15px] outline-none focus:border-primary" />
            <input type="password" placeholder="رمز جدید" className="w-full rounded-[12px] border border-[var(--separator)] bg-black/40 px-4 py-3 text-[15px] outline-none focus:border-primary" />
            <input type="password" placeholder="تکرار رمز جدید" className="w-full rounded-[12px] border border-[var(--separator)] bg-black/40 px-4 py-3 text-[15px] outline-none focus:border-primary" />
            <button type="button" className="btn-filled text-[15px]">ذخیره رمز جدید</button>
          </div>
        </SectionCard>

        <div className="reveal mt-6 mb-6 flex items-center gap-4 rounded-[20px] border border-primary/30 bg-gradient-to-l from-primary/10 to-transparent p-5">
          <div className="grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
            <Shield className="size-7" />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-bold">امتیاز امنیت: ۸۵ از ۱۰۰</p>
            <p className="mt-0.5 text-sm text-muted-foreground">حساب شما امن است، اما می‌تواند بهتر شود</p>
          </div>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">خوب</span>
        </div>

        {/* Security methods */}
        <div className="mb-6 space-y-3">
          <SecurityRow
            icon={KeyRound}
            title="رمز عبور"
            desc="آخرین تغییر: ۲ ماه پیش"
            action={<button className="rounded-lg border border-border px-4 py-1.5 text-xs font-semibold transition-colors hover:border-primary/40 hover:text-primary">تغییر</button>}
          />
          <SecurityRow
            icon={Smartphone}
            title="تأیید دو مرحله‌ای (۲FA)"
            desc="افزایش امنیت با کد یکبار مصرف"
            action={<Toggle defaultOn />}
            recommended
          />
          <SecurityRow
            icon={Mail}
            title="تأیید ایمیل"
            desc={userData.email}
            action={<span className="flex items-center gap-1 text-xs font-semibold text-primary"><CheckCircle2 className="size-4" />تأیید شده</span>}
          />
          <SecurityRow
            icon={Smartphone}
            title="اثر بیومتریک"
            desc="ورود با اثر انگشت یا چهره"
            action={<Toggle defaultOn={false} />}
          />
        </div>

        {/* Active sessions / security log */}
        <SectionCard title="تاریخچه امنیتی">
          <p className="mb-4 text-sm text-muted-foreground">فعالیت‌های اخیر حساب شما</p>
          <div className="space-y-2">
            {securityLog.map((log) => {
              const meta = logIcon[log.type as keyof typeof logIcon]
              const Icon = meta.icon
              return (
                <div key={log.id} className="reveal flex items-center gap-3 rounded-xl border border-border/40 bg-surface/20 p-3">
                  <Icon className={cn('size-5 shrink-0', meta.color)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{log.event}</p>
                    <p className="text-xs text-muted-foreground">{log.device} • {log.location}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{log.time}</span>
                </div>
              )
            })}
          </div>
        </SectionCard>

        {/* Danger zone */}
        <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            <h3 className="font-display font-bold text-destructive">منطقه خطر</h3>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">حذف حساب کاربری</p>
              <p className="text-xs text-muted-foreground">تمام داده‌های شما برای همیشه پاک می‌شود</p>
            </div>
            <button className="rounded-xl border border-destructive/40 px-5 py-2.5 text-sm font-bold text-destructive transition-colors hover:bg-destructive/10">
              حذف حساب
            </button>
          </div>
        </div>
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}

function SecurityRow({
  icon: Icon, title, desc, action, recommended,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  action: React.ReactNode
  recommended?: boolean
}) {
  return (
    <div className="reveal group flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/30">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{title}</p>
          {recommended && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">پیشنهادی</span>}
        </div>
        <p className="truncate text-xs text-muted-foreground">{desc}</p>
      </div>
      {action}
    </div>
  )
}
