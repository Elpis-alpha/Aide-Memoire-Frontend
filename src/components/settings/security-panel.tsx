'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useChangePassword, useLogoutAll, useRequestVerification } from '@/hooks/use-api'
import { Panel } from '@/components/settings/panel'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { ApiError, type User } from '@/lib/api'

/** Mirrors the API's zod schema, so the round trip is a confirmation. */
const schema = z
  .object({
    oldPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z
      .string()
      .min(8, 'Use at least 8 characters')
      .refine(value => !value.toLowerCase().includes('password'), {
        message: 'Pick something that does not contain "password"',
      }),
    confirm: z.string().min(1, 'Repeat the new password'),
  })
  .refine(values => values.newPassword === values.confirm, {
    path: ['confirm'],
    message: 'These do not match',
  })
  .refine(values => values.newPassword !== values.oldPassword, {
    path: ['newPassword'],
    message: 'That is your current password',
  })

export function SecurityPanel({ me }: { me: User }) {
  const router = useRouter()
  const change = useChangePassword()
  const logoutAll = useLogoutAll()
  const requestVerification = useRequestVerification()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { oldPassword: '', newPassword: '', confirm: '' },
  })

  const onSubmit = form.handleSubmit(async values => {
    try {
      await change.mutateAsync({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
      form.reset()
      // S1-08 — `passwordChangedAt` invalidates every token minted before
      // this, so the other sessions are already dead. Say so.
      toast.show('Password changed. Other devices have been signed out.')
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        form.setError('oldPassword', { message: 'That is not your current password' })
      } else {
        form.setError('root', {
          message: error instanceof ApiError ? error.message : 'That could not be changed.',
        })
      }
    }
  })

  const signOutEverywhere = async () => {
    try {
      await logoutAll.mutateAsync()
      router.push('/login')
      router.refresh()
    } catch {
      toast.error('Could not sign out the other devices.')
    }
  }

  return (
    <>
      <Panel
        id="email"
        title="Email"
        description={
          me.verified
            ? 'Your email address is verified.'
            : 'Until this is verified, we cannot reach you if you lose access to the account.'
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-base text-ink">{me.email}</span>

          {me.verified ? (
            <span className="rounded-sm bg-accent-soft px-2 py-0.5 text-small text-accent">
              Verified
            </span>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled={requestVerification.isPending}
              onClick={async () => {
                try {
                  await requestVerification.mutateAsync()
                  toast.show('Verification email sent. The link is good for 24 hours.')
                } catch {
                  toast.error('That email could not be sent.')
                }
              }}
            >
              {requestVerification.isPending ? 'Sending…' : 'Send verification email'}
            </Button>
          )}
        </div>
      </Panel>

      <Panel
        id="password"
        title="Password"
        description="Changing it signs out every other device."
      >
        <form onSubmit={onSubmit} noValidate className="max-w-sm space-y-4">
          {form.formState.errors.root?.message && (
            <p
              role="alert"
              className="rounded-md border border-correct bg-correct-soft px-3 py-2 text-small text-correct"
            >
              {form.formState.errors.root.message}
            </p>
          )}

          {/* Present so a password manager knows which account this is for. */}
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={me.email}
            readOnly
            hidden
          />

          <Field
            label="Current password"
            type="password"
            autoComplete="current-password"
            error={form.formState.errors.oldPassword?.message}
            {...form.register('oldPassword')}
          />

          <Field
            label="New password"
            type="password"
            autoComplete="new-password"
            hint="At least 8 characters."
            error={form.formState.errors.newPassword?.message}
            {...form.register('newPassword')}
          />

          <Field
            label="Repeat new password"
            type="password"
            autoComplete="new-password"
            error={form.formState.errors.confirm?.message}
            {...form.register('confirm')}
          />

          <Button type="submit" variant="primary" disabled={change.isPending}>
            {change.isPending ? 'Changing…' : 'Change password'}
          </Button>
        </form>
      </Panel>

      <Panel
        id="sessions"
        title="Sessions"
        description="Signs out this device and every other one. Use it if you think a session has been taken."
      >
        <Button
          variant="secondary"
          disabled={logoutAll.isPending}
          onClick={() => void signOutEverywhere()}
        >
          {logoutAll.isPending ? 'Signing out…' : 'Sign out everywhere'}
        </Button>
      </Panel>
    </>
  )
}
