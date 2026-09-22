'use client'

import Link from 'next/link'
import { FolderPlus } from 'lucide-react'
import { useTree } from '@/hooks/use-api'
import { QueryError, QuerySkeleton } from '@/components/query-state'
import { SectionFormDialog } from '@/components/sections/section-form-dialog'
import { Button } from '@/components/ui/button'

/**
 * Reads the tree rather than `/api/sections`, because the count per section is
 * the only thing this page adds over the rail — and the tree is already in
 * cache by the time anyone gets here, so it usually costs no request at all.
 */
export function SectionIndex() {
  const { data, isPending, isError, error, refetch } = useTree()

  if (isPending) return <QuerySkeleton label="Loading your sections" />

  if (isError) {
    return (
      <QueryError
        title="Your sections could not be loaded"
        message={error.message}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-display font-semibold tracking-tight text-ink">Sections</h1>

          <SectionFormDialog
            trigger={
              <Button variant="primary" size="sm">
                <FolderPlus />
                New section
              </Button>
            }
          />
        </header>
        <div className="mt-3 h-0.5 bg-rule-major" />
      </div>

      {data.sections.length === 0 ? (
        <div className="rounded-lg border border-rule bg-surface p-10 text-center">
          <h2 className="font-serif text-title font-semibold text-ink">No sections yet</h2>
          <p className="mx-auto mt-2 max-w-[44ch] text-ink-muted">
            Sections are folders for notes, and a note can sit in more than one. You can publish
            a whole section at once.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-rule-hair">
          {data.sections.map(section => (
            <li key={section._id}>
              <Link
                href={`/section/${section._id}`}
                className="flex items-baseline justify-between gap-4 py-3 hover:text-accent"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{section.name}</span>
                  {section.description && (
                    <span className="mt-0.5 block truncate text-small text-ink-muted">
                      {section.description}
                    </span>
                  )}
                </span>

                <span className="flex shrink-0 items-center gap-3 text-small text-ink-faint">
                  {section.isPublic && (
                    <span className="rounded-sm bg-highlight px-1.5 py-0.5 text-micro text-highlight-ink">
                      Public
                    </span>
                  )}
                  {section.notes.length === 1 ? '1 note' : `${section.notes.length} notes`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {data.freeNotes.length > 0 && (
        <p className="text-small text-ink-muted">
          {data.freeNotes.length === 1 ? '1 note is' : `${data.freeNotes.length} notes are`} not in
          any section.{' '}
          <Link href="/me" className="text-accent underline underline-offset-2">
            See them
          </Link>
        </p>
      )}
    </div>
  )
}
