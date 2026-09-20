import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Start keeping notes on Aide-mémoire.',
  robots: { index: false },
}

export default function SignupPage() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-5 py-12">
      <Link href="/" className="font-serif text-lead font-semibold tracking-tight">
        Aide-mémoire
      </Link>

      <h1 className="mt-8 font-serif text-display font-semibold tracking-tight text-ink">
        Start writing
      </h1>
      <p className="mt-2 mb-7 text-ink-muted">
        Your notes are private until you publish them.
      </p>

      <Suspense fallback={null}>
        <AuthForm mode="signup" />
      </Suspense>
    </main>
  )
}
