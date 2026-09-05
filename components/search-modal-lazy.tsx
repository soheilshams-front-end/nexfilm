'use client'

import dynamic from 'next/dynamic'

const SearchModal = dynamic(
  () => import('@/components/search-modal').then((m) => m.SearchModal),
  { ssr: false },
)

export function SearchModalLazy() {
  return <SearchModal />
}
