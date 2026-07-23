import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50/80 px-3.5 text-[15px] text-neutral-900 outline-none transition',
          'placeholder:text-neutral-400',
          'hover:border-neutral-300',
          'focus:border-neutral-400 focus:bg-white focus:ring-4 focus:ring-neutral-900/[0.06]',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'
