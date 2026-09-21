'use client'

import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { FolderPlus, X } from 'lucide-react'
import { useSections } from '@/hooks/use-api'
import { SectionFormDialog } from '@/components/sections/section-form-dialog'
import { Button } from '@/components/ui/button'

/**
 * Which sections a note is filed in. A note can be in several, which is why
 * this is a set of chips rather than a single select.
 */
export function SectionPicker({
  sections,
  onAdd,
  onRemove,
  busy,
}: {
  sections: Array<{ _id: string; name: string }>
  onAdd: (sectionId: string) => void
  onRemove: (sectionId: string) => void
  busy?: boolean
}) {
  const [open, setOpen] = useState(false)
  const all = useSections()

  const attached = new Set(sections.map(section => section._id))
  const available = (all.data ?? []).filter(section => !attached.has(section._id))

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {sections.map(section => (
        <span
          key={section._id}
          className="inline-flex items-center gap-1 rounded-sm border border-rule py-0.5 pl-2 pr-1 text-small text-ink-muted"
        >
          {section.name}
          <button
            type="button"
            aria-label={`Remove from ${section.name}`}
            disabled={busy}
            onClick={() => onRemove(section._id)}
            className="rounded-sm p-0.5 text-ink-faint transition-colors hover:bg-correct-soft hover:text-correct disabled:opacity-50"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-small">
            <FolderPlus className="size-3.5" />
            File
          </Button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="z-50 w-64 rounded-md border border-rule bg-surface p-2 shadow-lift-2"
          >
            {all.isPending && <p className="px-2 py-1.5 text-small text-ink-faint">Loading…</p>}

            {all.data && available.length === 0 && (
              <p className="px-2 py-1.5 text-small text-ink-faint">
                {all.data.length === 0
                  ? 'You have no sections yet.'
                  : 'Filed in every section already.'}
              </p>
            )}

            <ul className="max-h-56 overflow-y-auto">
              {available.map(section => (
                <li key={section._id}>
                  <button
                    type="button"
                    onClick={() => {
                      onAdd(section._id)
                      setOpen(false)
                    }}
                    className="w-full truncate rounded-md px-2 py-1.5 text-left text-small text-ink transition-colors hover:bg-sunken"
                  >
                    {section.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-1 border-t border-rule pt-1">
              <SectionFormDialog
                trigger={
                  <Button variant="ghost" size="sm" className="w-full justify-start text-small">
                    <FolderPlus className="size-3.5" />
                    New section
                  </Button>
                }
                onCreated={id => {
                  onAdd(id)
                  setOpen(false)
                }}
              />
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
