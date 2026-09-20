'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trash2, Upload } from 'lucide-react'
import { User as UserIcon } from 'lucide-react'
import { useRemoveAvatar, useSetAvatar, useUpdateMe } from '@/hooks/use-api'
import { useImageUpload } from '@/components/editor/use-image-upload'
import { Panel } from '@/components/settings/panel'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { TextareaField } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { ApiError, type User } from '@/lib/api'

const schema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(120),
  biography: z.string().max(1000, 'Keep this under 1000 characters'),
  noteName: z.string().trim().min(1, 'Give your notes a collective name').max(120),
})

export function ProfilePanel({ me }: { me: User }) {
  const update = useUpdateMe()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: me.name,
      biography: me.biography ?? '',
      noteName: me.noteName,
    },
  })

  const onSubmit = form.handleSubmit(async values => {
    try {
      await update.mutateAsync(values)
      toast.show('Profile saved')
      // Keeps the form clean, so the Save button correctly reports that there
      // is nothing left to save.
      form.reset(values)
    } catch (error) {
      if (error instanceof ApiError) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          if (field === 'name' || field === 'biography' || field === 'noteName') {
            form.setError(field, { message })
          }
        }
        form.setError('root', { message: error.message })
      } else {
        form.setError('root', { message: 'That could not be saved.' })
      }
    }
  })

  return (
    <Panel
      id="profile"
      title="Profile"
      description="Your name and biography appear on notes you publish."
    >
      <AvatarRow me={me} />

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {form.formState.errors.root?.message && (
          <p
            role="alert"
            className="rounded-md border border-correct bg-correct-soft px-3 py-2 text-small text-correct"
          >
            {form.formState.errors.root.message}
          </p>
        )}

        <Field
          label="Name"
          autoComplete="name"
          error={form.formState.errors.name?.message}
          {...form.register('name')}
        />

        <Field
          label="What you call your notes"
          hint="Used as the heading on your published pages. “Aide-mémoire” by default."
          error={form.formState.errors.noteName?.message}
          {...form.register('noteName')}
        />

        <TextareaField
          label="Biography"
          rows={4}
          error={form.formState.errors.biography?.message}
          {...form.register('biography')}
        />

        <Button
          type="submit"
          variant="primary"
          disabled={update.isPending || !form.formState.isDirty}
        >
          {update.isPending ? 'Saving…' : 'Save profile'}
        </Button>
      </form>
    </Panel>
  )
}

function AvatarRow({ me }: { me: User }) {
  const { pickImage, uploading, error, clearError } = useImageUpload('avatar')
  const setAvatar = useSetAvatar()
  const removeAvatar = useRemoveAvatar()
  const [busy, setBusy] = useState(false)

  const choose = async () => {
    const uploaded = await pickImage()
    if (!uploaded) return

    setBusy(true)
    try {
      // The public id comes back from Cloudinary rather than being parsed out
      // of the URL: the API checks it against the caller's own folder, and
      // deletes the asset this one replaces.
      await setAvatar.mutateAsync(uploaded)
      toast.show('Avatar updated')
    } catch {
      toast.error('That avatar could not be saved.')
    } finally {
      setBusy(false)
    }
  }

  const clear = async () => {
    setBusy(true)
    try {
      await removeAvatar.mutateAsync()
      toast.show('Avatar removed')
    } catch {
      toast.error('That avatar could not be removed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="size-16 shrink-0 overflow-hidden rounded-full border border-rule bg-sunken">
        {me.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={me.avatarUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-ink-faint">
            <UserIcon className="size-6" />
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={uploading || busy}
            onClick={() => void choose()}
          >
            <Upload />
            {uploading ? 'Uploading…' : me.avatarUrl ? 'Replace' : 'Upload'}
          </Button>

          {me.avatarUrl && (
            <Button
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => void clear()}
              className="text-correct hover:bg-correct-soft"
            >
              <Trash2 />
              Remove
            </Button>
          )}
        </div>

        {error ? (
          <p role="alert" className="text-small text-correct">
            {error}{' '}
            <button type="button" onClick={clearError} className="underline underline-offset-2">
              Dismiss
            </button>
          </p>
        ) : (
          <p className="text-small text-ink-faint">JPEG, PNG, WebP, GIF or AVIF, up to 10MB.</p>
        )}
      </div>
    </div>
  )
}
