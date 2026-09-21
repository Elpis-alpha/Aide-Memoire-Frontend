import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import d1NextTagCache from '@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache'

/**
 * Cloudflare adapter configuration.
 *
 * The spike ran with a bare `defineCloudflareConfig()` on purpose, so that a
 * failure pointed at the adapter rather than at our caching setup. The real
 * app cannot: the public pages are ISR, and `updateTag` — the on-demand purge
 * that makes unpublishing immediate — has nowhere to record a revalidation
 * unless a tag cache is bound. Without these overrides the purge still
 * *succeeds* locally and quietly does nothing in production, which is the
 * worst possible failure mode for a privacy control.
 *
 * Each override needs a Cloudflare resource to exist and be bound in
 * `wrangler.jsonc`:
 *
 *   incrementalCache  R2 bucket, binding `NEXT_INC_CACHE_R2_BUCKET`
 *   tagCache          D1 database, binding `NEXT_TAG_CACHE_D1`
 *
 * `queue: "direct"` revalidates in the same request instead of going through a
 * Durable Object. That is the right trade at this app's traffic — one extra
 * origin fetch on a stale hit, and no extra infrastructure to stand up.
 *
 * Not configured: `cachePurge`, which purges Cloudflare's *edge* cache as
 * opposed to the ISR cache. It needs either a Durable Object binding or API
 * credentials, and the public pages currently respond with
 * `Cache-Control: private, no-cache, no-store`, so the edge should not be
 * holding a copy to begin with. Confirm that against the deployed headers
 * before deciding it is unnecessary.
 *
 * UNVERIFIED — written against the installed adapter's API (1.20.6) and
 * typechecked, but never deployed. The resources below do not exist yet.
 */

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: d1NextTagCache,
  queue: 'direct',
})
