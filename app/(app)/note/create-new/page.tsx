import { Suspense } from 'react'
import type { Metadata } from 'next'
import { CreateNote } from '@/components/notes/create-note'

export const metadata: Metadata = {
  title: 'New note',
  robots: { index: false },
}

/**
 * S3-35 — there is no "new note" form. The note is created with a default
 * title and you are put straight into it; naming, filing and tagging are
 * edits on a note that already exists rather than gates in front of writing
 * one. The route exists so "New note" is a real link that can be opened in a
 * new tab, bookmarked, or hit from the keyboard.
 */
export default function CreateNotePage() {
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-10">
      {/* useSearchParams needs a boundary during prerender. */}
      <Suspense fallback={null}>
        <CreateNote />
      </Suspense>
    </main>
  )
}
