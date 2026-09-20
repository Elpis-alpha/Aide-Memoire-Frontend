import { format, isThisYear } from 'date-fns'

/**
 * An absolute date, deliberately.
 *
 * A relative label ("3 hours ago") has to read the clock during render, which
 * is both impure and actively wrong on these pages: the public note is a
 * cached Server Component, so "3 hours ago" would be frozen at whatever it was
 * when the cache entry was written and stay that way for the whole revalidate
 * window. The exact value always goes in `dateTime` for machines.
 *
 * Replaces moment, which shipped every locale to do this.
 */
export function PublishedDate({ iso }: { iso: string }) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null

  return <time dateTime={iso}>{format(date, isThisYear(date) ? 'd MMMM' : 'd MMMM yyyy')}</time>
}
