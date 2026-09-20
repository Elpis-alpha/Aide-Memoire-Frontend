import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { api, ApiError } from '@/lib/api'
import { NoteBody } from '@/components/note-body'
import { PublishedDate } from '@/components/published-date'

/**
 * S2-24 — the public pages are the SEO surface and were client-rendered, so
 * crawlers got an empty shell. This is a Server Component with no client
 * JavaScript at all: the HTML is complete on arrival and cacheable at the edge.
 */

export const revalidate = 300

type Props = { params: Promise<{ noteID: string }> }

const load = async (id: string) => {
  try {
    return await api.publicReads.note(id)
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null
    throw error
  }
}

/** S3-38 — per-page metadata, rather than one site-wide title. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { noteID } = await params
  const note = await load(noteID)

  if (!note) return { title: 'Note not found', robots: { index: false } }

  const description =
    note.description?.trim() ||
    `A note shared on Aide-mémoire${note.name ? `: ${note.name}` : ''}.`

  return {
    title: note.name,
    description,
    alternates: { canonical: `/public/note/${noteID}` },
    openGraph: {
      type: 'article',
      title: note.name,
      description,
      publishedTime: note.createdAt,
      modifiedTime: note.updatedAt,
    },
  }
}

export default async function PublicNotePage({ params }: Props) {
  const { noteID } = await params
  const note = await load(noteID)

  if (!note) notFound()

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <article>
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
