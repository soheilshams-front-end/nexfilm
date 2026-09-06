import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function BrandMark({
  className,
  size = 36,
}: {
  className?: string
  size?: number
}) {
  return (
    <Image
      src="/brand/logo.webp"
      alt=""
      width={size}
      height={size}
      className={cn('object-contain', className)}
      priority
    />
  )
}

export function BrandLockup({
  href = '/',
  className,
  showWordmark = true,
  size = 36,
  /** Hide wordmark below md (mobile mark-only) */
  compactMobile = false,
}: {
  href?: string
  className?: string
  showWordmark?: boolean
  size?: number
  compactMobile?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex shrink-0 items-center gap-2 text-base font-bold tracking-tight text-white md:gap-2.5 md:text-xl',
        className,
      )}
      aria-label="نکس فیلم — خانه"
    >
      <BrandMark
        size={compactMobile ? 24 : size}
        className={cn(
          'drop-shadow-[0_0_18px_rgba(29,214,111,0.35)]',
          compactMobile && 'md:!h-8 md:!w-8',
        )}
      />
      {showWordmark ? (
        <span className={cn(compactMobile && 'hidden md:inline')}>
          نکس<span className="text-[var(--brand)]">‌فیلم</span>
        </span>
      ) : null}
    </Link>
  )
}
