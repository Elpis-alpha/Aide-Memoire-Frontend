import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next 16 renamed this convention from `middleware` to `proxy`; the behaviour
 * is unchanged.
 *
 * S2-25 — route protection used to be a `useEffect` in each page that
 * redirected after the component had already mounted, so unauthenticated
 * visitors saw a flash of private chrome and every guarded page re-implemented
 * the check. It happens here now, before any HTML is sent.
 *
 * This is a gate, not an authorisation decision: it only looks for the
 * presence of the session cookie. The cookie is httpOnly and signed, and the
 * proxy has no business holding the secret — the API verifies it on every
 * request and is the actual boundary. A forged cookie gets you a redirect to
 * the login page one render later, never data.
 */

const ACCESS_COOKIE = 'am_access'
const REFRESH_COOKIE = 'am_refresh'

/** Everything under these prefixes requires a session. */
const PROTECTED = [
  '/me',
  '/note',
  '/section',
  '/search',
  '/tag/private',
  '/settings',
  // Confirming a token is an authenticated POST, so an anonymous visitor
  // arriving from the email link should sign in first rather than watch the
  // request fail with a 401 they cannot act on.
  '/verify',
]

/** Signed-in users are sent away from these. */
const AUTH_ONLY = ['/login', '/signup']

const isMatch = (pathname: string, prefixes: string[]) =>
  prefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // A refresh cookie without an access cookie means the session is alive but
  // the short-lived token has expired. Let it through: the client refreshes on
  // mount rather than bouncing someone to the login page mid-session.
  const hasSession =
    request.cookies.has(ACCESS_COOKIE) || request.cookies.has(REFRESH_COOKIE)

  if (isMatch(pathname, PROTECTED) && !hasSession) {
    const login = new URL('/login', request.url)
    // Preserved so signing in returns you to where you were headed.
    login.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(login)
  }

  if (isMatch(pathname, AUTH_ONLY) && hasSession) {
    return NextResponse.redirect(new URL('/me', request.url))
  }

  return NextResponse.next()
}

export const config = {
  /*
   * Skips Next internals, the rewritten API routes and anything with a file
   * extension, so static assets are not run through this on every request.
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)'],
}
