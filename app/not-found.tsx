import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Page not found' }

/**
 * An empty or missing screen is an invitation to act, not an apology.
 *
 * Shared by every route that can miss: an unknown address, a note that was
 * deleted, a note that was never made public. So it says what is true of all of
 * them rather than assuming it was a note.
 */
export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 text-center">
      <h1 className="font-serif text-display font-semibold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-3 text-ink-muted">
        That address does not lead anywhere. If it was a note, it may have been deleted or
        never made public.
      </p>
      <div className="mt-7 flex justify-center gap-3">
        <Button asChild variant="primary">
          <Link href="/">Go to the home page</Link>
        </Button>
        {/* "Open", not "Your": a signed-out visitor is sent to sign in first. */}
        <Button asChild variant="secondary">
          <Link href="/me">Open your notes</Link>
        </Button>
      </div>
    </main>
  )
}
