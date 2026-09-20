import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge conditional classes without Tailwind conflicts. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

/**
 * Dates are formatted relative to now for anything recent and absolute
 * otherwise, because "3 minutes ago" stops being useful after a day.
 * Replaces moment, which was 70KB for this.
 */
export { formatDistanceToNowStrict, format, isThisYear } from 'date-fns'
