import { cn } from '@/lib/utils'

type AvatarProps = {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fallback?: string
}

const sizes = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-14 text-lg',
}

function Avatar({ src, alt = '', size = 'md', className, fallback }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'bg-[var(--bg-tertiary)] font-semibold text-[var(--fg-secondary)] ring-1 ring-[var(--border-secondary)]',
        sizes[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        <span>{fallback ?? alt.slice(0, 1) ?? '?'}</span>
      )}
    </span>
  )
}

export { Avatar, type AvatarProps }
