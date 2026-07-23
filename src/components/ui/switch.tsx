'use client'

import { cn } from '@/lib/utils'

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  id,
  className,
  'aria-label': ariaLabel,
}: {
  checked: boolean
  onCheckedChange: (value: boolean) => void
  disabled?: boolean
  id?: string
  className?: string
  'aria-label'?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-[#F5124A]' : 'bg-neutral-300',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}
