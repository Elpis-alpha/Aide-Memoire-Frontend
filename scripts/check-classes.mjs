import { readFileSync } from 'node:fs'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Reads the scale out of src/lib/utils.ts rather than restating it.
 *
 * An earlier version of this script declared its own copy of the config. That
 * version could not fail in the way that matters: delete the extension from
 * utils.ts and the app regresses while this check, testing its private copy,
 * stays green. A guard against silent drift must not itself be a duplicate.
 * check-contrast.mjs reads app/globals.css for the same reason.
 *
 * The bug this guards: tailwind-merge's default config knows Tailwind's stock
 * font sizes but not this theme's, so it read `text-small` as a text *colour*
 * and dropped the real colour that came earlier in the class list. Every
 * primary button at size sm or lg rendered at 2.46:1.
 */
const UTILS = readFileSync(new URL('../src/lib/utils.ts', import.meta.url), 'utf8')

const scaleMatch = UTILS.match(/'font-size':\s*\[\s*\{\s*text:\s*\[([^\]]*)\]/)
if (!scaleMatch) {
  console.error(
    'FAIL: src/lib/utils.ts has no font-size classGroups extension.\n' +
      'Without it tailwind-merge treats text-small and friends as colours and\n' +
      'silently drops the real colour. That is the 2.46:1 button bug.',
  )
  process.exit(1)
}

const SCALE = scaleMatch[1]
  .split(',')
  .map(part => part.trim().replace(/^['"]|['"]$/g, ''))
  .filter(Boolean)

for (const required of ['micro', 'small', 'read', 'label']) {
  if (!SCALE.includes(required)) {
    console.error(`FAIL: the font-size scale in src/lib/utils.ts no longer lists '${required}'.`)
    process.exit(1)
  }
}

const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: SCALE }] } },
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
