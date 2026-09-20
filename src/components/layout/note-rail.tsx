'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, FilePlus, FolderPlus, Lock } from 'lucide-react'
import { useToggleSectionOpen, useTree } from '@/hooks/use-api'
import { SectionFormDialog } from '@/components/sections/section-form-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * The note tree.
 *
 * S2-23 — one `/api/tree` request for the whole thing. The old sidebar asked
 * for the section list and then one request per section, and a duplicated
 * effect meant that ran three times on a single page load.
 *
 * Open/closed is the server's record (S3-40), flipped optimistically so the
 * disclosure still responds immediately.
 */
export function NoteRail({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { data, isPending, isError } = useTree()
  const toggleOpen = useToggleSectionOpen()

  return (
    <nav aria-label="Your notes" className="flex h-full flex-col gap-3 overflow-y-auto p-3">
      <div className="flex gap-1.5">
        <Button asChild variant="primary" size="sm" className="flex-1">
          <Link href="/note/create-new" onClick={onNavigate}>
            <FilePlus />
            New note
          </Link>
        </Button>

        <SectionFormDialog
          trigger={
            <Button variant="secondary" size="icon" aria-label="New section" title="New section">
              <FolderPlus />
            </Button>
          }
        />
      </div>

      {isPending && (
        <div aria-busy="true" className="space-y-2 px-1">
          <span className="sr-only">Loading your notes</span>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-7 animate-pulse rounded-md bg-sunken" />
          ))}
        </div>
      )}

      {isError && (
        <p role="alert" className="px-1 text-small text-correct">
          Your notes could not be loaded.
        </p>
      )}

      {data && (
        <div className="space-y-1">
          {data.sections.map(section => {
            const sectionHref = `/section/${section._id}`

            return (
              <div key={section._id}>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    aria-expanded={section.open}
                    aria-label={`${section.open ? 'Collapse' : 'Expand'} ${section.name}`}
                    onClick={() => toggleOpen.mutate(section._id)}
                    className="flex size-6 shrink-0 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-sunken hover:text-ink"
                  >
                    <ChevronRight
                      className={cn('size-3.5 transition-transform', section.open && 'rotate-90')}
                    />
                  </button>

                  <Link
                    href={sectionHref}
                    onClick={onNavigate}
                    aria-current={pathname === sectionHref ? 'page' : undefined}
                    className={cn(
                      'flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1.5 py-1 text-small transition-colors hover:bg-sunken',
                      pathname === sectionHref ? 'font-medium text-accent' : 'text-ink',
                    )}
                  >
                    <span className="truncate">{section.name}</span>
                    {section.isPublic && (
                      <span className="ml-auto shrink-0 text-micro text-ink-faint">Public</span>
                    )}
                  </Link>
                </div>

                {section.open && (
                  <ul className="ml-3 border-l border-rule pl-2">
                    {section.notes.length === 0 ? (
                      <li className="px-1.5 py-1 text-small text-ink-faint">Empty</li>
                    ) : (
                      section.notes.map(note => (
                        <NoteLink
                          key={note._id}
                          id={note._id}
                          name={note.name}
                          isPublic={note.isPublic}
                          pathname={pathname}
                          onNavigate={onNavigate}
                        />
                      ))
                    )}
                  </ul>
                )}
              </div>
            )
          })}

          {data.freeNotes.length > 0 && (
            <div className="pt-2">
              <p className="px-1.5 py-1 text-micro uppercase tracking-wide text-ink-faint">
                Not in a section
              </p>
              <ul>
                {data.freeNotes.map(note => (
                  <NoteLink
                    key={note._id}
                    id={note._id}
                    name={note.name}
                    isPublic={note.isPublic}
                    pathname={pathname}
                    onNavigate={onNavigate}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

function NoteLink({
  id,
  name,
  isPublic,
  pathname,
  onNavigate,
}: {
  id: string
  name: string
  isPublic?: boolean
  pathname: string
  onNavigate?: () => void
}) {
  const href = `/note/${id}`
  const current = pathname === href

  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={current ? 'page' : undefined}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-1.5 py-1 text-small transition-colors hover:bg-sunken',
          current ? 'bg-accent-soft font-medium text-accent' : 'text-ink-muted hover:text-ink',
        )}
      >
        <span className="truncate">{name || 'Untitled'}</span>
        {!isPublic && <Lock className="ml-auto size-3 shrink-0 text-ink-faint" aria-hidden="true" />}
      </Link>
    </li>
  )
}
