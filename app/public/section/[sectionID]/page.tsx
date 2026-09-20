import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { api, ApiError } from '@/lib/api'
import { PublishedDate } from '@/components/published-date'

/**
 * A published section and the published notes in it.
 *
 * S1-03 — the API filters `isPublic: true` on both queries behind this page,
 * so a private note filed in a public section stays private. That was the bug:
 * one of the two section-note queries did not filter, and publishing a section
 * leaked everything in it.
 */

export const revalidate = 300

type Props = { params: Promise<{ sectionID: string }> }

const load = async (id: string) => {
  try {
    const [section, notes] = await Promise.all([
      api.publicReads.section(id),
      api.publicReads.sectionNotes(id),
    ])
    return { section, notes }
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null
    throw error
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sectionID } = await params
  const data = await load(sectionID)

  if (!data) return { title: 'Section not found', robots: { index: false } }

  const description =
    data.section.description?.trim() ||
    `A collection of notes published on Aide-mémoire: ${data.section.name}.`

  return {
    title: data.section.name,
    description,
    alternates: { canonical: `/public/section/${sectionID}` },
    openGraph: { type: 'website', title: data.section.name, description },
  }
}

export default async function PublicSectionPage({ params }: Props) {
  const { sectionID } = await params
  const data = await load(sectionID)

  if (!data) notFound()

  const { section, notes } = data

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <header className="border-b border-rule pb-6">
        <p className="text-small uppercase tracking-wide text-ink-faint">Collection</p>
        <h1 className="mt-1 font-serif text-hero font-semibold leading-tight tracking-tight text-ink">
          {section.name}
        </h1>
        {section.description && (
          <p className="mt-3 max-w-[60ch] text-lead text-ink-muted">{section.description}</p>
        )}
      </header>

      {notes.items.length === 0 ? (
        <p className="py-12 text-center text-ink-faint">
          Nothing in this collection has been published yet.
        </p>
      ) : (
        <ul className="divide-y divide-rule">
          {notes.items.map(note => (
            <li key={note._id}>
              <Link
                /* Within the collection, so the reader keeps its context and
                   the back link knows where to point. */
                href={`/public/section/${sectionID}/note/${note._id}`}
                className="flex items-baseline justify-between gap-4 py-4 hover:text-accent"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{note.name}</span>
                  {note.description && (
                    <span className="mt-0.5 block truncate text-small text-ink-muted">
                      {note.description}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-small text-ink-faint">
                  <PublishedDate iso={note.updatedAt} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-16 border-t border-rule pt-6">
        <Link href="/" className="text-small text-ink-muted hover:text-accent">
          Written on Aide-mémoire
        </Link>
      </footer>
    </main>
  )
}
