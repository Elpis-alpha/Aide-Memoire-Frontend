'use client'

import { useState } from 'react'
import { RichTextEditor } from '@/components/editor/rich-text-editor'

const SAMPLE = `<h2>Kick-off, 14 March</h2>
<p>Agreed: ship the <strong>import</strong> first, then the editor. Revisit pricing in April.</p>
<ul><li><p>Ana owns the migration script</p></li><li><p>Deadline is the 28th, not the 30th</p></li></ul>
<blockquote><p>Write it down or it did not happen.</p></blockquote>`

/**
 * The landing page hero. A real editor with a real document in it — the same
 * component the app uses, just without a save target. Nothing here is mocked,
 * so what someone tries is exactly what they get after signing up.
 */
export function HeroEditor() {
  const [html, setHtml] = useState(SAMPLE)

  return (
    <div>
      <RichTextEditor
        value={html}
        onChange={setHtml}
        preset="full"
        ariaLabel="Try the Aide-mémoire editor"
        minHeight="20rem"
        placeholder="Write something"
        className="border border-rule"
      />
      <p className="mt-2 text-small text-ink-faint">
        This is the real editor. Nothing you type here is saved.
      </p>
    </div>
  )
}
