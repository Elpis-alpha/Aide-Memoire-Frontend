import { Suspense } from 'react'
import type { Metadata } from 'next'
import { VerifyEmail } from '@/components/verify-email'

export const metadata: Metadata = {
  title: 'Verify your email',
  robots: { index: false },
}

export default function VerifyPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-md px-5 py-16">
      {/* useSearchParams needs a boundary during prerender. */}
      <Suspense fallback={null}>
        <VerifyEmail />
      </Suspense>
    </main>
  )
}
