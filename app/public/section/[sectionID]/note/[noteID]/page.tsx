import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { NoteBody } from '@/components/note-body'
import { PublishedDate } from '@/components/published-date'

/**
 * A published note read inside its collection. The same note is also reachable
 * on its own at `/public/note/[noteID]`; this route exists so a reader working
 * through a collection keeps that context, and it declares the standalone
 * route as canonical so the two do not compete in an index.
 */

export const revalidate = 300

type Props = { params: Promise<{ sectionID: string; noteID: string }> }

const load = async (sectionID: string, noteID: string) => {
  try {
    return await api.publicReads.sectionNote(sectionID, noteID)
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null
    throw error
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sectionID, noteID } = await params
  const data = await load(sectionID, noteID)

  if (!data) return { title: 'Note not found', robots: { index: false } }

  const description =
    data.note.description?.trim() || `A note published in ${data.section.name}.`

  return {
    title: data.note.name,
    description,
    alternates: { canonical: `/public/note/${noteID}` },
    openGraph: {
      type: 'article',
      title: data.note.name,
      description,
      publishedTime: data.note.createdAt,
      modifiedTime: data.note.updatedAt,
    },
  }
}

export default async function PublicSectionNotePage({ params }: Props) {
  const { sectionID, noteID } = await params
  const data = await load(sectionID, noteID)

  if (!data) notFound()

  const { section, note } = data

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <Link
        href={`/public/section/${sectionID}`}
        className="inline-flex items-center gap-1.5 text-small text-ink-muted hover:text-accent"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {section.name}
      </Link>

      <article className="mt-6">
        <header className="mb-8 border-b border-rule pb-6">
          <h1 className="font-serif text-hero font-semibold leading-tight tracking-tight text-ink">
            {note.name}
          </h1>

          {note.description && (
            <p className="mt-3 max-w-[60ch] text-lead text-ink-muted">{note.description}</p>
          )}

          <p className="mt-4 text-small text-ink-faint">
            Updated <PublishedDate iso={note.updatedAt} />
          </p>

          {note.tags && note.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {note.tags.map(tag => (
                <li key={tag._id}>
                  <Link
                    href={`/tag/public/${tag._id}`}
                    className="inline-block rounded-sm bg-sunken px-2 py-0.5 text-small text-ink-muted hover:text-accent"
                  >
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        <NoteBody html={note.text ?? ''} />
      </article>

      <footer className="mt-16 border-t border-rule pt-6">
        <Link href="/" className="text-small text-ink-muted hover:text-accent">
          Written on Aide-mémoire
        </Link>
      </footer>
    </main>
  )
}
