import type { Metadata } from 'next'
import { SectionDetail } from '@/components/sections/section-detail'

export const metadata: Metadata = {
  title: 'Section',
  robots: { index: false },
}

type Props = { params: Promise<{ sectionID: string }> }

export default async function SectionPage({ params }: Props) {
  const { sectionID } = await params

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-8">
      <SectionDetail sectionID={sectionID} />
    </main>
  )
}
