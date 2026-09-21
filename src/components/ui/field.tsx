import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

/**
 * A labelled input with its error wired up through `aria-describedby` and
 * `aria-invalid`, so the message is announced rather than only shown in red.
 *
 * S3-39 — the old forms read values straight off the DOM with
 * `document.getElementById(...).value` and had no labels at all.
 */
export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const generatedId = useId()
    const fieldId = id ?? generatedId
    const errorId = `${fieldId}-error`
    const hintId = `${fieldId}-hint`

    const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

    return (
      <div className="space-y-1.5">
        <label htmlFor={fieldId} className="block">
          <Label>{label}</Label>
        </label>

        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(
            // A ruled blank, not a box: sunken wash, a rule underneath, and
            // nothing else. The underline is the field's only boundary, so it
            // carries 3:1 on its own (--rule-strong is #717a8a for exactly
            // this reason).
            'w-full rounded-t-sm border-0 border-b bg-sunken px-3 py-2 text-base text-ink',
            'transition-[border-color,background-color] duration-[var(--dur-1)] ease-[var(--ease-paper)]',
            'placeholder:text-ink-faint',
            'focus:border-b-2 focus:bg-surface',
            error ? 'border-b-2 border-correct' : 'border-rule-strong focus:border-accent',
            className,
          )}
          {...props}
        />

        {hint && !error && (
          <p id={hintId} className="text-small text-ink-faint">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-small text-correct">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Field.displayName = 'Field'
