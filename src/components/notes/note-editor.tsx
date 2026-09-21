'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
import {
  useDeleteNote,
  useNote,
  useNoteRelations,
  useToggleNoteVisibility,
  useUpdateNote,
} from '@/hooks/use-api'
import { useAutosave } from '@/hooks/use-autosave'
import { RichTextEditor } from '@/components/editor/rich-text-editor'
import { SaveStatus } from '@/components/notes/save-status'
import { SectionPicker } from '@/components/notes/section-picker'
import { TagPicker } from '@/components/notes/tag-picker'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { ApiError, type Note } from '@/lib/api'

/**
 * A note, open. There is no separate "view" and "edit" mode: it is your note,
 * so it is editable, and the reading typography is the same `.prose-note`
 * surface a published note is rendered with.
 */
export function NoteEditor({ noteID }: { noteID: string }) {
  const { data: note, isPending, isError, error, refetch } = useNote(noteID)

  if (isPending) {
    return (
      <div aria-busy="true" aria-live="polite" className="space-y-4">
        <span className="sr-only">Loading this note</span>
        <div className="h-10 w-2/3 animate-pulse rounded-md bg-sunken" />
        <div className="h-5 w-1/3 animate-pulse rounded-md bg-sunken" />
        <div className="h-80 animate-pulse rounded-lg bg-sunken" />
      </div>
    )
  }

  if (isError) {
    // TanStack types the error as `Error`; the narrowing is what gives back
    // the status the API actually returned.
    const missing = error instanceof ApiError && error.isNotFound

    return (
      <div role="alert" className="rounded-lg border border-correct bg-correct-soft p-5">
        <h1 className="font-medium text-correct">
          {missing ? 'That note is not here' : 'This note could not be opened'}
        </h1>
        <p className="mt-1 text-small text-ink-muted">{error.message}</p>
        <div className="mt-4 flex gap-2">
          {!missing && (
            <Button variant="secondary" size="sm" onClick={() => void refetch()}>
              Try again
            </Button>
          )}
          <Button asChild variant="ghost" size="sm">
            <Link href="/me">Your notes</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Keyed on the note, so moving between notes starts from that note's text
  // rather than syncing new props into existing draft state.
  return <LoadedNote key={note._id} note={note} />
}

function LoadedNote({ note }: { note: Note }) {
  const router = useRouter()

  const [draft, setDraft] = useState({
    name: note.name,
    description: note.description ?? '',
    text: note.text ?? '',
  })

  const update = useUpdateNote(note._id)
  const remove = useDeleteNote()
  const visibility = useToggleNoteVisibility(note._id)
  const relations = useNoteRelations(note._id)

  const autosave = useAutosave({
    value: draft,
    save: values => update.mutateAsync(values),
  })

  const relationsBusy =
    relations.addTag.isPending ||
    relations.removeTag.isPending ||
    relations.addSection.isPending ||
    relations.removeSection.isPending

  const publicPath = `/public/note/${note._id}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(new URL(publicPath, window.location.origin).toString())
      toast.show('Link copied')
    } catch {
      toast.error('Could not copy the link. Copy it from the address bar instead.')
    }
  }

  const destroy = async () => {
    try {
      // The last edit would otherwise be written back by the unmount flush,
      // recreating rows for a note that is on its way out.
      await autosave.saveNow().catch(() => undefined)
      await remove.mutateAsync(note._id)
      toast.show('Note deleted')
      router.push('/me')
    } catch {
      toast.error('That note could not be deleted.')
    }
  }

  return (
    <article className="space-y-5">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={note.isPublic}
            disabled={visibility.isPending}
            onClick={() => visibility.mutate()}
            className={note.isPublic ? 'text-accent' : undefined}
          >
            {note.isPublic ? <Eye /> : <EyeOff />}
            {note.isPublic ? 'Published' : 'Private'}
          </Button>

          {note.isPublic && (
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

          {note.canDelete !== false && (
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="sm" className="text-correct hover:bg-correct-soft">
                  <Trash2 />
                  Delete
                </Button>
              }
              title="Delete this note?"
              description={
                <>
                  <strong className="text-ink">{draft.name || 'This note'}</strong> will be removed
                  permanently, along with its tag and section links. This cannot be undone.
                </>
              }
              pending={remove.isPending}
              onConfirm={destroy}
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        {/* The visible title is an input, so the page had no level-one
            heading at all. The note's name is what the document is about. */}
        <h1 className="sr-only">{draft.name.trim() || 'Untitled note'}</h1>

        <label htmlFor="note-name" className="sr-only">
          Note title
        </label>
        <input
          id="note-name"
          value={draft.name}
          onChange={event => setDraft(current => ({ ...current, name: event.target.value }))}
          placeholder="Untitled note"
          maxLength={200}
          autoComplete="off"
          className="w-full bg-transparent font-serif text-display font-semibold tracking-tight text-ink placeholder:text-ink-faint"
        />

        <label htmlFor="note-description" className="sr-only">
          Description
        </label>
        <input
          id="note-description"
          value={draft.description}
          onChange={event => setDraft(current => ({ ...current, description: event.target.value }))}
          placeholder="Add a one-line description"
          maxLength={500}
          autoComplete="off"
          className="w-full bg-transparent text-lead text-ink-muted placeholder:text-ink-faint"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-rule py-2.5">
        <Label>Section</Label>
        <SectionPicker
          sections={note.sections ?? []}
          busy={relationsBusy}
          onAdd={id => relations.addSection.mutate(id)}
          onRemove={id => relations.removeSection.mutate(id)}
        />

        <Label className="ml-2">Tags</Label>
        <TagPicker
          tags={note.tags ?? []}
          busy={relationsBusy}
          onAdd={id => relations.addTag.mutate(id)}
          onRemove={id => relations.removeTag.mutate(id)}
        />

        <div className="ml-auto">
          <SaveStatus autosave={autosave} />
        </div>
      </div>

      <RichTextEditor
        value={draft.text}
        onChange={text => setDraft(current => ({ ...current, text }))}
        preset="full"
        minHeight="24rem"
        ariaLabel={`Body of ${draft.name || 'this note'}`}
        placeholder="Start writing. Everything is saved as you go."
      />
    </article>
  )
}
