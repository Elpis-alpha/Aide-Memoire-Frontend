'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { cn } from '@/lib/utils'
import {
  TOOLBAR_ITEMS,
  TOOLBAR_PRESETS,
  type ToolbarItemName,
  type ToolbarPreset,
} from './toolbar-items'
import { useImageUpload } from './use-image-upload'
import { LinkPrompt, type LinkPromptState } from './link-prompt'

/**
 * The one editor.
 *
 * S2-21 — replaces FullEditor, CustomEditor, SmallEditor, SmallerEditor and
 * SmallestEditor (3,482 lines). They differed only in which toolbar controls
 * they rendered, so that is now a prop.
 *
 *   <RichTextEditor preset="full" value={html} onChange={setHtml} />
 *   <RichTextEditor toolbar={['bold', 'italic', 'link']} />
 *
 * Also the TipTap 2.0.0-beta → 3.x upgrade: the app was running beta software
 * two majors behind.
 */

export type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  /** A named preset, or pass `toolbar` for an explicit list. */
  preset?: ToolbarPreset
  toolbar?: ToolbarItemName[]
  placeholder?: string
  editable?: boolean
  /** Minimum height of the writing surface. */
  minHeight?: string
  ariaLabel: string
  className?: string
  onFocus?: () => void
  onBlur?: () => void
}

export function RichTextEditor({
  value,
  onChange,
  preset = 'standard',
  toolbar,
  placeholder = 'Start writing',
  editable = true,
  minHeight = '12rem',
  ariaLabel,
  className,
  onFocus,
  onBlur,
}: RichTextEditorProps) {
  const items = toolbar ?? TOOLBAR_PRESETS[preset]
  const { pickImage, uploading, error, clearError } = useImageUpload()
  const [linkPrompt, setLinkPrompt] = useState<LinkPromptState>({ open: false })

  const promptForLink = useCallback(
    (current?: string) =>
      new Promise<string | null>(resolve => {
        setLinkPrompt({ open: true, current: current ?? '', resolve })
      }),
    [],
  )

  const helpers = useMemo(() => ({ pickImage, promptForLink }), [pickImage, promptForLink])

  const editor = useEditor({
    // Required in TipTap 3 for SSR: without it React complains that the server
    // and client markup differ on first paint.
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // Supplied separately below so they can carry their own options.
        link: false,
      }),
      Underline,
      Subscript,
      Superscript,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        // Defence in depth — the API sanitises on write and render too.
        protocols: ['http', 'https', 'mailto'],
        HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
    onFocus,
    onBlur,
    editorProps: {
      attributes: {
        // The writing surface is a labelled, focusable region.
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': ariaLabel,
        class: 'prose-note focus:outline-none',
        style: `min-height:${minHeight}`,
      },
    },
  })

  // Keeps the editor in step when the value changes from outside, e.g. a note
  // loading in. Guarded, or every keystroke would reset the cursor.
  useEffect(() => {
    if (!editor) return
    if (value === editor.getHTML()) return
    editor.commands.setContent(value, { emitUpdate: false })
  }, [editor, value])

  useEffect(() => {
    editor?.setEditable(editable)
  }, [editor, editable])

  if (!editor) {
    return (
      <div
        className={cn('rounded-lg border border-rule bg-surface', className)}
        style={{ minHeight }}
        aria-busy="true"
      />
    )
  }

  return (
    <div className={cn('rounded-lg border border-rule bg-surface', className)}>
      {editable && (
        <Toolbar editor={editor} items={items} helpers={helpers} uploading={uploading} />
      )}

      {error && (
        <p role="alert" className="border-b border-rule bg-correct-soft px-3 py-2 text-small text-correct">
          {error}{' '}
          <button type="button" onClick={clearError} className="underline underline-offset-2">
            Dismiss
          </button>
        </p>
      )}

      <div className="px-4 py-3">
        <EditorContent editor={editor} />
      </div>

      <LinkPrompt state={linkPrompt} onClose={() => setLinkPrompt({ open: false })} />
    </div>
  )
}

function Toolbar({
  editor,
  items,
  helpers,
  uploading,
}: {
  editor: Editor
  items: ToolbarItemName[]
  helpers: Parameters<(typeof TOOLBAR_ITEMS)['bold']['run']>[1]
  uploading: boolean
}) {
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      aria-orientation="horizontal"
      className="flex flex-wrap items-center gap-0.5 border-b border-rule px-2 py-1.5"
    >
      {items.map((name, index) => {
        if (name === 'separator') {
          return (
            <span
              key={`sep-${index}`}
              aria-hidden="true"
              className="mx-1 h-5 w-px shrink-0 bg-rule"
            />
          )
        }

        const item = TOOLBAR_ITEMS[name]
        const Icon = item.icon
        const active = item.isActive?.(editor) ?? false
        const busy = name === 'image' && uploading
        const disabled = (item.isDisabled?.(editor) ?? false) || busy

        return (
          <button
            key={name}
            type="button"
            // S2-33 — a real button, labelled, with its toggle state exposed
            // rather than conveyed by colour alone.
            aria-label={item.label}
            aria-pressed={item.isActive ? active : undefined}
            title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
            disabled={disabled}
            onClick={() => void item.run(editor, helpers)}
            className={cn(
              'inline-flex size-8 items-center justify-center rounded-md transition-colors',
              'hover:bg-sunken disabled:pointer-events-none disabled:opacity-40',
              active ? 'bg-accent-soft text-accent' : 'text-ink-muted',
            )}
          >
            <Icon className="size-4" />
          </button>
        )
      })}
    </div>
  )
}
