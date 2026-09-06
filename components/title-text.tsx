import { isLatinTitle } from '@/lib/format-fa'
import { cn } from '@/lib/utils'

/** Renders a title with Bebas for Latin / Peyda (default) for Persian. */
export function TitleText({
  children,
  className,
  as: Tag = 'span',
  forceEn,
}: {
  children: string
  className?: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3'
  /** Force Bebas even if script detection is mixed */
  forceEn?: boolean
}) {
  const en = forceEn || isLatinTitle(children)
  return (
    <Tag
      className={cn(en && 'font-en text-end tracking-wide', className)}
      dir={en ? 'ltr' : undefined}
    >
      {children}
    </Tag>
  )
}
