'use client'

import * as React from 'react'
import { Input as AriaInput, Label, TextField, type InputProps as AriaInputProps } from 'react-aria-components'
import { cn } from '@/lib/utils'

type InputProps = AriaInputProps & {
  label?: string
  hint?: string
  error?: string
  className?: string
  inputClassName?: string
  isRequired?: boolean
}

function Input({ label, hint, error, className, inputClassName, isRequired, ...props }: InputProps) {
  return (
    <TextField
      className={cn('flex w-full flex-col gap-1.5', className)}
      isInvalid={Boolean(error)}
      isRequired={isRequired}
    >
      {label ? (
        <Label className="text-sm font-medium text-[var(--fg-secondary)]">{label}</Label>
      ) : null}
      <AriaInput
        className={cn(
          'h-11 w-full rounded-lg bg-[var(--bg)] px-3.5 text-base text-[var(--fg-primary)]',
          'ring-1 ring-inset ring-[var(--border-primary)] placeholder:text-[var(--fg-quaternary)]',
          'outline-none transition-shadow',
          'focus:ring-2 focus:ring-[var(--brand)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'ring-[var(--error)] focus:ring-[var(--error)]',
          inputClassName,
        )}
        {...props}
      />
      {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}
      {!error && hint ? <p className="text-sm text-[var(--fg-tertiary)]">{hint}</p> : null}
    </TextField>
  )
}

export { Input, type InputProps }
