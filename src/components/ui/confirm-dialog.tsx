'use client'

import { useState, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'

/**
 * Destructive actions ask first. The red correction pencil is reserved for
 * exactly this, so the colour itself is a warning rather than decoration.
 *
 * `confirmWord` turns the dialog into a type-to-confirm for the two actions
 * that cannot be undone — deleting a section, which unfiles every note in it,
 * and deleting the account.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Delete',
  confirmWord,
  pending = false,
  onConfirm,
}: {
  trigger: ReactNode
  title: string
  description: ReactNode
  confirmLabel?: string
  confirmWord?: string
  pending?: boolean
  onConfirm: () => void | Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')

  const blocked = Boolean(confirmWord) && typed.trim() !== confirmWord

  return (
    <Dialog.Root
      open={open}
      onOpenChange={next => {
        setOpen(next)
        // Reopening should not inherit a half-typed confirmation.
        if (!next) setTyped('')
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-md border border-rule bg-surface p-5 shadow-lift-3">
          <Dialog.Title className="text-lead font-semibold text-ink">{title}</Dialog.Title>
          <div className="mt-3 h-0.5 bg-rule-major" />
          <Dialog.Description className="mt-2 text-small text-ink-muted">
            {description}
          </Dialog.Description>

          {confirmWord && (
            <div className="mt-4 space-y-1.5">
              <label htmlFor="confirm-word" className="block text-small font-medium text-ink">
                Type <span className="font-semibold">{confirmWord}</span> to confirm
              </label>
              <input
                id="confirm-word"
                value={typed}
                onChange={event => setTyped(event.target.value)}
                autoComplete="off"
                className="w-full rounded-md border border-rule bg-paper px-3 py-2 text-base text-ink"
              />
            </div>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              disabled={blocked || pending}
              onClick={async () => {
                await onConfirm()
                setOpen(false)
              }}
            >
              {pending ? 'Working…' : confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
