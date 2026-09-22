import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Mirrors src/lib/utils.ts. If the two drift, this check is worthless — so
 * if you change the config there, change it here in the same commit.
 *
 * The bug this guards: tailwind-merge's default config knows Tailwind's stock
 * font sizes but not this theme's, so it read `text-small` as a text *colour*
 * and dropped the real colour that came earlier in the class list. Every
 * primary button at size sm or lg rendered at 2.46:1.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['micro', 'small', 'base', 'read', 'lead', 'title', 'hero', 'display', 'label'] },
      ],
    },
  },
})

const CASES = [
  ['two sizes collapse to the last', 'text-label text-title', 'text-title'],
  ['colour then size both survive', 'text-ink-faint text-label', 'text-ink-faint text-label'],
  ['size then colour both survive', 'text-label text-ink-faint', 'text-label text-ink-faint'],
  ['the 2.46:1 case', 'text-accent-contrast text-small', 'text-accent-contrast text-small'],
  ['the 2.46:1 case at lg', 'text-accent-contrast text-read', 'text-accent-contrast text-read'],
]

let failed = 0
for (const [name, input, want] of CASES) {
  const got = twMerge(input)
  const ok = got === want
  if (!ok) failed++
  console.log(`  ${ok ? 'pass' : 'FAIL'}  ${name}`)
  if (!ok) console.log(`        in "${input}" -> "${got}", wanted "${want}"`)
}

if (failed > 0) {
  console.error(`\n${failed} class-merge case(s) wrong — a scale token is not registered.`)
  process.exit(1)
}
console.log('\nClass merging is correct.')
