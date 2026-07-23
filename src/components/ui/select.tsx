import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'h-11 w-full cursor-pointer appearance-none rounded-xl border border-neutral-200 bg-neutral-50/80 pl-3.5 pr-9 text-[15px] text-neutral-900 outline-none transition',
          'hover:border-neutral-300',
          'focus:border-neutral-400 focus:bg-white focus:ring-4 focus:ring-neutral-900/[0.06]',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
    </div>
  )
})
Select.displayName = 'Select'
