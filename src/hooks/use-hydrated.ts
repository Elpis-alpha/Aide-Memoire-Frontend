'use client'

import { useSyncExternalStore } from 'react'

/** Nothing to subscribe to: the answer changes exactly once, at hydration. */
const subscribe = () => () => {}

/**
 * False while rendering on the server and during the first client render,
 * true afterwards.
 *
 * Anything read from `localStorage` — the persisted layout preferences, the
 * cookie answer — is unavailable when the HTML is produced, so using it before
 * hydration is a mismatch. `useSyncExternalStore` is the supported way to say
 * "the server and the client disagree about this, on purpose": React renders
 * the server snapshot, hydrates against it, then re-renders with the client's.
 * An effect calling `setState` would do the same thing a render later and
 * cascade.
 */
export const useHydrated = () => useSyncExternalStore(subscribe, () => true, () => false)
