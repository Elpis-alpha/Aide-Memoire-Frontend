/**
 * Renders stored note HTML.
 *
 * The API sanitises on write *and* on render (S2-01), so what arrives here has
 * already been through `sanitize-html` twice. This component is deliberately a
 * Server Component with no interactivity — it exists so the reading surface is
 * identical between the editor and the public page, which is the point of
 * `.prose-note` carrying the typography rather than each page restating it.
 */
export function NoteBody({
  as: Component = 'div',
  html,
  className,
}: {
  as?: 'div' | 'article'
  html: string
  className?: string
}) {
  if (!html.trim()) {
    return <p className="text-ink-faint italic">This note is empty.</p>
  }

  return (
    <Component
      className={className ? `prose-note ${className}` : 'prose-note'}
      // Server-sanitised upstream; see the note above.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
