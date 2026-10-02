'use client'

import Link from 'next/link'
import { PublishedDate } from '@/components/published-date'
import type { NoteSummary } from '@/lib/api'

/**
 * One row shape for every list of notes — search results, a section, a tag.
 * Three near-identical list markups is how they drift apart (S3-36).
 */
export function NoteList({ notes, emptyMessage }: { notes: NoteSummary[]; emptyMessage: string }) {
  if (notes.length === 0) {
    return <p className="py-8 text-center text-ink-faint">{emptyMessage}</p>
  }

  return (
    <ul className="divide-y divide-rule-hair">
      {notes.map(note => (
        <li key={note._id}>
          <Link
            href={`/note/${note._id}`}
            className="flex items-baseline justify-between gap-4 py-3 hover:text-accent"
          >
            <span className="min-w-0">
              <span className="block truncate font-medium text-ink">{note.name || 'Untitled'}</span>
              {note.description && (
                <span className="mt-0.5 block truncate text-small text-ink-muted">
                  {note.description}
                </span>
              )}
            </span>

            <span className="flex shrink-0 items-center gap-3 text-small text-ink-faint">
              {note.isPublic && (
                <span className="rounded-sm bg-highlight px-1.5 py-0.5 text-micro text-highlight-ink">
                  Public
                </span>
              )}
              <PublishedDate iso={note.updatedAt} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
