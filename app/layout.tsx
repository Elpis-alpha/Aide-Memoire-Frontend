import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Spectral } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

/** Chrome: labels, navigation, controls. */
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

/**
 * Note content. A screen-first serif from a Paris foundry — it reads well at
 * length, and this is an app whose whole job is text you wrote yourself.
 */
const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Aide-mémoire',
    // S3-38 — every page sets its own title through this.
    template: '%s — Aide-mémoire',
  },
  description: 'Write notes, file them in sections, tag them, and share the ones you choose.',
  openGraph: {
    type: 'website',
    siteName: 'Aide-mémoire',
    images: ['/images/open-graph.png'],
  },
  icons: { icon: '/favicon.ico' },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f6f8' },
    { media: '(prefers-color-scheme: dark)', color: '#0f131b' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${spectral.variable}`}>
      <head>
        {/*
          Applies the saved theme before first paint. Without this the page
          renders in the system theme and then snaps to the chosen one.

          The markup below is a fixed string literal with no interpolation —
          nothing from a user, a prop or a request reaches it, and the value it
          reads from localStorage is only ever compared against two constants,
          never written to the DOM. That is what makes the raw injection safe
          here; keep it that way if you edit it.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('am-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:shadow-lg"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
