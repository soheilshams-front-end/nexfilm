'use client'

import { Tab, TabList, TabPanel, Tabs, type TabsProps } from 'react-aria-components'
import { cn } from '@/lib/utils'

function UntitledTabs({ className, ...props }: TabsProps) {
  return <Tabs className={cn('flex w-full flex-col gap-4', className)} {...props} />
}

function UntitledTabList({ className, ...props }: React.ComponentProps<typeof TabList>) {
  return (
    <TabList
      className={cn(
        'flex gap-1 border-b border-[var(--border-secondary)]',
        className,
      )}
      {...props}
    />
  )
}

function UntitledTab({ className, ...props }: React.ComponentProps<typeof Tab>) {
  return (
    <Tab
      className={cn(
        'cursor-pointer px-3 py-2.5 text-sm font-semibold text-[var(--fg-quaternary)] outline-none',
        'border-b-2 border-transparent -mb-px',
        'selected:border-[var(--brand)] selected:text-[var(--fg-primary)]',
        'hover:text-[var(--fg-secondary)]',
        'focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded-t-md',
        className,
      )}
      {...props}
    />
  )
}

function UntitledTabPanel({ className, ...props }: React.ComponentProps<typeof TabPanel>) {
  return <TabPanel className={cn('outline-none', className)} {...props} />
}

export { UntitledTabs, UntitledTabList, UntitledTab, UntitledTabPanel }
