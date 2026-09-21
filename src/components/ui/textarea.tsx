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
            // carries 3:1 on its own — which is why --rule-strong was retoned
            // to #717a8a in light and #5d6878 in dark.
            //
            // The rule is an inset box-shadow, not a border. A border
            // participates in layout, so thickening it 1px -> 2px on focus
            // would grow the field and shift everything below it; these inputs
            // have no explicit height, and border-box does not help an
            // auto-height element. A shadow never affects layout, and unlike
            // border-width it transitions smoothly.
            'w-full rounded-t-sm border-0 bg-sunken px-3 py-2 text-base text-ink',
            'transition-[box-shadow,background-color] duration-[var(--dur-1)] ease-[var(--ease-paper)]',
            'placeholder:text-ink-faint',
            'focus:bg-surface',
            // The focus rule lives in the non-error branch only, so an errored
            // field keeps its red underline while the user is still typing in
            // it rather than having it masked by the accent colour.
            error
              ? 'shadow-[inset_0_-2px_0_var(--correct)]'
              : 'shadow-[inset_0_-1px_0_var(--rule-strong)] focus:shadow-[inset_0_-2px_0_var(--accent)]',
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
