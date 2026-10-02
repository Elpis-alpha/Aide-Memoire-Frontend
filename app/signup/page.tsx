import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'
import { Label } from '@/components/ui/label'

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Start keeping notes on Aide-mémoire.',
  robots: { index: false },
}

export default function SignupPage() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-[26rem] overflow-hidden rounded-md border border-rule bg-surface shadow-lift-2">
        {/* The card's masthead. A link, so the logo still gets you home. */}
        <div className="flex items-baseline justify-between border-b border-rule-hair px-6 py-4">
          <Link href="/" className="font-serif text-lead font-semibold tracking-tight text-ink hover:text-accent">
            Aide-mémoire
          </Link>
          <Label>Create account</Label>
        </div>

        <div className="px-6 py-6">
          {/*
            The h1 stays. Phase 5 fixed `page-has-heading-one` on the editor by
            adding a visually-hidden h1; dropping this one would reintroduce the
            same axe violation on /login and /signup. It is also the page's real
            title — the masthead above is the product's name, not this page's.
          */}
          <h1 className="font-serif text-title font-semibold tracking-tight text-ink">
            Start writing
          </h1>
          <p className="mt-1.5 mb-6 text-small text-ink-muted">
            Your notes are private until you publish them.
          </p>

          {/* useSearchParams needs a boundary during prerender. */}
          <Suspense fallback={null}>
            <AuthForm mode="signup" />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
