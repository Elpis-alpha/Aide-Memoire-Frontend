import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge has to be told about this theme's type scale.
 *
 * Its default config knows Tailwind's stock font sizes (`text-base`,
 * `text-sm`, …) but not ours, so it read `text-small` and `text-read` as text
 * *colours* and dropped the real colour that came earlier in the class list.
 * The effect was silent and serious: every primary button at size `sm` or `lg`
 * lost `text-accent-contrast` and rendered ink on accent blue at 2.46:1,
 * against a 4.5:1 requirement. Size `md` was fine only because it happens to
 * use the stock `text-base`.
 *
 * Found by an axe pass, which reported it on all ten routes checked.
 *
 * Listing the scale here is the whole fix: anything `text-*` that is not one
 * of these stays in the text-colour group, which is what we want.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['micro', 'small', 'base', 'read', 'lead', 'title', 'hero', 'display'] }],
    },
  },
})

/** Merge conditional classes without Tailwind conflicts. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

/**
 * Dates are formatted relative to now for anything recent and absolute
 * otherwise, because "3 minutes ago" stops being useful after a day.
 * Replaces moment, which was 70KB for this.
 */
export { formatDistanceToNowStrict, format, isThisYear } from 'date-fns'
