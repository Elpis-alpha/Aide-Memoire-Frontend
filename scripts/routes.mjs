/** The ten routes Phase 5 checked. Both the axe run and CI use this list. */
export const ROUTES = [
  '/',
  '/privacy',
  '/login',
  '/signup',
  '/me',
  '/settings',
  '/section',
  '/search?q=note',
  '/note/create-new',
  '/public/note/DEMO_NOTE_ID',
]

/** Routes reachable without a session. The rest need AUTH_COOKIE set. */
export const PUBLIC_ROUTES = new Set(['/', '/privacy', '/login', '/signup'])
