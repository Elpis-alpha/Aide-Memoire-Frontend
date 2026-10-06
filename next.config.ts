import type { NextConfig } from 'next'

/**
 * Where the API lives. Server-side only — the browser never needs it, because
 * requests go to /api/* on this origin and are rewritten through.
 */
const API_ORIGIN = process.env.API_ORIGIN ?? 'http://localhost:5000'

/**
 * The API sets these through helmet; this app served none. Deliberately no
 * `script-src`: a useful one needs per-request nonces (Next injects inline
 * scripts), which would turn the prerendered pages dynamic and give up the
 * edge cache. The directives below need no nonce and still close framing,
 * <base> and <object> injection and cross-site form posts.
 */
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },

  /**
   * Same-origin proxy (Phase 0.4's preferred strategy). The browser only ever
   * talks to this origin, so the API's httpOnly cookies are attributed here:
   * host-only cookie, SameSite=Lax is sufficient, and CORS never applies.
   *
   * ⚠️ API_ORIGIN must not contain a port — the OpenNext adapter matches
   * rewrites with path-to-regexp, which reads ':5000' as a named parameter and
   * fails every rewritten request. Fine in production (bare hostname); it
   * means local testing of this path needs the API on 80/443.
   */
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_ORIGIN}/api/:path*` }]
  },

  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
}

export default nextConfig
