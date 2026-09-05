'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'overview', label: 'نمای کلی' },
  { id: 'reviews', label: 'نقدها' },
] as const

type TabId = (typeof tabs)[number]['id']

export function DetailTabs({
  overview,
  reviews,
}: {
  overview: React.ReactNode
  reviews?: React.ReactNode
}) {
  const [tab, setTab] = useState<TabId>('overview')

  return (
    <div>
      <div className="mb-6 flex gap-1 border-b border-[var(--border-secondary)]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              '-mb-px border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors',
              tab === t.id
                ? 'border-[var(--brand)] text-[var(--fg-primary)]'
                : 'border-transparent text-[var(--fg-quaternary)] hover:text-[var(--fg-secondary)]',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' ? overview : null}
      {tab === 'reviews' ? (
        reviews ?? (
          <div className="uu-panel p-5">
            <p className="text-sm text-[var(--fg-tertiary)]">هنوز نقدی برای این عنوان ثبت نشده است.</p>
          </div>
        )
      ) : null}
    </div>
  )
}
