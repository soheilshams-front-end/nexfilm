'use client'

import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState } from 'react'

export function SearchQueryForm({ initialQuery = '' }: { initialQuery?: string }) {
  const router = useRouter()
  const [value, setValue] = useState(initialQuery)

  return (
    <form
      className="uu-panel flex min-w-0 w-full flex-1 items-center gap-2 rounded-lg px-3.5 py-1.5 sm:min-w-[min(100%,20rem)]"
      onSubmit={(e) => {
        e.preventDefault()
        const q = value.trim()
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
      }}
    >
      <Search className="size-4 shrink-0 text-[var(--fg-quaternary)]" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="فیلم، سریال یا ژانر را جستجو کنید"
        aria-label="جستجو"
        className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-white outline-none placeholder:text-[var(--fg-tertiary)]"
      />
    </form>
  )
}
