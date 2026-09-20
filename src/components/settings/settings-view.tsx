'use client'

import { useMe } from '@/hooks/use-api'
import { DangerPanel } from '@/components/settings/danger-panel'
import { ProfilePanel } from '@/components/settings/profile-panel'
import { SecurityPanel } from '@/components/settings/security-panel'
import { QueryError, QuerySkeleton } from '@/components/query-state'

/**
 * Every panel needs the same user record, so it is fetched once here and
 * passed down rather than each panel calling `useMe` and each having its own
 * loading state.
 */
export function SettingsView() {
  const { data: me, isPending, isError, error, refetch } = useMe()

  if (isPending) return <QuerySkeleton label="Loading your settings" rows={3} />

  if (isError) {
    return (
      <QueryError
        title="Your settings could not be loaded"
        message={error.message}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <ProfilePanel me={me} />
      <SecurityPanel me={me} />
      <DangerPanel me={me} />
    </div>
  )
}
