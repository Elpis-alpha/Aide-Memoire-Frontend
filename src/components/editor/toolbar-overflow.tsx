'use client'

import * as Popover from '@radix-ui/react-popover'
import { MoreHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import type { ToolbarItemName } from './toolbar-items'

/**
 * The long tail of toolbar controls on a narrow screen.
 *
 * Every control stays a real <button> in DOM order, so tab reaches all of
 * them. A selection-bubble-menu-only approach would look better and would
 * quietly cost keyboard users half the toolbar.
 */
export function ToolbarOverflow({
  groups,
  renderItem,
}: {
  groups: { label: string; items: ToolbarItemName[] }[]
  renderItem: (name: ToolbarItemName) => ReactNode
}) {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="More formatting controls"
        className="flex size-8 shrink-0 items-center justify-center border-l border-rule-hair text-ink-muted transition-colors duration-[var(--dur-1)] hover:bg-sunken hover:text-ink data-[state=open]:bg-accent-soft data-[state=open]:text-accent"
      >
        <MoreHorizontal className="size-4" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={4}
          className="z-50 w-64 rounded-md border border-rule bg-surface p-2 shadow-lift-2"
        >
          {groups.map(group => (
            <div key={group.label} className="mb-2 last:mb-0">
              <Label className="mb-1 block">{group.label}</Label>
              <div className="flex flex-wrap gap-0.5">
                {group.items.map(name => renderItem(name))}
              </div>
            </div>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
