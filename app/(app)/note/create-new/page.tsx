import { Suspense } from 'react'
import type { Metadata } from 'next'
import { CreateNote } from '@/components/notes/create-note'

export const metadata: Metadata = {
  title: 'New note',
  robots: { index: false },
}

/**
 * S3-35 — there is no "new note" form: the note is created with a default title
 * and you are put straight into it; naming, filing and tagging are edits on a
 * note that already exists. This route is only the address of that action, for
 * bookmarks and new tabs. Rendering it creates nothing — the button on it does.
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
