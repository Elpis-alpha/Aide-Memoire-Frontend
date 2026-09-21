import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

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
        <label htmlFor={fieldId} className={labelHidden ? 'sr-only' : 'block'}>
          <Label>{label}</Label>
        </label>

        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
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

TextareaField.displayName = 'TextareaField'
