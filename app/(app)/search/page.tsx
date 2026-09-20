import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchResults } from '@/components/search-results'

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false },
}

export default function SearchPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-5 py-8">
      {/* useSearchParams needs a boundary during prerender. */}
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </main>
  )
}
