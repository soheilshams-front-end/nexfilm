'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
} from '@/components/animate-ui/primitives/buttons/button';
import { cn } from '@/lib/utils';

/** Untitled SaaS button chrome (shared by animate-ui consumers) */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
  {
    variants: {
      variant: {
        default: 'bg-[var(--brand)] text-white shadow-xs hover:bg-[var(--brand-600)]',
        accent: 'bg-[var(--brand)] text-white shadow-xs hover:bg-[var(--brand-600)]',
        destructive: 'bg-[var(--error)] text-white hover:bg-[var(--error-600)]',
        outline:
          'bg-[var(--bg-secondary)] text-[var(--fg-primary)] shadow-[inset_0_0_0_1px_var(--border-primary)] hover:bg-[var(--bg-tertiary)]',
        secondary:
          'bg-[var(--bg-secondary)] text-[var(--fg-primary)] shadow-[inset_0_0_0_1px_var(--border-primary)] hover:bg-[var(--bg-tertiary)]',
        ghost: 'hover:bg-white/5 text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]',
        link: 'text-[var(--brand)] underline-offset-4 hover:underline rounded-none',
      },
      size: {
        default: 'h-10 min-h-10 px-4 py-2 has-[>svg]:px-3.5',
        sm: 'h-9 min-h-9 gap-1.5 px-3.5 text-sm has-[>svg]:px-3',
        lg: 'h-11 min-h-11 px-5 text-base has-[>svg]:px-4',
        icon: 'size-10 rounded-lg',
        'icon-sm': 'size-9 rounded-lg',
        'icon-lg': 'size-11 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = ButtonPrimitiveProps &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  if (asChild) {
    return <Slot className={cn(buttonVariants({ variant, size, className }))} {...(props as object)} />;
  }
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
