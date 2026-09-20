import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * S2-33 — the old UI had 59 clickable elements and zero `<button>` elements:
 * every control was a `<div onClick>`, so none of them were reachable by
 * keyboard, focusable, or announced as actionable. This renders a real button
 * unless `asChild` is used to render a real link.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Fountain-pen blue: the things you do.
        primary: 'bg-accent text-accent-contrast hover:bg-accent-hover',
        secondary: 'bg-surface text-ink border border-rule hover:border-rule-strong hover:bg-sunken',
        ghost: 'text-ink-muted hover:bg-sunken hover:text-ink',
        // Red correction pencil: the things that remove something.
        destructive: 'bg-correct text-white hover:opacity-90',
        link: 'text-accent underline underline-offset-2 hover:decoration-2',
      },
      size: {
        sm: 'h-8 px-3 text-small [&_svg]:size-4',
        md: 'h-9 px-4 text-base [&_svg]:size-4',
        lg: 'h-11 px-6 text-read [&_svg]:size-5',
        icon: 'size-8 [&_svg]:size-4',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        // Without this a button inside a form submits it, which is the cause
        // of a whole family of "why did the page reload" bugs.
        {...(asChild ? {} : { type: type ?? 'button' })}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export { buttonVariants }
