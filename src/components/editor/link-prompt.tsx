'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'

/**
 * Replaces `window.prompt`, which cannot be styled, cannot be tested, blocks
 * the main thread, and is silently suppressed in some browsers.
 *
 * Radix gives the focus trap, escape handling and `aria-modal` wiring, so the
 * dialog behaves for keyboard and screen-reader users without hand-rolling it.
 */

export type LinkPromptState =
  | { open: false }
  | { open: true; current: string; resolve: (href: string | null) => void }

export function LinkPrompt({ state, onClose }: { state: LinkPromptState; onClose: () => void }) {
  if (!state.open) return null

  /*
   * Mounted only while open, and keyed on the value it opens with, so the
   * initial state comes from `useState` rather than being synced in an effect.
   * Syncing props into state after render is the pattern that produces the
   * extra render and the momentarily stale field.
   */
  return (
    <LinkPromptDialog
      key={state.current}
      current={state.current}
      resolve={state.resolve}
      onClose={onClose}
    />
  )
}

function LinkPromptDialog({
  current,
  resolve,
  onClose,
}: {
  current: string
  resolve: (href: string | null) => void
  onClose: () => void
}) {
  const [href, setHref] = useState(current)

  const settle = (value: string | null) => {
    resolve(value)
    onClose()
  }

  const normalise = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return ''
    // A bare domain is what people actually type.
    if (/^(https?:|mailto:)/i.test(trimmed)) return trimmed
    if (trimmed.includes('@') && !trimmed.includes('/')) return `mailto:${trimmed}`
    return `https://${trimmed}`
  }

  return (
    <Dialog.Root open onOpenChange={open => !open && settle(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[1px]" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-md border border-rule bg-surface p-5 shadow-lift-3"
          onOpenAutoFocus={event => {
            // Focus the field, not the first button.
            event.preventDefault()
            const input = document.getElementById('link-href')
            if (input instanceof HTMLInputElement) input.select()
          }}
        >
          <Dialog.Title className="text-lead font-semibold text-ink">
            {current ? 'Edit link' : 'Add link'}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-small text-ink-muted">
            Paste a web address, or clear the field to remove the link.
          </Dialog.Description>

          <form
            className="mt-4"
            onSubmit={event => {
              event.preventDefault()
              settle(normalise(href))
            }}
          >
            <label htmlFor="link-href" className="sr-only">
              Web address
            </label>
            <input
              id="link-href"
              value={href}
              onChange={event => setHref(event.target.value)}
              placeholder="example.com"
              inputMode="url"
              autoComplete="url"
              className="w-full rounded-md border border-rule bg-paper px-3 py-2 text-base text-ink placeholder:text-ink-faint"
            />

            <div className="mt-4 flex justify-end gap-2">
              {current && (
                <Button variant="ghost" onClick={() => settle('')} className="mr-auto text-correct">
                  Remove link
                </Button>
              )}
              <Button variant="secondary" onClick={() => settle(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {current ? 'Update link' : 'Add link'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
