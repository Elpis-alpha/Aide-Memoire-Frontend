import type { NextConfig } from 'next'

/**
 * Where the API lives. Server-side only — the browser never needs it, because
 * requests go to /api/* on this origin and are rewritten through.
 */
const API_ORIGIN = process.env.API_ORIGIN ?? 'http://localhost:5000'

const nextConfig: NextConfig = {
  reactStrictMode: true,

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
