import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { Label } from '@/components/ui/label'
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
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-10">
      <Link
        href={`/public/section/${sectionID}`}
        className="mb-6 inline-flex items-center gap-1.5 text-small text-ink-muted hover:text-accent"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {section.name}
      </Link>

      <div className="flex items-baseline justify-between">
        <span className="font-serif text-lead font-semibold tracking-tight text-ink">
          Aide-mémoire
        </span>
        <Label>Published</Label>
      </div>
      <div className="mt-3 h-0.5 bg-rule-major" />
      <div className="mt-0.5 h-px bg-rule-hair" />

      <h1 className="mt-8 font-serif text-display font-semibold leading-[1.1] tracking-tight text-ink">
        {note.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        {note.sections?.map(noteSection => (
          <Label key={noteSection._id}>{noteSection.name}</Label>
        ))}
        {note.updatedAt && (
          <Label>
            <PublishedDate iso={note.updatedAt} />
          </Label>
        )}
      </div>

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
