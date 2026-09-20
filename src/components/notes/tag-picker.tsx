'use client'

import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Plus, X } from 'lucide-react'
import { useCreateTag, useTagSearch } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'

/**
 * Tags on a note, edited in place.
 *
 * S3-35 — this used to be step four of a modal wizard you had to walk through
 * before the note could be saved at all. The note already exists by the time
 * anyone sees this, so adding a tag is an ordinary edit that can be skipped.
 */
export function TagPicker({
  tags,
  onAdd,
  onRemove,
  busy,
}: {
  tags: Array<{ _id: string; name: string }>
  onAdd: (tagId: string) => void
  onRemove: (tagId: string) => void
  busy?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const results = useTagSearch(query)
  const createTag = useCreateTag()

  const attached = new Set(tags.map(tag => tag._id))
  const matches = (results.data ?? []).filter(tag => !attached.has(tag._id))
  const trimmed = query.trim()

  // Only offer to create when nothing already carries that exact name.
  const exactExists =
    (results.data ?? []).some(tag => tag.name.toLowerCase() === trimmed.toLowerCase()) ||
    tags.some(tag => tag.name.toLowerCase() === trimmed.toLowerCase())

  const add = (tagId: string) => {
    onAdd(tagId)
    setQuery('')
    setOpen(false)
  }

  const create = async () => {
    try {
      const tag = await createTag.mutateAsync(trimmed)
      add(tag._id)
    } catch {
      toast.error('That tag could not be created.')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map(tag => (
        <span
          key={tag._id}
          className="inline-flex items-center gap-1 rounded-sm bg-sunken py-0.5 pl-2 pr-1 text-small text-ink-muted"
        >
          {tag.name}
          <button
            type="button"
            aria-label={`Remove tag ${tag.name}`}
            disabled={busy}
            onClick={() => onRemove(tag._id)}
            className="rounded-sm p-0.5 text-ink-faint transition-colors hover:bg-correct-soft hover:text-correct disabled:opacity-50"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-small">
            <Plus className="size-3.5" />
            Tag
          </Button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="z-50 w-64 rounded-lg border border-rule bg-surface p-2 shadow-xl"
          >
            <label htmlFor="tag-search" className="sr-only">
              Find or create a tag
            </label>
            <input
              id="tag-search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              onKeyDown={event => {
                if (event.key !== 'Enter') return
                event.preventDefault()
                const first = matches[0]
                if (first) add(first._id)
                else if (trimmed && !exactExists) void create()
              }}
              placeholder="Find or create"
              autoComplete="off"
              className="w-full rounded-md border border-rule bg-paper px-2 py-1.5 text-small text-ink placeholder:text-ink-faint"
            />

            <ul className="mt-2 max-h-56 overflow-y-auto">
              {matches.map(tag => (
                <li key={tag._id}>
                  <button
                    type="button"
                    onClick={() => add(tag._id)}
                    className="w-full truncate rounded-md px-2 py-1.5 text-left text-small text-ink transition-colors hover:bg-sunken"
                  >
                    {tag.name}
                  </button>
                </li>
              ))}

              {trimmed && !exactExists && (
                <li>
                  <button
                    type="button"
                    disabled={createTag.isPending}
                    onClick={() => void create()}
                    className="w-full truncate rounded-md px-2 py-1.5 text-left text-small text-accent transition-colors hover:bg-sunken disabled:opacity-50"
                  >
                    Create “{trimmed}”
                  </button>
                </li>
              )}

              {!trimmed && matches.length === 0 && (
                <li className="px-2 py-1.5 text-small text-ink-faint">Type to search your tags.</li>
              )}
            </ul>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
