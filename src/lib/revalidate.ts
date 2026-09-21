'use server'

import { updateTag } from 'next/cache'
import { PUBLIC_ALL, publicTags } from './cache-tags'

/**
 * On-demand revalidation of the public pages.
 *
 * Mutations go from the browser straight to the API through the same-origin
 * rewrite, so Next's server never sees them and has no idea a note stopped
 * being public. This Server Action is the missing signal: the mutation hooks
 * call it once the API has confirmed the change.
 *
 * A Server Action rather than a route handler for three reasons. It is typed
 * end to end. It keeps the purge off the URL space — `/api/*` is rewritten to
 * the backend, so a handler mounted there would depend on filesystem routes
 * out-ranking an `afterFiles` rewrite, which is a subtle thing to rest a
 * privacy control on. And `updateTag` is the only call that expires a tag
 * *immediately*: Next 16 deprecated single-argument `revalidateTag` in favour
 * of `revalidateTag(tag, profile)`, which schedules expiry rather than forcing
 * it, and `updateTag` refuses to run anywhere but a Server Action.
 *
 * Like any Server Action this is reachable by anyone who can get hold of its
 * id. That is acceptable here: the worst an attacker achieves is a cache miss
 * and a refetch from an API that rate-limits them anyway. It reveals nothing
 * and it cannot make a private note public.
 */

export type PublicPurge = {
  noteIds?: string[]
  sectionIds?: string[]
  tagIds?: string[]
  /**
   * Drop every public page. Used for account deletion, where the alternative
   * is enumerating the account's public notes, sections and tags from a client
   * cache that is about to be thrown away — and being wrong leaves someone's
   * content readable after they asked for it all to go.
   */
  all?: boolean
}

export async function purgePublicPages(purge: PublicPurge): Promise<void> {
  if (purge.all) {
    updateTag(PUBLIC_ALL)
    return
  }

  for (const id of purge.noteIds ?? []) updateTag(publicTags.note(id))
  for (const id of purge.sectionIds ?? []) updateTag(publicTags.section(id))
  for (const id of purge.tagIds ?? []) updateTag(publicTags.tag(id))
}
