'use client'

import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from '@/lib/api'

/**
 * S2-22 / S2-23 / S2-26 — server state lives here now. The old code fetched in
 * `useEffect` with hand-rolled loading and error flags in roughly forty
 * components, which is how the sidebar ended up issuing the same request three
 * times on one page load. Caching and deduplication are the fix.
 */
export function Providers({ children }: { children: ReactNode }) {
  // Created per mount, not at module scope, so server renders never share a
  // cache between requests.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // Retrying a 401 or a 404 just delays the inevitable.
              if (error instanceof ApiError && error.status < 500 && error.status !== 408) {
                return false
              }
              return failureCount < 2
            },
          },
          mutations: { retry: false },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
