'use client'

import { useState } from 'react'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { Toggle } from '@/components/dashboard/toggle'
import { SectionCard } from '@/components/dashboard/ui-bits'
import { notifications, notificationPrefs } from '@/lib/user-data'
import { fa } from '@/lib/format-fa'
import { cn } from '@/lib/utils'

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications)
  const unread = items.filter((n) => !n.read).length

  const markAll = () => setItems((arr) => arr.map((n) => ({ ...n, read: true })))
  const remove = (id: string) => setItems((arr) => arr.filter((n) => n.id !== id))

  return (
    <main className="min-h-screen">      <SiteNav />
      <DashboardShell>
        <PageHeader
          title="اعلان‌ها"
          subtitle={`${fa(unread)} اعلان خوانده‌نشده`}
          action={
            <button onClick={markAll} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary">
              <CheckCheck className="size-4" />
              خواندن همه
            </button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Notification list */}
          <div className="space-y-3">
            {items.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'reveal group flex items-start gap-3 rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300',
                  n.read ? 'border-border/60 bg-card/40' : 'border-primary/30 bg-primary/5',
                )}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-xl">{n.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{n.title}</p>
                    {!n.read && <span className="size-2 shrink-0 rounded-full bg-primary anim-glow-pulse" />}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground/70">{n.time}</p>
                </div>
                <button onClick={() => remove(n.id)} className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100" aria-label="حذف">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Preferences */}
          <div>
            <SectionCard title="تنظیمات اعلان‌ها">
              <p className="mb-4 text-sm text-muted-foreground">انتخاب کنید چه اعلان‌هایی دریافت کنید</p>
              <div className="space-y-3">
                {notificationPrefs.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-surface/20 p-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-lg bg-surface text-lg">{p.icon}</span>
                      <div>
                        <p className="text-sm font-semibold">{p.label}</p>
                        <p className="text-xs text-muted-foreground">{p.desc}</p>
                      </div>
                    </div>
                    <Toggle defaultOn={p.enabled} />
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 text-sm text-primary">
              <Bell className="size-4" />
              اعلان‌ها از طریق ایمیل و اپلیکیشن ارسال می‌شوند
            </div>
          </div>
        </div>
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}
