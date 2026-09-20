import type { Metadata } from 'next'
import { NotesOverview } from '@/components/notes-overview'

export const metadata: Metadata = {
  title: 'Your notes',
  robots: { index: false },
}

export default function MePage() {
  return (
    <main id="main" className="mx-auto w-full max-w-5xl px-5 py-10">
      <NotesOverview />
    </main>
  )
}
