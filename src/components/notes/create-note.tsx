'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FilePlus } from 'lucide-react'
import { NewNoteButton } from '@/components/notes/new-note-button'
import { Button } from '@/components/ui/button'

/**
 * What `/note/create-new` shows. The route exists so that "New note" has an
 * address you can bookmark or open in a new tab — but opening an address must
 * never change anything, so the note is made by the button, not by arriving
 * here (see `NewNoteButton`).
 *
 * `?section=` files the note as it is created.
 */
export function CreateNote() {
  const section = useSearchParams().get('section') ?? undefined

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-display font-semibold tracking-tight text-ink">New note</h1>
      <p className="max-w-[var(--measure-prose)] text-ink-muted">
        {section
          ? 'This will be filed in the section you came from. You can name it, tag it and move it afterwards.'
          : 'Start with a blank page. You can name it, file it and tag it afterwards.'}
      </p>
      <div className="flex gap-2">
        <NewNoteButton variant="primary" section={section} autoFocus>
          <FilePlus />
          Start writing
        </NewNoteButton>
        <Button asChild variant="ghost">
          <Link href="/me">Back to your notes</Link>
        </Button>
      </div>
    </div>
  )
}
