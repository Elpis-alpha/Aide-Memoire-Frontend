/**
 * Cache tags for the public, ISR-rendered pages.
 *
 * S2-24 made the public pages cacheable Server Components with a five-minute
 * window, which is the right default for reads. The cost showed up in Phase 4:
 * after a note was unpublished the API returned 404 while the cached page kept
 * serving the full body for up to five more minutes. People reasonably read
 * "unpublish" as "take it down now", so the window is a privacy gap rather
 * than a staleness nit.
 *
 * Tagging every public fetch is what makes the take-down immediate: the
 * `purgePublicPages` action revalidates the tags, which drops both the fetch
 * cache entry and the cached route that was built from it.
 *
 * Deliberately *not* purged: ordinary edits to an already-public note. Autosave
 * PATCHes on every debounce, so purging there would mean the public pages were
 * never cached at all. Five minutes of stale prose is the bargain ISR exists to
 * make; five minutes of visible-after-unpublish is not.
 */

/** On every public fetch, so account deletion can drop all of them at once. */
export const PUBLIC_ALL = 'public'

export const PUBLIC_REVALIDATE = 300

export const publicTags = {
  note: (id: string) => `public-note:${id}`,
  section: (id: string) => `public-section:${id}`,
  tag: (id: string) => `public-tag:${id}`,
}
