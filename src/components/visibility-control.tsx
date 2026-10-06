'use client'

import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Whether a note or section is readable by anyone with the link, and the
 * control that changes it.
 *
 * These used to be one ghost button reading "Private" with an eye-off icon.
 * That is a state, not an action — it read as a status label, so nothing said
 * the thing was the way to publish. Now the state is plain text and the action
 * is a button named for what it does.
 */
export function VisibilityControl({
  isPublic,
  pending,
  onToggle,
  noun,
}: {
  isPublic: boolean
  pending: boolean
  onToggle: () => void
  noun: 'note' | 'section'
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={
          isPublic
            ? 'inline-flex items-center gap-1.5 px-2 text-small font-medium text-accent'
            : 'inline-flex items-center gap-1.5 px-2 text-small text-ink-muted'
        }
      >
        {isPublic ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
        {isPublic ? 'Published' : 'Private'}
      </span>

      <Button
        variant="secondary"
        size="sm"
        disabled={pending}
        onClick={onToggle}
        aria-label={`${isPublic ? 'Unpublish' : 'Publish'} this ${noun}`}
      >
        {isPublic ? 'Unpublish' : 'Publish'}
      </Button>
    </div>
  )
}
