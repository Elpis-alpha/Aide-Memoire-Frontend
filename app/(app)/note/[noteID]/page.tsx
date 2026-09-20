import type { Metadata } from 'next'
import { NoteEditor } from '@/components/notes/note-editor'

/**
 * The title is set from the note on the client once it loads — the note is
 * private, so there is nothing to render on the server without forwarding the
 * session, and nothing to index either.
 */
export const metadata: Metadata = {
  title: 'Note',
  robots: { index: false },
}

type Props = { params: Promise<{ noteID: string }> }

export default async function NotePage({ params }: Props) {
  const { noteID } = await params

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-8">
      <NoteEditor noteID={noteID} />
    </main>
  )
}
