'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * S2-34 — the old banner appeared `randomAmong(4000, 10000)` milliseconds
 * after load as a full-screen overlay that swallowed pointer events, and
 * offered a single "Accept Cookies" button while the auth cookie was set
 * regardless of the answer. That is both hostile and not consent.
 *
 * This one:
 *   - appears as soon as the choice is known, never on a timer
 *   - is a bottom bar, so nothing behind it is blocked
 *   - offers a real reject that is recorded and honoured
 *
 * The honest scope of the question: this app sets one cookie family, the
 * session itself, which is strictly necessary and exempt from consent — you
 * cannot be signed in without it. Rejecting here means no optional cookie is
 * ever set, which today means no analytics is loaded. If anything optional is
 * ever added, it must check `hasOptionalConsent()` before it runs.
 *
 * The answer is kept in `localStorage` rather than in a cookie, so declining
 * does not itself write the thing being declined.
 */

const STORAGE_KEY = 'am-cookie-consent'

type Choice = 'accepted' | 'rejected'
/** `unknown` is the server's answer: it cannot see the browser's storage. */
type Snapshot = Choice | 'unanswered' | 'unknown'

let listeners: Array<() => void> = []

const subscribe = (notify: () => void) => {
  listeners = [...listeners, notify]
  // Answering in one tab settles it in the others too.
  window.addEventListener('storage', notify)

  return () => {
    listeners = listeners.filter(listener => listener !== notify)
    window.removeEventListener('storage', notify)
  }
}

/** Returns a primitive, so React can compare snapshots by value. */
const getSnapshot = (): Snapshot => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'accepted' || stored === 'rejected' ? stored : 'unanswered'
  } catch {
    // Blocked storage: ask again rather than assuming consent.
    return 'unanswered'
  }
}

const getServerSnapshot = (): Snapshot => 'unknown'

const answer = (value: Choice) => {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // The banner still closes for this session; it will ask again later.
  }
  for (const listener of listeners) listener()
}

/** For any future optional cookie or script. Absence of an answer is not yes. */
export const hasOptionalConsent = () => getSnapshot() === 'accepted'

export function CookieBanner() {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (choice !== 'unanswered') return null

  return (
    <div
      // A complementary region, not a dialog: it takes no focus and traps
      // none, so it cannot swallow the click someone was already making.
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-rule-major bg-surface"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center">
        <p className="flex-1 text-small text-ink-muted">
          Aide-mémoire uses one cookie to keep you signed in. That one is required for the
          app to work. Anything optional needs your say-so.{' '}
          <Link href="/privacy" className="text-accent underline underline-offset-2">
            Privacy
          </Link>
        </p>

        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="sm" onClick={() => answer('rejected')}>
            Reject optional
          </Button>
          <Button variant="primary" size="sm" onClick={() => answer('accepted')}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
