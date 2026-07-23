import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-neutral-900 text-white shadow-sm hover:bg-neutral-800',
        primary: 'bg-[#F5124A] text-white shadow-sm shadow-[#F5124A]/25 hover:bg-[#e00f43]',
        outline: 'border border-neutral-300 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 hover:border-neutral-400',
        ghost: 'text-neutral-700 hover:bg-neutral-100',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3 text-[13px]',
        lg: 'h-11 px-6 text-[15px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
