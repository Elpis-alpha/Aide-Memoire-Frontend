import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Aide-mémoire notes.',
  robots: { index: false },
}

export default function LoginPage() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-5 py-12">
      <Link href="/" className="font-serif text-lead font-semibold tracking-tight">
        Aide-mémoire
      </Link>

      <h1 className="mt-8 font-serif text-display font-semibold tracking-tight text-ink">
        Welcome back
      </h1>
      <p className="mt-2 mb-7 text-ink-muted">Pick up where you left off.</p>

      {/* useSearchParams needs a boundary during prerender. */}
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
    </main>
  )
}
