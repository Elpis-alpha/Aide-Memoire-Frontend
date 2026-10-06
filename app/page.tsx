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
      <header className="mx-auto w-full max-w-6xl px-5 pt-5">
        <div className="flex items-baseline justify-between">
          <span className="font-serif text-lead font-semibold tracking-tight">Aide-mémoire</span>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-8 items-center px-2 text-small text-ink-muted hover:text-accent"
            >
              Sign in
            </Link>
            <Button asChild variant="primary" size="sm">
              <Link href="/signup">Create an account</Link>
            </Button>
          </nav>
        </div>
        <div className="mt-3 h-0.5 bg-rule-major" />
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl px-5 pb-24">
        {/* Asymmetric: the claim left, the three facts as a numbered column
            right. Centred against each other — bottom-aligning them left a
            blank 130px above the headline whenever the column was the taller. */}
        <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
          <div>
            <h1 className="font-serif text-hero font-semibold leading-[1.08] tracking-tight text-ink">
              Notes you can actually find again.
            </h1>
            <p className="mt-5 max-w-[var(--measure-prose)] text-lead text-ink-muted">
              An aide-mémoire is a short written reminder of what was agreed. This one keeps yours
              in sections, lets tags cut across them, and publishes only what you choose.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="primary" size="lg">
                <Link href="/signup">Start writing</Link>
              </Button>
              <span className="text-small text-ink-faint">
                Free, and your notes stay private by default.
              </span>
            </div>
          </div>

          <ul className="lg:pb-1">
            {[
              ['01', 'Sections hold notes', 'Rename one and every note follows — nothing goes stale.'],
              ['02', 'Tags cut across them', 'Sections are where it lives. Tags are what it is about.'],
              ['03', 'Publish one note', 'Sharing is per note, never per folder.'],
            ].map(([n, title, body]) => (
              <li key={n} className="border-t border-rule py-3 first:border-t-0 first:pt-0">
                <span className="font-serif text-small font-semibold text-accent">{n}</span>
                <h2 className="mt-0.5 font-medium text-ink">{title}</h2>
                <p className="mt-1 text-small text-ink-muted">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* The demo is the product. Type in it. The promise that nothing is
            saved is said before the first keystroke, in readable type — it was
            a micro-caption underneath. */}
        <section className="mt-12" aria-labelledby="try-it">
          <h2 id="try-it" className="font-medium text-ink">
            Try the editor
          </h2>
          <p className="mb-3 mt-1 text-small text-ink-muted">
            This is the real editor. Nothing you type here is saved.
          </p>
          <HeroEditor />
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-small text-ink-faint">
          <span>Aide-mémoire</span>
          <Link href="/privacy" className="inline-flex min-h-8 items-center hover:text-accent">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  )
}
