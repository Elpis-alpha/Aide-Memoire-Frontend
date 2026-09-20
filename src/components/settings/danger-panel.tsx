'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useDeleteAccount } from '@/hooks/use-api'
import { Panel } from '@/components/settings/panel'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { toast } from '@/components/ui/toast'
import type { User } from '@/lib/api'

export function DangerPanel({ me }: { me: User }) {
  const router = useRouter()
  const remove = useDeleteAccount()

  const destroy = async () => {
    try {
      await remove.mutateAsync()
      router.push('/')
      router.refresh()
    } catch {
      toast.error('That account could not be deleted.')
    }
  }

  return (
    <Panel
      id="danger"
      tone="danger"
      title="Delete account"
      description={
        <>
          Your account, every note, every section and every tag link are removed together, in a
          single transaction (S2-10). Published notes stop resolving. This cannot be undone and
          there is no export yet — copy out anything you want to keep first.
        </>
      }
    >
      <ConfirmDialog
        trigger={
          <Button variant="destructive">
            <Trash2 />
            Delete my account
          </Button>
        }
        title="Delete your account?"
        description="Everything goes at once and none of it can be recovered."
        confirmLabel="Delete everything"
        confirmWord={me.email}
        pending={remove.isPending}
        onConfirm={destroy}
      />
    </Panel>
  )
}
