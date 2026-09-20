import type { Metadata } from 'next'
import { SectionIndex } from '@/components/sections/section-index'

export const metadata: Metadata = {
  title: 'Sections',
  robots: { index: false },
}

export default function SectionsPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-8">
      <SectionIndex />
    </main>
  )
}
