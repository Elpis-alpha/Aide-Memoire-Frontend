import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroEditor } from '@/components/hero-editor'

export const metadata = {
  title: 'Aide-mémoire — notes you can actually find again',
  description:
    'Write notes, file them in sections, tag them across sections, and publish only the ones you choose.',
}

/**
 * The hero is a working editor rather than a picture of one. This is a writing
 * app: the fastest way to explain it is to let someone write in it before they
 * have an account.
 */
export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <span className="font-serif text-lead font-semibold tracking-tight">Aide-mémoire</span>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/signup">Create an account</Link>
          </Button>
        </nav>
      </header>

      <main id="main" className="mx-auto w-full max-w-5xl px-5 pb-24">
        <section className="pt-10 sm:pt-16">
          <h1 className="max-w-[18ch] font-serif text-hero font-semibold leading-[1.1] tracking-tight text-ink sm:text-[3.5rem]">
            Notes you can actually find again.
          </h1>
          <p className="mt-5 max-w-[56ch] text-lead text-ink-muted">
            An aide-mémoire is a short written reminder of what was agreed. This one keeps yours in
            sections, lets tags cut across them, and publishes only what you choose.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href="/signup">Start writing</Link>
            </Button>
            <span className="text-small text-ink-faint">Free, and your notes stay private by default.</span>
          </div>
        </section>

        {/* The demo is the product. Type in it. */}
        <section className="mt-14" aria-labelledby="try-it">
          <h2 id="try-it" className="sr-only">
            Try the editor
          </h2>
          <HeroEditor />
        </section>

        <section className="mt-20 grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className="font-serif text-title font-semibold text-ink">Sections hold notes</h3>
            <p className="mt-2 text-ink-muted">
              A note lives in as many sections as makes sense. Rename a section and every note
              follows — nothing goes stale.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-title font-semibold text-ink">Tags cut across them</h3>
            <p className="mt-2 text-ink-muted">
              Sections are where something lives. Tags are what it is about. Searching uses both.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-title font-semibold text-ink">Publish one note</h3>
            <p className="mt-2 text-ink-muted">
              Sharing is per note, never per folder. A public section still shows only the notes you
              marked public.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-small text-ink-faint">
          <span>Aide-mémoire</span>
          <Link href="/login" className="hover:text-accent">
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  )
}
