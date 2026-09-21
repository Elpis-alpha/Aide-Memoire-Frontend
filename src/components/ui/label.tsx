import { cn } from '@/lib/utils'

/**
 * The tracked small-cap. Editorial design's signature labelling device, and
 * the thing that carries metadata, section names and popover group headers.
 *
 * Not a <label> element — that is `field.tsx`. This is typographic.
 */
export function Label({
  as: Component = 'span',
  className,
  children,
  ...props
}: {
  as?: 'span' | 'p' | 'div' | 'h2' | 'h3'
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Component
      className={cn(
        'text-label font-semibold uppercase tracking-label text-ink-faint',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
