'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Check, LogOut, Monitor, Moon, Settings, Sun, User as UserIcon } from 'lucide-react'
import { useLogout, useMe } from '@/hooks/use-api'
import { useUiStore, type Theme } from '@/stores/ui'
import { toast } from '@/components/ui/toast'
import { Label } from '@/components/ui/label'

/**
 * Account and appearance, behind one control rather than scattered across the
 * chrome. Radix supplies the roving focus, typeahead and `aria-*` wiring that
 * the old `<div onClick>` menus had none of (S2-33).
 */

const THEMES: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function UserMenu() {
  const router = useRouter()
  const { data: me } = useMe()
  const logout = useLogout()
  const theme = useUiStore(state => state.theme)
  const setTheme = useUiStore(state => state.setTheme)

  const signOut = async () => {
    try {
      await logout.mutateAsync()
    } catch {
      // The local session is cleared either way; staying put would be worse.
      toast.error('Signed out locally, but the server could not be reached.')
    }
    router.push('/login')
    router.refresh()
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={me ? `Account menu for ${me.name}` : 'Account menu'}
          className="flex size-8 items-center justify-center overflow-hidden rounded-full border border-rule bg-sunken text-ink-muted transition-colors hover:border-rule-strong hover:text-ink"
        >
          {me?.avatarUrl ? (
            // Deliberately not next/image: a 32px avatar from Cloudinary is
            // already the right size, and the optimizer would bill a
            // transform per user for no visible gain.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={me.avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <UserIcon className="size-4" />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 w-56 rounded-md border border-rule bg-surface p-1 shadow-lift-2"
        >
          {me && (
            <div className="border-b border-rule-hair px-3 py-2">
              <p className="truncate font-medium text-ink">{me.name}</p>
              <p className="truncate text-small text-ink-muted">{me.email}</p>
              {!me.verified && (
                <p className="mt-1 text-micro text-correct">Email not verified</p>
              )}
            </div>
          )}

          <DropdownMenu.Item asChild>
            <Link
              href="/settings"
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-base text-ink outline-none data-[highlighted]:bg-sunken"
            >
              <Settings className="size-4 text-ink-muted" />
              Settings
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-rule-hair" />

          <DropdownMenu.Label className="px-3 py-1">
            <Label>Appearance</Label>
          </DropdownMenu.Label>

          <DropdownMenu.RadioGroup
            value={theme}
            onValueChange={value => setTheme(value as Theme)}
          >
            {THEMES.map(({ value, label, icon: Icon }) => (
              <DropdownMenu.RadioItem
                key={value}
                value={value}
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-base text-ink outline-none data-[highlighted]:bg-sunken"
              >
                <Icon className="size-4 text-ink-muted" />
                {label}
                <DropdownMenu.ItemIndicator className="ml-auto">
                  <Check className="size-4 text-accent" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Separator className="my-1 h-px bg-rule-hair" />

          <DropdownMenu.Item
            onSelect={() => void signOut()}
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-base text-ink outline-none data-[highlighted]:bg-sunken"
          >
            <LogOut className="size-4 text-ink-muted" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
