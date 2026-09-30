import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/85',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
        'outline-secondary':
          'border border-secondary bg-transparent text-secondary hover:bg-secondary hover:text-secondary-foreground',
        'outline-destructive':
          'border border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-cc-bg',
        ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
        link: 'text-muted-foreground underline-offset-4 hover:text-foreground hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md gap-1.5 px-3',
        lg: 'h-12 rounded-lg px-6',
        icon: 'size-9',
      },
      font: {
        default: '',
        display: 'font-display tracking-widest text-lg',
        mono: 'font-mono text-xs tracking-widest',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      font: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  font,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, font, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
