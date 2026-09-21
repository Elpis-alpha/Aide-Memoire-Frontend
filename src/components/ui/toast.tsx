'use client'

import { useEffect } from 'react'
import * as Toast from '@radix-ui/react-toast'
import { create } from 'zustand'
import { AlertCircle, Check, X } from 'lucide-react'

/**
 * Transient feedback: "Deleted", "Could not save", "Link copied".
 *
 * S3-37 noted that the old app announced everything through a floating
 * `sendMiniMessage` div that was disconnected from the thing it described and
 * invisible to screen readers. Radix's toast is a live region, so these are
 * announced; anything that belongs *next to a field* still belongs there and
 * should not be a toast.
 */

export type Tone = 'info' | 'error'

type Item = { id: number; message: string; tone: Tone }

type ToastState = {
  items: Item[]
  push: (message: string, tone?: Tone) => void
  dismiss: (id: number) => void
}

let nextId = 0

const useToastStore = create<ToastState>(set => ({
  items: [],
  push: (message, tone = 'info') =>
    set(state => ({ items: [...state.items, { id: ++nextId, message, tone }] })),
  dismiss: id => set(state => ({ items: state.items.filter(item => item.id !== id) })),
}))

/**
 * Callable outside React — mutations report from callbacks that are not
 * components, and threading a hook through every one of them adds nothing.
 */
export const toast = {
  show: (message: string) => useToastStore.getState().push(message, 'info'),
  error: (message: string) => useToastStore.getState().push(message, 'error'),
}

export function Toaster() {
  const items = useToastStore(state => state.items)
  const dismiss = useToastStore(state => state.dismiss)

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      {items.map(item => (
        <ToastItem key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
      ))}

      <Toast.Viewport className="fixed bottom-0 right-0 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 p-4 outline-none" />
    </Toast.Provider>
  )
}

function ToastItem({ item, onDismiss }: { item: Item; onDismiss: () => void }) {
  // Radix unmounts on its own timer; this keeps the store from growing
  // unboundedly over a long session.
  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <Toast.Root
      onOpenChange={open => !open && onDismiss()}
      // An error is a message the user needs now; an acknowledgement can wait
      // for a pause in what the screen reader is already saying.
      type={item.tone === 'error' ? 'foreground' : 'background'}
      className={
        item.tone === 'error'
          ? 'flex items-start gap-3 rounded-md border border-rule border-l-2 border-l-correct bg-correct-soft px-4 py-3 shadow-lift-2'
          : 'flex items-start gap-3 rounded-md border border-rule border-l-2 border-l-accent bg-surface px-4 py-3 shadow-lift-2'
      }
    >
      {item.tone === 'error' ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-correct" aria-hidden="true" />
      ) : (
        <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
      )}
      <Toast.Description
        className={item.tone === 'error' ? 'flex-1 text-small text-correct' : 'flex-1 text-small text-ink'}
      >
        {item.message}
      </Toast.Description>

      <Toast.Close
        aria-label="Dismiss"
        className="-mr-1 -mt-0.5 rounded-md p-1 text-ink-faint transition-colors hover:text-ink"
      >
        <X className="size-4" />
      </Toast.Close>
    </Toast.Root>
  )
}
