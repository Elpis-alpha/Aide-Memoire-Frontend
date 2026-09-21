import type { Metadata } from 'next'
import { SettingsView } from '@/components/settings/settings-view'

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false },
}

export default function SettingsPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-2xl px-5 py-8">
      <h1 className="font-serif text-display font-semibold tracking-tight text-ink">Settings</h1>
      <div className="mt-3 h-0.5 bg-rule-major" />
      <div className="mt-8">
        <SettingsView />
      </div>
    </main>
  )
}
