'use client'

import { Button } from '@/components/ui/button'

/**
 * The two states every query page has to render, written once. Each page
 * hand-rolling its own is how the old app ended up with forty different
 * loading spinners and several screens that showed nothing at all on failure.
 */
export function QuerySkeleton({ label, rows = 4 }: { label: string; rows?: number }) {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-lg bg-sunken" />
      ))}
    </div>
  )
}

export function QueryError({
  title,
  message,
  onRetry,
}: {
  title: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div role="alert" className="rounded-lg border border-correct bg-correct-soft p-5">
      <h2 className="font-medium text-correct">{title}</h2>
      {message && <p className="mt-1 text-small text-ink-muted">{message}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
