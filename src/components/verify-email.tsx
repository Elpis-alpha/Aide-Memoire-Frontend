'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useConfirmVerification, useRequestVerification } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { ApiError } from '@/lib/api'

/**
 * S1-01 — verification used to be a GET on a guessable link that flipped a
 * boolean and never expired. The token is now single-use, stored hashed with a
 * 24-hour TTL, and confirmed with a POST — so this page has to send it rather
 * than the link itself doing the work.
 *
 * That it is a POST also means a link preview fetcher scanning the inbox
 * cannot burn the token before the person clicks it.
 */
export function VerifyEmail() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const confirm = useConfirmVerification()
  const resend = useRequestVerification()

  // The effect would otherwise fire twice under Strict Mode, and the second
  // call would fail against a token the first one has already consumed.
  const sent = useRef(false)

  useEffect(() => {
    if (!token || sent.current) return
    sent.current = true
    confirm.mutate(token)
  }, [token, confirm])

  if (!token) {
    return (
      <Panel
        tone="error"
        title="That link is incomplete"
        body="The address is missing its verification token. Open the link from your email again, or send a fresh one."
        action={<ResendButton resend={resend} />}
      />
    )
  }

  if (confirm.isPending) {
    return (
      <div aria-busy="true" aria-live="polite" className="text-center">
        <span className="sr-only">Verifying your email address</span>
        <div className="mx-auto h-6 w-40 animate-pulse rounded-md bg-sunken" />
      </div>
    )
  }

  if (confirm.isError) {
    const expired = confirm.error instanceof ApiError && confirm.error.status === 400

    return (
      <Panel
        tone="error"
        title={expired ? 'That link has expired' : 'That did not work'}
        body={
          expired
            ? 'Verification links last 24 hours and can only be used once. Send yourself a new one.'
            : confirm.error.message
        }
        action={<ResendButton resend={resend} />}
      />
    )
  }

  return (
    <Panel
      tone="success"
      title="Your email is verified"
      body="That is the last of the setup. Everything else is writing."
      action={
        <Button asChild variant="primary">
          <Link href="/me">Go to your notes</Link>
        </Button>
      }
    />
  )
}

function ResendButton({ resend }: { resend: ReturnType<typeof useRequestVerification> }) {
  return (
    <Button
      variant="secondary"
      disabled={resend.isPending}
      onClick={async () => {
        try {
          await resend.mutateAsync()
          toast.show('A new verification email is on its way.')
        } catch (error) {
          toast.error(
            error instanceof ApiError && error.isAuthError
              ? 'Sign in first, then ask for a new link.'
              : 'That email could not be sent.',
          )
        }
      }}
    >
      {resend.isPending ? 'Sending…' : 'Send a new link'}
    </Button>
  )
}

function Panel({
  tone,
  title,
  body,
  action,
}: {
  tone: 'success' | 'error'
  title: string
  body: string
  action: React.ReactNode
}) {
  const Icon = tone === 'success' ? CheckCircle2 : XCircle

  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className="text-center">
      <Icon
        className={tone === 'success' ? 'mx-auto size-8 text-accent' : 'mx-auto size-8 text-correct'}
        aria-hidden="true"
      />
      <h1 className="mt-4 font-serif text-title font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mx-auto mt-2 max-w-[44ch] text-ink-muted">{body}</p>
      <div className="mt-6 flex justify-center">{action}</div>
    </div>
  )
}
