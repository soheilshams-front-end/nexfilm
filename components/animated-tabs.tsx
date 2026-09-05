'use client'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export function AnimatedTabs({
  tabs,
  defaultIndex = 0,
  className,
}: {
  tabs: { label: string; content: React.ReactNode }[]
  defaultIndex?: number
  className?: string
}) {
  return (
    <TabGroup defaultIndex={defaultIndex} className={className}>
      <TabList className="glass mb-6 inline-flex rounded-full p-1">
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            className={({ selected }) =>
              cn(
                'rounded-full px-5 py-2 text-[15px] font-semibold transition-colors outline-none',
                selected ? 'bg-primary text-white' : 'text-[var(--label-2)] hover:text-white',
              )
            }
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map((tab) => (
          <TabPanel
            key={tab.label}
            as={motion.div}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  )
}
