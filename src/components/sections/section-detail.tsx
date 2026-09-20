'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Copy, Eye, EyeOff, FilePlus, Pencil, Trash2 } from 'lucide-react'
import {
  useDeleteSection,
  useSection,
  useSectionNotes,
  useToggleSectionVisibility,
} from '@/hooks/use-api'
import { NoteList } from '@/components/notes/note-list'
import { QueryError, QuerySkeleton } from '@/components/query-state'
import { SectionFormDialog } from '@/components/sections/section-form-dialog'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { toast } from '@/components/ui/toast'
import { ApiError } from '@/lib/api'

export function SectionDetail({ sectionID }: { sectionID: string }) {
  const router = useRouter()
  const section = useSection(sectionID)
  const notes = useSectionNotes(sectionID)
  const visibility = useToggleSectionVisibility(sectionID)
  const remove = useDeleteSection()

  if (section.isPending) return <QuerySkeleton label="Loading this section" />

  if (section.isError) {
    const missing = section.error instanceof ApiError && section.error.isNotFound
    return (
      <QueryError
        title={missing ? 'That section is not here' : 'This section could not be opened'}
        message={section.error.message}
        onRetry={missing ? undefined : () => void section.refetch()}
      />
    )
  }

  const data = section.data
  const publicPath = `/public/section/${data._id}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(new URL(publicPath, window.location.origin).toString())
      toast.show('Link copied')
    } catch {
      toast.error('Could not copy the link.')
    }
  }

  const destroy = async () => {
    try {
      await remove.mutateAsync(data._id)
      toast.show('Section deleted. Its notes are now unfiled.')
      router.push('/me')
    } catch {
      toast.error('That section could not be deleted.')
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3 border-b border-rule pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-serif text-display font-semibold tracking-tight text-ink">
              {data.name}
            </h1>
            {data.description && (
              <p className="mt-2 max-w-[60ch] text-ink-muted">{data.description}</p>
            )}
          </div>

          <Button asChild variant="primary" size="sm">
            <Link href={`/note/create-new?section=${data._id}`}>
              <FilePlus />
              New note here
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={data.isPublic}
            disabled={visibility.isPending}
            onClick={() => visibility.mutate()}
            className={data.isPublic ? 'text-accent' : undefined}
          >
            {data.isPublic ? <Eye /> : <EyeOff />}
            {data.isPublic ? 'Published' : 'Private'}
          </Button>

          {data.isPublic && (
            <>
              <Button variant="ghost" size="sm" onClick={() => void copyLink()}>
                <Copy />
                Copy link
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href={publicPath}>View as reader</Link>
              </Button>
            </>
          )}

          <SectionFormDialog
            section={{ _id: data._id, name: data.name, description: data.description ?? '' }}
            trigger={
              <Button variant="ghost" size="sm">
                <Pencil />
                Rename
              </Button>
            }
          />

          {data.canDelete !== false && (
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="sm" className="text-correct hover:bg-correct-soft">
                  <Trash2 />
                  Delete
                </Button>
              }
              title="Delete this section?"
              description={
                <>
                  The notes in it are <strong className="text-ink">kept</strong> — they become
                  unfiled. Only the section itself is removed.
                </>
              }
              confirmWord={data.name}
              pending={remove.isPending}
              onConfirm={destroy}
            />
          )}
        </div>

        {data.isPublic && (
          <p className="text-small text-ink-faint">
            Readers see this section and the notes in it that you have published. Private notes
            filed here stay hidden.
          </p>
        )}
      </header>

      {notes.isPending && <QuerySkeleton label="Loading the notes in this section" />}

      {notes.isError && (
        <QueryError
          title="These notes could not be loaded"
          message={notes.error.message}
          onRetry={() => void notes.refetch()}
        />
      )}

      {notes.data && (
        <NoteList notes={notes.data.items} emptyMessage="Nothing is filed here yet." />
      )}
    </div>
  )
}
