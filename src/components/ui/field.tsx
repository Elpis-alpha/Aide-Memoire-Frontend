import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

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
        <label htmlFor={fieldId} className="block text-small font-medium text-ink">
          {label}
        </label>

        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(
            'w-full rounded-md border bg-surface px-3 py-2 text-base text-ink transition-colors',
            'placeholder:text-ink-faint',
            error ? 'border-correct' : 'border-rule hover:border-rule-strong',
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
