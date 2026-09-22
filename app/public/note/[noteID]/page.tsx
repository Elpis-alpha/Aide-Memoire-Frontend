import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { api, ApiError } from '@/lib/api'
import { Label } from '@/components/ui/label'
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
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-10">
      <div className="flex items-baseline justify-between">
        <Link
          href="/"
          className="font-serif text-lead font-semibold tracking-tight text-ink hover:text-accent"
        >
          Aide-mémoire
        </Link>
        <Label>Published</Label>
      </div>
      <div className="mt-3 h-0.5 bg-rule-major" />
      <div className="mt-0.5 h-px bg-rule-hair" />

      <h1 className="mt-8 font-serif text-display font-semibold leading-[1.1] tracking-tight text-ink">
        {note.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        {note.sections?.map(section => <Label key={section._id}>{section.name}</Label>)}
        {note.updatedAt && (
          <Label>
            Updated <PublishedDate iso={note.updatedAt} />
          </Label>
        )}
      </div>

      {note.description && (
        <p className="mt-3 max-w-[var(--measure-prose)] text-lead text-ink-muted">
          {note.description}
        </p>
      )}

      <div className="mt-5 h-px bg-rule" />

      <NoteBody as="article" html={note.text ?? ''} className="mt-7" />

      {note.tags && note.tags.length > 0 && (
        <>
          <div className="mt-10 h-px bg-rule-hair" />
          <ul className="mt-3 flex flex-wrap gap-2">
            {note.tags.map(tag => (
              <li key={tag._id}>
                <Link
                  href={`/tag/public/${tag._id}`}
                  className="inline-block rounded-sm border border-rule-hair px-2 py-0.5 hover:border-rule"
                >
                  <Label>{tag.name}</Label>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
