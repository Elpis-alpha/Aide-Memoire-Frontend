'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCreateNote } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'

/**
 * Creates the note and redirects into it. No modal, no wizard, no four steps
 * (S3-35).
 *
 * `?section=` files it as it is created, so "New note" from inside a section
 * lands where you would expect rather than in the unfiled pile.
 */
export function CreateNote() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const section = searchParams.get('section')
  const create = useCreateNote()

  // Strict Mode mounts effects twice in development; without this guard that
  // is two notes, and the second one is the one you would keep.
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    create.mutate(
      {
        name: 'Untitled note',
        ...(section ? { sections: [section] } : {}),
      },
      {
        // `replace`, so Back returns to where you came from rather than
        // re-running this page and creating another note.
        onSuccess: note => router.replace(`/note/${note._id}`),
      },
    )
  }, [create, router, section])

  if (create.isError) {
    return (
      <div role="alert" className="rounded-lg border border-correct bg-correct-soft p-5">
        <h1 className="font-medium text-correct">The note could not be created</h1>
        <p className="mt-1 text-small text-ink-muted">{create.error.message}</p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              started.current = false
              create.reset()
            }}
          >
            Try again
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/me">Your notes</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div aria-busy="true" aria-live="polite" className="space-y-4">
      <span className="sr-only">Creating your note</span>
      <div className="h-9 w-2/3 animate-pulse rounded-md bg-sunken" />
      <div className="h-64 animate-pulse rounded-lg bg-sunken" />
    </div>
  )
}
