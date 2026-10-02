import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { api, ApiError, publicCache } from '@/lib/api'
import { publicTags } from '@/lib/cache-tags'
import { Label } from '@/components/ui/label'
import { PublishedDate } from '@/components/published-date'

/**
 * Published notes carrying a tag, from everyone.
 *
 * S2-24 — a Server Component with no client JavaScript, so the HTML is
 * complete on arrival. The private counterpart is `/tag/private/[tagID]`.
 */

export const revalidate = 300

type Props = { params: Promise<{ tagID: string }> }

const load = async (id: string) => {
  try {
    const [tag, notes] = await Promise.all([
      api.tags.get(id, publicCache([publicTags.tag(id)])),
      api.publicReads.byTag(id),
    ])
    return { tag, notes }
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null
    throw error
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tagID } = await params
  const data = await load(tagID)

  if (!data) return { title: 'Tag not found', robots: { index: false } }

  return {
    title: data.tag.name,
    description: `Notes published under “${data.tag.name}” on Aide-mémoire.`,
    alternates: { canonical: `/tag/public/${tagID}` },
  }
}

export default async function PublicTagPage({ params }: Props) {
  const { tagID } = await params
  const data = await load(tagID)

  if (!data) notFound()

  const { tag, notes } = data

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
        {tag.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <Label>Tag</Label>
      </div>

      <div className="mt-5 h-px bg-rule" />

      {notes.items.length === 0 ? (
        <p className="mt-7 py-12 text-center text-ink-faint">
          Nothing has been published under this tag yet.
        </p>
      ) : (
        <ul className="mt-7 divide-y divide-rule-hair">
          {notes.items.map(note => (
            <li key={note._id}>
              <Link
                href={`/public/note/${note._id}`}
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
    </main>
  )
}
