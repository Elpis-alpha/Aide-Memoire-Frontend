'use client'

import { AlertCircle, Check, Cloud, RefreshCw } from 'lucide-react'
import type { Autosave } from '@/hooks/use-autosave'

/**
 * The reassurance that makes autosave usable: without a visible answer to
 * "has this been kept?", removing the Save button just looks like losing it.
 *
 * `aria-live="polite"` so the state is announced when it settles, but only
 * once it has — announcing every keystroke's "Unsaved" would be unbearable.
 */
export function SaveStatus({ autosave }: { autosave: Autosave }) {
  const { status, error, saveNow } = autosave

  if (status === 'error') {
    return (
      <span className="flex items-center gap-1.5 text-small text-correct" role="status">
        <AlertCircle className="size-3.5" aria-hidden="true" />
        {error?.message ?? 'Not saved'}
        <button
          type="button"
          onClick={() => void saveNow()}
          className="underline underline-offset-2 hover:no-underline"
        >
          Retry
        </button>
      </span>
    )
  }

  const label =
    status === 'saving'
      ? 'Saving'
      : status === 'saved'
        ? 'Saved'
        : status === 'dirty'
          ? 'Unsaved changes'
          : 'Up to date'

  const Icon = status === 'saving' ? RefreshCw : status === 'dirty' ? Cloud : Check

  return (
    <span
      aria-live="polite"
      className="flex items-center gap-1.5 text-small text-ink-faint"
    >
      <Icon
        className={status === 'saving' ? 'size-3.5 animate-spin' : 'size-3.5'}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}
