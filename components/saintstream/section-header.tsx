import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export function SaintstreamSectionHeader({
  title,
  href = '#',
  seeAllLabel = 'مشاهده همه',
}: {
  title: string
  href?: string
  seeAllLabel?: string
}) {
  return (
    <div className="page-pad mb-5 flex items-center justify-between gap-4">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#9CA3AF] transition-colors hover:border-white/20 hover:text-white"
      >
        {seeAllLabel}
        <ChevronLeft className="size-4" />
      </Link>
    </div>
  )
}
