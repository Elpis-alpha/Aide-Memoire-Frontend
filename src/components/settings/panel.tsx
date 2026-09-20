import type { ReactNode } from 'react'

/**
 * One card shape for every settings group, so the page reads as a list of
 * related decisions rather than five differently-styled boxes (S3-36).
 */
export function Panel({
  id,
  title,
  description,
  children,
  tone = 'default',
}: {
  id: string
  title: string
  description?: ReactNode
  children: ReactNode
  /** `danger` is reserved for actions that destroy something. */
  tone?: 'default' | 'danger'
}) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={
        tone === 'danger'
          ? 'rounded-lg border border-correct bg-surface p-5'
          : 'rounded-lg border border-rule bg-surface p-5'
      }
    >
      <h2
        id={`${id}-heading`}
        className={tone === 'danger' ? 'font-medium text-correct' : 'font-medium text-ink'}
      >
        {title}
      </h2>

      {description && <p className="mt-1 max-w-[62ch] text-small text-ink-muted">{description}</p>}

      <div className="mt-4">{children}</div>
    </section>
  )
}
