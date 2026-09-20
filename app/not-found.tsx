import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * An empty or missing screen is an invitation to act, not an apology.
 */
export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 text-center">
      <h1 className="font-serif text-display font-semibold tracking-tight text-ink">
        This note is not here
      </h1>
      <p className="mt-3 text-ink-muted">
        It may have been deleted, or it was never made public.
      </p>
      <div className="mt-7 flex justify-center gap-3">
        <Button asChild variant="primary">
          <Link href="/">Go to the home page</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/me">Your notes</Link>
        </Button>
      </div>
    </main>
  )
}
