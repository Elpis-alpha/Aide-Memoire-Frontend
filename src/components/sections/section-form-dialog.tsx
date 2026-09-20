'use client'

import { useState, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { TextareaField } from '@/components/ui/textarea'
import { useCreateSection, useUpdateSection } from '@/hooks/use-api'
import { ApiError } from '@/lib/api'
import { toast } from '@/components/ui/toast'

/**
 * Creating and renaming a section are the same two fields, so they are the
 * same dialog. S3-36 — the old wizard had a different, separately styled
 * control at each step; there is one set of primitives now.
 */
export function SectionFormDialog({
  trigger,
  section,
  onCreated,
}: {
  trigger: ReactNode
  /** Absent when creating. */
  section?: { _id: string; name: string; description: string }
  onCreated?: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-rule bg-surface p-5 shadow-xl">
          {/* Remounted per open, so the fields start from the current values
              without an effect syncing props into state. */}
          {open && (
            <SectionForm
              section={section}
              onDone={id => {
                setOpen(false)
                if (id) onCreated?.(id)
              }}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function SectionForm({
  section,
  onDone,
}: {
  section?: { _id: string; name: string; description: string }
  onDone: (createdId?: string) => void
}) {
  const [name, setName] = useState(section?.name ?? '')
  const [description, setDescription] = useState(section?.description ?? '')
  const [error, setError] = useState<string | null>(null)

  const create = useCreateSection()
  const update = useUpdateSection(section?._id ?? '')
  const pending = create.isPending || update.isPending

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmed = name.trim()
    if (!trimmed) {
      setError('Give the section a name')
      return
    }

    try {
      if (section) {
        await update.mutateAsync({ name: trimmed, description })
        toast.show('Section updated')
        onDone()
      } else {
        const created = await create.mutateAsync({ name: trimmed, description })
        toast.show('Section created')
        onDone(created._id)
      }
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'That could not be saved.')
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <Dialog.Title className="text-lead font-semibold text-ink">
        {section ? 'Rename section' : 'New section'}
      </Dialog.Title>
      <Dialog.Description className="mt-1 text-small text-ink-muted">
        Sections are folders for notes. A note can sit in more than one.
      </Dialog.Description>

      <div className="mt-4 space-y-4">
        <Field
          label="Name"
          value={name}
          autoFocus
          maxLength={120}
          onChange={event => {
            setName(event.target.value)
            setError(null)
          }}
          error={error ?? undefined}
        />

        <TextareaField
          label="Description"
          value={description}
          onChange={event => setDescription(event.target.value)}
          maxLength={500}
          hint="Shown on the section page, and to readers if you make it public."
        />
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Dialog.Close asChild>
          <Button variant="secondary">Cancel</Button>
        </Dialog.Close>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? 'Saving…' : section ? 'Save changes' : 'Create section'}
        </Button>
      </div>
    </form>
  )
}
