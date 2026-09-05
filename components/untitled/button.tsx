'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

/**
 * Untitled UI–style button (React Aria + rounded-lg SaaS chrome).
 * Brand tint = Nex Film green; primary CTA only.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-xl text-sm font-semibold transition-[color,background-color,box-shadow,transform] duration-200',
    'outline-none select-none',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--brand)] text-white shadow-[0_6px_18px_rgba(29,214,111,0.28)] hover:bg-[var(--brand-600)] hover:shadow-[0_10px_28px_rgba(29,214,111,0.35)] pressed:bg-[var(--brand-700)]',
        secondary:
          'bg-[var(--bg-tertiary)]/80 text-[var(--fg-primary)] ring-1 ring-inset ring-white/10 hover:bg-[var(--bg-quaternary)] hover:ring-white/16',
        tertiary:
          'bg-transparent text-[var(--fg-secondary)] hover:bg-white/5 hover:text-[var(--fg-primary)]',
        'link-color':
          'bg-transparent text-[var(--brand)] hover:text-[var(--brand-600)] p-0 h-auto min-h-0',
        destructive: 'bg-[var(--error)] text-white hover:bg-[var(--error-600)]',
        ghost:
          'bg-transparent text-[var(--fg-secondary)] hover:bg-white/5 hover:text-[var(--fg-primary)]',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-base',
        xl: 'h-12 px-6 text-base',
        icon: 'size-10 p-0',
        'icon-sm': 'size-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonProps = AriaButtonProps &
  VariantProps<typeof buttonVariants> & {
    className?: string
    children?: React.ReactNode
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }))
  if (asChild) {
    return <Slot className={classes} {...(props as React.ComponentPropsWithoutRef<typeof Slot>)} />
  }
  return <AriaButton className={classes} {...props} />
}

export { Button, buttonVariants, type ButtonProps }
