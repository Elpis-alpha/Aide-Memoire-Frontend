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
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium',
    'transition-[background-color,border-color,color,box-shadow] duration-[var(--dur-1)] ease-[var(--ease-paper)]',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        // Fountain-pen blue: the things you do. lift-1 on hover is the only
        // elevation any inline control gets.
        primary:
          'bg-accent text-accent-contrast hover:bg-accent-hover hover:shadow-lift-1 active:bg-accent-hover active:shadow-none',
        secondary:
          'bg-surface text-ink border border-rule hover:border-rule-strong hover:bg-sunken active:bg-sunken',
        ghost: 'text-ink-muted hover:bg-sunken hover:text-ink active:bg-sunken',
        // Red correction pencil: the things that remove something.
        // `text-white` only worked in light mode: dark mode's --correct is a
        // light red, and white on it is 3.19:1. Paired token, like the accent.
        destructive:
          'bg-correct text-correct-contrast hover:opacity-90 active:opacity-100',
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
