'use client'

import { useRef, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateNote } from '@/hooks/use-api'
import { Button, type ButtonProps } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'

/**
 * Creates a note, then opens it.
 *
 * S3-35 — there is no "new note" form: the note is made with a default title
 * and you are put straight into it. What this replaces is a *link* to a route
 * that created the note as soon as it rendered. Anything that loads a URL —
 * a refresh, a restored tab, a bookmark, a link inside a note — then made a
 * note, and the notes list filled with empty "Untitled note"s. Creating is a
 * side effect, so it now waits for a click.
 *
 * `?section=` semantics are kept: pass `section` to file the note as it is made.
 */
export function NewNoteButton({
  section,
  onCreated,
  children = 'New note',
  ...buttonProps
}: {
  section?: string
  /** Runs once the note exists, e.g. to close a slide-over. */
  onCreated?: () => void
  children?: ReactNode
} & Omit<ButtonProps, 'onClick' | 'disabled' | 'asChild'>) {
  const router = useRouter()
  const create = useCreateNote()

  // `disabled` follows the mutation's state, which React Query publishes a tick
  // after the click — a quick double click got in between and made two notes.
  // A ref is set in the same event, so the second click already sees it.
  const started = useRef(false)

  return (
    <Button
      {...buttonProps}
      // Shown disabled while it runs; the ref above is what stops a double click.
      disabled={create.isPending}
      onClick={() => {
        if (started.current) return
        started.current = true

        create.mutate(
          { name: 'Untitled note', ...(section ? { sections: [section] } : {}) },
          {
            onSuccess: note => {
              onCreated?.()
              router.push(`/note/${note._id}`)
            },
            onError: () => {
              started.current = false
              toast.error('The note could not be created. Try again.')
            },
          },
        )
      }}
    >
      {children}
    </Button>
  )
}
