import type { Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react'
import type { ComponentType } from 'react'

/**
 * S2-21 — the five editors (FullEditor, CustomEditor, SmallEditor,
 * SmallerEditor, SmallestEditor: 3,482 lines between them) differed only in
 * which controls they showed. Each one re-declared its own toolbar markup, its
 * own command handlers and its own active-state checks, so a fix to one never
 * reached the other four.
 *
 * Every control is described once here. An editor is then a list of names.
 */

export type ToolbarItemName =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'codeBlock'
  | 'rule'
  | 'link'
  | 'image'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'subscript'
  | 'superscript'
  | 'undo'
  | 'redo'
  | 'separator'

export type ToolbarItem = {
  /** Announced to screen readers and shown in the tooltip. */
  label: string
  icon: ComponentType<{ className?: string }>
  /**
   * Runs the command. Async so image insertion can await an upload.
   * TipTap's `.run()` returns a boolean saying whether the command applied,
   * so the return type is deliberately loose — callers ignore it.
   */
  run: (editor: Editor, helpers: ToolbarHelpers) => unknown
  /** Drives `aria-pressed`, so toggle state is announced, not just coloured. */
  isActive?: (editor: Editor) => boolean
  /** Drives `disabled` — undo/redo at the ends of the history. */
  isDisabled?: (editor: Editor) => boolean
  shortcut?: string
}

export type ToolbarHelpers = {
  /** Uploads and returns the hosted asset, or null when cancelled. Never base64. */
  pickImage: () => Promise<{ url: string; publicId: string } | null>
  /** Returns a href, or null when cancelled. */
  promptForLink: (current?: string) => Promise<string | null>
}

const mark = (
  label: string,
  icon: ComponentType<{ className?: string }>,
  name: string,
  command: (editor: Editor) => void,
  shortcut?: string,
): ToolbarItem => ({
  label,
  icon,
  run: editor => command(editor),
  isActive: editor => editor.isActive(name),
  ...(shortcut ? { shortcut } : {}),
})

export const TOOLBAR_ITEMS: Record<Exclude<ToolbarItemName, 'separator'>, ToolbarItem> = {
  bold: mark('Bold', Bold, 'bold', e => e.chain().focus().toggleBold().run(), 'Ctrl+B'),
  italic: mark('Italic', Italic, 'italic', e => e.chain().focus().toggleItalic().run(), 'Ctrl+I'),
  underline: mark('Underline', UnderlineIcon, 'underline', e => e.chain().focus().toggleUnderline().run(), 'Ctrl+U'),
  strike: mark('Strikethrough', Strikethrough, 'strike', e => e.chain().focus().toggleStrike().run()),
  code: mark('Inline code', Code, 'code', e => e.chain().focus().toggleCode().run()),

  h1: {
    label: 'Heading 1',
    icon: Heading1,
    run: e => e.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: e => e.isActive('heading', { level: 1 }),
  },
  h2: {
    label: 'Heading 2',
    icon: Heading2,
    run: e => e.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: e => e.isActive('heading', { level: 2 }),
  },
  h3: {
    label: 'Heading 3',
    icon: Heading3,
    run: e => e.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: e => e.isActive('heading', { level: 3 }),
  },

  bulletList: mark('Bulleted list', List, 'bulletList', e => e.chain().focus().toggleBulletList().run()),
  orderedList: mark('Numbered list', ListOrdered, 'orderedList', e => e.chain().focus().toggleOrderedList().run()),
  blockquote: mark('Quote', Quote, 'blockquote', e => e.chain().focus().toggleBlockquote().run()),
  codeBlock: mark('Code block', Code, 'codeBlock', e => e.chain().focus().toggleCodeBlock().run()),

  rule: {
    label: 'Divider',
    icon: Minus,
    run: e => e.chain().focus().setHorizontalRule().run(),
  },

  link: {
    label: 'Link',
    icon: LinkIcon,
    isActive: e => e.isActive('link'),
    run: async (editor, { promptForLink }) => {
      const current = editor.getAttributes('link').href as string | undefined
      const href = await promptForLink(current)

      // An empty string means "remove the link"; null means "cancelled".
      if (href === null) return
      if (href === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }

      editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    },
  },

  image: {
    label: 'Image',
    icon: ImageIcon,
    run: async (editor, { pickImage }) => {
      // S2-18's frontend counterpart: this returns a hosted URL. The old
      // editor inlined canvas.toDataURL() base64 straight into the document.
      const uploaded = await pickImage()
      if (uploaded) editor.chain().focus().setImage({ src: uploaded.url }).run()
    },
  },

  alignLeft: {
    label: 'Align left',
    icon: AlignLeft,
    run: e => e.chain().focus().setTextAlign('left').run(),
    isActive: e => e.isActive({ textAlign: 'left' }),
  },
  alignCenter: {
    label: 'Align centre',
    icon: AlignCenter,
    run: e => e.chain().focus().setTextAlign('center').run(),
    isActive: e => e.isActive({ textAlign: 'center' }),
  },
  alignRight: {
    label: 'Align right',
    icon: AlignRight,
    run: e => e.chain().focus().setTextAlign('right').run(),
    isActive: e => e.isActive({ textAlign: 'right' }),
  },
  alignJustify: {
    label: 'Justify',
    icon: AlignJustify,
    run: e => e.chain().focus().setTextAlign('justify').run(),
    isActive: e => e.isActive({ textAlign: 'justify' }),
  },

  subscript: mark('Subscript', SubscriptIcon, 'subscript', e => e.chain().focus().toggleSubscript().run()),
  superscript: mark('Superscript', SuperscriptIcon, 'superscript', e => e.chain().focus().toggleSuperscript().run()),

  undo: {
    label: 'Undo',
    icon: Undo2,
    run: e => e.chain().focus().undo().run(),
    isDisabled: e => !e.can().undo(),
    shortcut: 'Ctrl+Z',
  },
  redo: {
    label: 'Redo',
    icon: Redo2,
    run: e => e.chain().focus().redo().run(),
    isDisabled: e => !e.can().redo(),
    shortcut: 'Ctrl+Shift+Z',
  },
}

/**
 * The presets that replace the five components. A caller passes a preset name
 * or its own array, and that is the entire difference between what used to be
 * five files.
 */
export const TOOLBAR_PRESETS = {
  /** Was FullEditor — the note body. */
  full: [
    'undo', 'redo', 'separator',
    'h1', 'h2', 'h3', 'separator',
    'bold', 'italic', 'underline', 'strike', 'separator',
    'bulletList', 'orderedList', 'blockquote', 'separator',
    'link', 'image', 'codeBlock', 'rule', 'separator',
    'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'separator',
    'subscript', 'superscript',
  ],
  /** Was SmallEditor — descriptions and section blurbs. */
  standard: [
    'bold', 'italic', 'underline', 'separator',
    'h2', 'h3', 'separator',
    'bulletList', 'orderedList', 'separator',
    'link',
  ],
  /** Was SmallerEditor. */
  compact: ['bold', 'italic', 'underline', 'separator', 'link'],
  /** Was SmallestEditor — a single-line field that still needs emphasis. */
  minimal: ['bold', 'italic'],
} satisfies Record<string, ToolbarItemName[]>

export type ToolbarPreset = keyof typeof TOOLBAR_PRESETS
