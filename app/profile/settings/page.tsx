'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Monitor, LogOut } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { DashboardShell, PageHeader } from '@/components/dashboard/dashboard-shell'
import { Toggle } from '@/components/dashboard/toggle'
import { SectionCard } from '@/components/dashboard/ui-bits'
import { Button } from '@/components/untitled/button'
import { getAccountEmail, getActiveProfile, logout } from '@/lib/user-store'
import { useToast } from '@/components/toast-provider'
import {
  defaultPlayerPrefs,
  loadPlayerPrefs,
  savePlayerPrefs,
  type PlayerPrefs,
} from '@/lib/player-prefs'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const toast = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [prefs, setPrefs] = useState<PlayerPrefs>(defaultPlayerPrefs)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const profile = getActiveProfile()
    setName(profile?.name ?? '')
    setEmail(getAccountEmail() ?? '')
    setPrefs(loadPlayerPrefs())
    setReady(true)
  }, [])

  const patchPrefs = (partial: Partial<PlayerPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...partial }
      savePlayerPrefs(next)
      return next
    })
    toast('ترجیحات پخش ذخیره شد')
  }

  return (
    <main className="min-h-screen">
      <SiteNav />
      <DashboardShell>
        <PageHeader title="ویرایش حساب" subtitle="اطلاعات پروفایل و ترجیحات تماشا" />

        <SectionCard title="اطلاعات شخصی">
          <div className="space-y-1">
            <FieldRow label="نام نمایشی" value={name} />
            <FieldRow label="ایمیل" value={email || '—'} />
          </div>
          <div className="p-3">
            <Button onPress={() => toast('نام از صفحهٔ پروفایل‌ها قابل ویرایش است')}>
              ذخیره تغییرات
            </Button>
          </div>
        </SectionCard>

        <div className="mt-6">
          <SectionCard title="ترجیحات پخش">
            <div className="space-y-1">
              <SettingRow
                icon={Play}
                title="پخش خودکار تریلر"
                desc="شروع خودکار تریلر هنگام مرور (ذخیره لوکال)"
                toggle
                defaultOn={ready ? prefs.autoplayTrailers : true}
                onToggle={(on) => patchPrefs({ autoplayTrailers: on })}
              />
              <SettingRow
                icon={Monitor}
                title="کیفیت پیش‌فرض"
                desc={`${prefs.quality} — از تنظیمات پلیر هم قابل تغییر است`}
                chevron
                href="/subscription"
              />
              <SettingRow
                icon={Play}
                title="رد کردن خودکار تیتراژ"
                desc="ترجیح ذخیره می‌شود؛ مارکر تیتراژ هنوز آزمایشی است"
                toggle
                defaultOn={ready ? prefs.skipIntro : true}
                onToggle={(on) => patchPrefs({ skipIntro: on })}
              />
            </div>
          </SectionCard>
        </div>

        <div className="mt-6">
          <SectionCard title="درباره">
            <div className="space-y-2 px-3 text-sm">
              <div className="flex justify-between border-b border-[var(--separator)] py-2">
                <span className="text-[var(--label-2)]">نسخه برنامه</span>
                <span className="font-medium text-white">۲.۵.۰</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[var(--label-2)]">مدل محصول</span>
                <span className="font-medium text-white">فریمیوم</span>
              </div>
            </div>
          </SectionCard>
        </div>

        <Button
          variant="destructive"
          className="mt-6 w-full py-6"
          onPress={() => {
            logout()
            toast('از حساب خارج شدید')
            router.push('/')
          }}
        >
          <LogOut className="size-4" />
          خروج از حساب کاربری
        </Button>
      </DashboardShell>
      <SiteFooter />
    </main>
  )
}

function SettingRow({
  icon: Icon,
  title,
  desc,
  toggle,
  chevron,
  defaultOn,
  onToggle,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  toggle?: boolean
  chevron?: boolean
  defaultOn?: boolean
  onToggle?: (on: boolean) => void
  href?: string
}) {
  const body = (
    <div className="settings-row">
      <span className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-[var(--brand)] text-white">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-white">{title}</p>
        <p className="text-footnote">{desc}</p>
      </div>
      {toggle && <Toggle key={String(defaultOn)} defaultOn={defaultOn} onChange={onToggle} />}
      {chevron && <span className="text-[var(--label-3)]">‹</span>}
    </div>
  )
  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  )
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="settings-row !flex-col !items-stretch !gap-2 sm:!flex-row sm:!items-center">
      <span className="text-[15px] text-[var(--label-2)]">{label}</span>
      <input
        defaultValue={value}
        key={value}
        className="w-full rounded-xl border-0 bg-black/35 px-3 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-[var(--brand)]/40 sm:w-64"
        readOnly
      />
    </div>
  )
}
