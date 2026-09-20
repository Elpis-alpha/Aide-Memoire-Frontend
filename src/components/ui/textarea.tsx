import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * The multi-line counterpart to `Field`, with the same label / error / hint
 * wiring. Kept as a separate component rather than a `multiline` prop on
 * `Field` because the ref types differ and one would have to be cast.
 */
export interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  /** Hides the label visually but keeps it for assistive technology. */
  labelHidden?: boolean
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, hint, className, id, labelHidden, rows = 3, ...props }, ref) => {
    const generatedId = useId()
    const fieldId = id ?? generatedId
    const errorId = `${fieldId}-error`
    const hintId = `${fieldId}-hint`

    const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={fieldId}
          className={labelHidden ? 'sr-only' : 'block text-small font-medium text-ink'}
        >
          {label}
        </label>

        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
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

TextareaField.displayName = 'TextareaField'
