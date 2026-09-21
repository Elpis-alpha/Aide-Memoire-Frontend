import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What Aide-mémoire stores, why, and how to remove it.',
}

/**
 * Short on purpose. The cookie notice links here, and a notice that links to
 * nothing is worse than no notice.
 */
export default function PrivacyPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <h1 className="font-serif text-display font-semibold tracking-tight text-ink">Privacy</h1>
      <div className="mt-3 h-0.5 bg-rule-major" />

      <div className="prose-note mt-8">
        <h2>Cookies</h2>
        <p>
          One cookie family keeps you signed in: a short-lived access token and a rotating
          refresh token. Both are <code>HttpOnly</code>, so no script on the page can read
          them, and both are set only after you sign in. They are strictly necessary — the
          app cannot know who you are without them.
        </p>
        <p>
          There is no analytics, advertising or third-party tracking. If that ever changes,
          it will be loaded only for people who accepted optional cookies.
        </p>

        <h2>What is stored</h2>
        <p>
          Your name, email address, an optional biography and avatar, and the notes,
          sections and tags you create. Images you add to a note are stored on Cloudinary
          and served from there.
        </p>
        <p>
          Notes are private until you publish them. A published note is readable by anyone
          with its address and may be cached by search engines for as long as they choose.
        </p>

        <h2>Removing it</h2>
        <p>
          Deleting your account from{' '}
          <Link href="/settings">settings</Link> removes your account, notes, sections and
          tag links in a single transaction. It cannot be undone.
        </p>
      </div>

      <p className="mt-10 border-t border-rule-hair pt-6 text-small text-ink-muted">
        <Link href="/" className="hover:text-accent">
          Back to Aide-mémoire
        </Link>
      </p>
    </main>
  )
}
