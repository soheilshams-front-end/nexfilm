import Link from 'next/link'

export function SectionHeader({
  title,
  href = '#',
  seeAllLabel = 'مشاهده همه',
}: {
  title: string
  href?: string
  seeAllLabel?: string
}) {
  return (
    <div className="page-pad mb-2.5 flex items-center justify-between gap-3 md:mb-3">
      <h2 className="text-[15px] font-semibold tracking-tight text-[var(--fg-primary)] sm:text-[16px] md:text-[17px]">
        {title}
      </h2>
      <Link
        href={href}
        className="inline-flex h-7 shrink-0 items-center rounded-md px-2.5 text-[11px] font-medium text-white/80 ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/[0.06] hover:text-white hover:ring-white/35 sm:h-8 sm:px-3 sm:text-[12px]"
      >
        {seeAllLabel}
      </Link>
    </div>
  )
}
