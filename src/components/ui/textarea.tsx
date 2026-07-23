import * as React from 'react'
import { cn } from '@/lib/utils'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-24 w-full rounded-xl border border-neutral-200 bg-neutral-50/80 px-3.5 py-3 text-[15px] leading-relaxed text-neutral-900 outline-none transition',
        'placeholder:text-neutral-400',
        'hover:border-neutral-300',
        'focus:border-neutral-400 focus:bg-white focus:ring-4 focus:ring-neutral-900/[0.06]',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'
