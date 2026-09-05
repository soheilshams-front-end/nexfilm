'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FilterOption = { value: string; label: string }

type AnimatedFilterDropdownProps = {
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  menuClassName?: string
}

export function AnimatedFilterDropdown({
  label,
  value,
  options,
  onChange,
  open,
  onOpenChange,
  className,
  menuClassName,
}: AnimatedFilterDropdownProps) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((o) => o.value === value)?.label ?? label

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onOpenChange])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        onClick={() => onOpenChange(!open)}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-lg bg-[#1a1f27] px-3 md:h-11 md:px-3.5',
          'text-[13px] font-medium text-white ring-1 ring-inset ring-white/10 md:text-sm',
          'transition-[background-color,box-shadow,ring-color] duration-200',
          'hover:bg-[#222833] hover:ring-white/16',
          open && 'bg-[#222833] ring-[rgba(29,214,111,0.45)] shadow-[0_0_0_3px_rgba(29,214,111,0.12)]',
        )}
      >
        <span className="truncate">{selected}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid size-4 shrink-0 place-items-center"
        >
          <ChevronDown className="size-4 text-white/55" strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={listId}
            role="listbox"
            aria-label={label}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute start-0 top-[calc(100%+8px)] z-40 min-w-full overflow-hidden rounded-xl',
              'origin-top bg-[#1c222c] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.65)]',
              'ring-1 ring-white/14',
              menuClassName,
            )}
          >
            <div className="max-h-64 overflow-y-auto overscroll-contain">
              {options.map((o, i) => {
                const active = o.value === value
                return (
                  <motion.button
                    key={o.value || `opt-${i}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduceMotion ? 0 : 0.02 * i, duration: 0.18 }}
                    onClick={() => {
                      onChange(o.value)
                      onOpenChange(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-start text-sm',
                      'transition-colors duration-150',
                      active
                        ? 'bg-[rgba(29,214,111,0.16)] text-[var(--brand)]'
                        : 'text-white/75 hover:bg-white/[0.06] hover:text-white',
                    )}
                  >
                    <span className="truncate">{o.label}</span>
                    {active ? (
                      <motion.span
                        initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="grid size-4 shrink-0 place-items-center"
                      >
                        <Check className="size-3.5" strokeWidth={2.5} />
                      </motion.span>
                    ) : (
                      <span className="size-4 shrink-0" aria-hidden />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
