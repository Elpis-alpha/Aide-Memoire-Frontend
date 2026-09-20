import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Client state only — layout, theme, transient UI. Anything that comes from
 * the API lives in TanStack Query instead, so there is exactly one copy of it.
 * Mixing the two is what made the old Redux store hard to reason about.
 */

export type Theme = 'light' | 'dark' | 'system'

type UiState = {
  theme: Theme
  setTheme: (theme: Theme) => void

  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  /** Width of the note tree rail, dragged by the divider. */
  railWidth: number
  setRailWidth: (width: number) => void
}

/**
 * Written separately from the persisted store so the inline no-flash script in
 * the root layout can read the theme synchronously, before any JavaScript
 * bundle loads. It cannot parse the store's JSON blob at that point.
 */
export const THEME_STORAGE_KEY = 'am-theme'

const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return

  if (theme === 'system') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', theme)

  try {
    if (theme === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private browsing or blocked storage: the theme still applies for this
    // session, it just will not survive a reload.
  }
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: theme => {
        applyTheme(theme)
        set({ theme })
      },

      sidebarOpen: true,
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setSidebarOpen: sidebarOpen => set({ sidebarOpen }),

      railWidth: 280,
      setRailWidth: railWidth => set({ railWidth: Math.min(480, Math.max(200, railWidth)) }),
    }),
    {
      name: 'am-ui',
      // Only the durable preferences are persisted; nothing here is
      // authoritative, so a cleared store just restores the defaults.
      partialize: state => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        railWidth: state.railWidth,
      }),
      onRehydrateStorage: () => state => {
        if (state) applyTheme(state.theme)
      },
    },
  ),
)
