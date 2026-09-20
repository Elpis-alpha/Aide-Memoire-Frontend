'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { PanelLeft, Search } from 'lucide-react'
import { NoteRail } from '@/components/layout/note-rail'
import { UserMenu } from '@/components/layout/user-menu'
import { useHydrated } from '@/hooks/use-hydrated'
import { useUiStore } from '@/stores/ui'
import { cn } from '@/lib/utils'

/**
 * The chrome around every signed-in page: a header, and the note tree as a
 * resizable column on a wide screen or a slide-over on a narrow one.
 *
 * Layout preferences are persisted (`am-ui`), which rehydrates *after* the
 * server-rendered HTML. Applying them before mount would be a hydration
 * mismatch, so the first client render deliberately matches the server and the
 * stored values take effect on the next one.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated()
  const sidebarOpen = useUiStore(state => state.sidebarOpen)
  const toggleSidebar = useUiStore(state => state.toggleSidebar)
  const railWidth = useUiStore(state => state.railWidth)

  const [mobileOpen, setMobileOpen] = useState(false)

  const railVisible = hydrated ? sidebarOpen : true

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-rule bg-surface/85 px-3 backdrop-blur">
        {/* Desktop: collapses the column. Mobile: opens the slide-over. */}
        <button
          type="button"
          aria-label={railVisible ? 'Hide the note list' : 'Show the note list'}
          aria-expanded={railVisible}
          onClick={toggleSidebar}
          className="hidden size-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-sunken hover:text-ink lg:inline-flex"
        >
          <PanelLeft className="size-4" />
        </button>

        <button
          type="button"
          aria-label="Open the note list"
          onClick={() => setMobileOpen(true)}
          className="inline-flex size-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-sunken hover:text-ink lg:hidden"
        >
          <PanelLeft className="size-4" />
        </button>

        <Link
          href="/me"
          className="font-serif text-lead font-semibold tracking-tight text-ink hover:text-accent"
        >
          Aide-mémoire
        </Link>

        <SearchBox />

        <UserMenu />
      </header>

      <div className="flex min-h-0 flex-1">
        {railVisible && (
          <>
            <aside
              // Only an explicit width once the stored one is known.
              style={hydrated ? { width: railWidth } : undefined}
              className="hidden shrink-0 border-r border-rule bg-surface lg:block lg:w-70"
            >
              <div className="sticky top-14 max-h-[calc(100dvh-3.5rem)]">
                <NoteRail />
              </div>
            </aside>

            <RailResizer />
          </>
        )}

        <div className="min-w-0 flex-1">{children}</div>
      </div>

      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[1px] lg:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[min(20rem,85vw)] border-r border-rule bg-surface shadow-xl lg:hidden">
            <Dialog.Title className="sr-only">Your notes</Dialog.Title>
            <Dialog.Description className="sr-only">
              Sections and notes. Selecting one closes this panel.
            </Dialog.Description>
            <NoteRail onNavigate={() => setMobileOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

/**
 * The divider between the rail and the page.
 *
 * A separator that can only be dragged is unusable without a mouse, so this is
 * a focusable `separator` that also responds to the arrow keys — the same
 * pattern a native split view uses.
 */
function RailResizer() {
  const railWidth = useUiStore(state => state.railWidth)
  const setRailWidth = useUiStore(state => state.setRailWidth)
  const dragging = useRef(false)

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!dragging.current) return
      setRailWidth(event.clientX)
    }
    const stop = () => {
      dragging.current = false
      document.body.style.removeProperty('cursor')
      document.body.style.removeProperty('user-select')
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', stop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', stop)
    }
  }, [setRailWidth])

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize the note list"
      aria-valuenow={railWidth}
      aria-valuemin={200}
      aria-valuemax={480}
      tabIndex={0}
      onPointerDown={() => {
        dragging.current = true
        // Held for the duration of the drag so the cursor does not flicker
        // as it passes over text.
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
      }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') setRailWidth(railWidth - 16)
        else if (event.key === 'ArrowRight') setRailWidth(railWidth + 16)
        else return
        event.preventDefault()
      }}
      className={cn(
        'hidden w-1 shrink-0 cursor-col-resize bg-transparent transition-colors',
        'hover:bg-accent-soft focus-visible:bg-accent-soft lg:block',
      )}
    />
  )
}

function SearchBox() {
  const router = useRouter()
  const [q, setQ] = useState('')

  return (
    <form
      role="search"
      className="ml-auto flex items-center"
      onSubmit={event => {
        event.preventDefault()
        const trimmed = q.trim()
        if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      }}
    >
      <label htmlFor="rail-search" className="sr-only">
        Search your notes
      </label>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
          aria-hidden="true"
        />
        <input
          id="rail-search"
          type="search"
          value={q}
          onChange={event => setQ(event.target.value)}
          placeholder="Search"
          className="h-8 w-36 rounded-md border border-rule bg-paper pl-8 pr-2 text-small text-ink transition-[width,border-color] placeholder:text-ink-faint hover:border-rule-strong focus:w-56 sm:w-48"
        />
      </div>
    </form>
  )
}
