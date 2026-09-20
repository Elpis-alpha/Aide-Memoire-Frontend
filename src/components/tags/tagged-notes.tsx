'use client'

import Link from 'next/link'
import { useNotesByTag, useTag } from '@/hooks/use-api'
import { NoteList } from '@/components/notes/note-list'
import { QueryError, QuerySkeleton } from '@/components/query-state'
import { ApiError } from '@/lib/api'

export function TaggedNotes({ tagID }: { tagID: string }) {
  const tag = useTag(tagID)
  const notes = useNotesByTag(tagID)

  if (tag.isError) {
    const missing = tag.error instanceof ApiError && tag.error.isNotFound
    return (
      <QueryError
        title={missing ? 'That tag is not here' : 'This tag could not be opened'}
        message={tag.error.message}
        onRetry={missing ? undefined : () => void tag.refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-rule pb-5">
        <p className="text-small uppercase tracking-wide text-ink-faint">Tag</p>
        <h1 className="mt-1 font-serif text-display font-semibold tracking-tight text-ink">
          {tag.data?.name ?? '…'}
        </h1>
        {tag.data && (
          <p className="mt-2 text-small text-ink-muted">
            <Link
              href={`/tag/public/${tagID}`}
              className="text-accent underline underline-offset-2"
            >
              See what everyone has published under this tag
            </Link>
          </p>
        )}
      </header>

      {notes.isPending && <QuerySkeleton label="Loading notes with this tag" rows={3} />}

      {notes.isError && (
        <QueryError
          title="These notes could not be loaded"
          message={notes.error.message}
          onRetry={() => void notes.refetch()}
        />
      )}

      {notes.data && (
        <NoteList
          notes={notes.data.items}
          emptyMessage="None of your notes carry this tag yet."
        />
      )}
    </div>
  )
}
