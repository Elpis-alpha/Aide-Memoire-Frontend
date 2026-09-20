import type { Metadata } from 'next'
import { TaggedNotes } from '@/components/tags/tagged-notes'

export const metadata: Metadata = {
  title: 'Tag',
  robots: { index: false },
}

type Props = { params: Promise<{ tagID: string }> }

/**
 * Your notes carrying a tag, published or not. The public counterpart at
 * `/tag/public/[tagID]` shows only what everyone has published, which is why
 * they are two routes rather than one that behaves differently when signed in.
 */
export default async function PrivateTagPage({ params }: Props) {
  const { tagID } = await params

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-8">
      <TaggedNotes tagID={tagID} />
    </main>
  )
}
