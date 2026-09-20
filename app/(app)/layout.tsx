import { AppShell } from '@/components/layout/app-shell'

/**
 * Everything in this route group is behind the session gate in `proxy.ts` and
 * shares the same chrome. The group is a naming device only — `(app)` does not
 * appear in any URL, so `/me` stays `/me`.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
