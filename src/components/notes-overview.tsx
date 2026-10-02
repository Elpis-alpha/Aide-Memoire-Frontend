'use client'

import Link from 'next/link'
import { useTree } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PublishedDate } from '@/components/published-date'

/**
 * The whole sidebar in one request (S2-23). The old version fetched the
 * section list and then one request per section, and the duplicate-call bug
 * meant the tree query fired three times on a single page load.
 */
export function NotesOverview() {
  const { data, isPending, isError, error, refetch } = useTree()

  if (isPending) {
    return (
      <div aria-busy="true" aria-live="polite" className="space-y-3">
        <span className="sr-only">Loading your notes</span>
        {[0, 1, 2].map(i => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-sunken" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div role="alert" className="rounded-lg border border-correct bg-correct-soft p-5">
        <h2 className="font-medium text-correct">Your notes could not be loaded</h2>
        <p className="mt-1 text-small text-ink-muted">{error.message}</p>
        <Button variant="secondary" size="sm" className="mt-3" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const { sections, freeNotes } = data
  const isEmpty = sections.length === 0 && freeNotes.length === 0

  if (isEmpty) {
    return (
      <div className="rounded-lg border border-rule bg-surface p-10 text-center">
        <h2 className="font-serif text-title font-semibold text-ink">Nothing written yet</h2>
        <p className="mx-auto mt-2 max-w-[42ch] text-ink-muted">
          Start with a single note. You can file it in a section later.
        </p>
        <Button asChild variant="primary" className="mt-5">
          <Link href="/note/create-new">Write your first note</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-display font-semibold tracking-tight text-ink">Your notes</h1>
          <Button asChild variant="primary">
            <Link href="/note/create-new">New note</Link>
          </Button>
        </header>
        <div className="mt-3 h-0.5 bg-rule-major" />
      </div>

      {/*
        Sections nest and tags are inline chips elsewhere — the two are shown
        differently on purpose, because they mean different things.
      */}
      {sections.map(section => (
        <section key={section._id} aria-labelledby={`section-${section._id}`}>
          <div className="flex items-baseline justify-between gap-3 border-b border-rule-hair pb-2">
            <Label as="h2" id={`section-${section._id}`} className="text-ink">
              <Link href={`/section/${section._id}`} className="hover:text-accent">
                {section.name}
              </Link>
            </Label>
            <Label>{section.notes.length === 1 ? '1 note' : `${section.notes.length} notes`}</Label>
          </div>

          {section.notes.length === 0 ? (
            <p className="py-3 text-small text-ink-faint">Nothing filed here yet.</p>
          ) : (
            <ul className="divide-y divide-rule-hair">
              {section.notes.map(note => (
                <NoteRow key={note._id} note={note} />
              ))}
            </ul>
          )}
        </section>
      ))}

      {freeNotes.length > 0 && (
        <section aria-labelledby="unfiled">
          <div className="flex items-baseline justify-between gap-3 border-b border-rule-hair pb-2">
            <Label as="h2" id="unfiled" className="text-ink">
              Not in a section
            </Label>
            <Label>{freeNotes.length === 1 ? '1 note' : `${freeNotes.length} notes`}</Label>
          </div>
          <ul className="divide-y divide-rule-hair">
            {freeNotes.map(note => (
              <NoteRow key={note._id} note={note} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

type Row = {
  _id?: string
  name?: string
  description?: string
  isPublic?: boolean
  updatedAt?: string
}

function NoteRow({ note }: { note: Row }) {
  if (!note._id) return null

  return (
    <li>
      <Link
        href={`/note/${note._id}`}
        className="flex items-baseline justify-between gap-4 py-3 hover:text-accent"
      >
        <span className="min-w-0">
          <span className="block truncate font-medium text-ink">{note.name ?? 'Untitled'}</span>
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
          {note.updatedAt && <PublishedDate iso={note.updatedAt} />}
        </span>
      </Link>
    </li>
  )
}
