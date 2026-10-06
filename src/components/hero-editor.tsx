'use client'

import { useState } from 'react'
import { RichTextEditor } from '@/components/editor/rich-text-editor'

/**
 * One string with no line breaks, on purpose. The editor re-serialises it
 * without them, and RichTextEditor re-sets its content whenever the two differ
 * — which put the cursor at the end, inside the quote, so the Quote button
 * loaded already pressed.
 */
const SAMPLE = [
  '<h2>Kick-off, 14 March</h2>',
  '<p>Agreed: ship the <strong>import</strong> first, then the editor. Revisit pricing in April.</p>',
  '<ul><li><p>Ana owns the migration script</p></li><li><p>Deadline is the 28th, not the 30th</p></li></ul>',
  '<blockquote><p>Write it down or it did not happen.</p></blockquote>',
].join('')

/**
 * The landing page hero. A real editor with a real document in it — the same
 * component the app uses, just without a save target. Nothing here is mocked,
 * so what someone tries is exactly what they get after signing up.
 */
export function HeroEditor() {
  const [html, setHtml] = useState(SAMPLE)

  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      preset="full"
      ariaLabel="Try the Aide-mémoire editor"
      minHeight="20rem"
      placeholder="Write something"
      className="border border-rule"
    />
  )
}
