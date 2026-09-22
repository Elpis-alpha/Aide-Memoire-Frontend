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

const fail = message => {
  console.error(`FAIL: ${message}`)
  process.exit(1)
}

/**
 * Scan only the live `extendTailwindMerge(...)` argument.
 *
 * A plain match against the whole file is satisfiable by text that is not a
 * live registration. Both of these were demonstrated against an earlier draft:
 * the config left behind as a block comment above a now-bare
 * `extendTailwindMerge()`, and an unrelated constant earlier in the file
 * carrying the same `'font-size': [{ text: [...] }]` shape while the real call
 * quietly dropped an entry. Each passed while the app was broken.
 *
 * So: strip comments, require exactly one call, walk its parentheses to find
 * where the argument ends, and look only inside that. Anything ambiguous fails
 * loudly rather than guessing — this script exists to catch a silent failure,
 * so it must not have one of its own.
 */
const CODE = UTILS.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1')

const calls = [...CODE.matchAll(/extendTailwindMerge\s*\(/g)]
if (calls.length !== 1) {
  fail(`expected exactly one extendTailwindMerge( call in src/lib/utils.ts, found ${calls.length}.`)
}

const argStart = calls[0].index + calls[0][0].length
let i = argStart
let depth = 1
while (i < CODE.length && depth > 0) {
  if (CODE[i] === '(') depth++
  else if (CODE[i] === ')') depth--
  i++
}
if (depth !== 0) fail('unbalanced parentheses in the extendTailwindMerge call.')
const ARG = CODE.slice(argStart, i - 1)

const keys = [...ARG.matchAll(/'font-size'\s*:/g)]
if (keys.length === 0) {
  fail(
    'the live extendTailwindMerge call in src/lib/utils.ts registers no font-size scale.\n' +
      'Without it tailwind-merge treats text-small and friends as colours and\n' +
      'silently drops the real colour. That is the 2.46:1 button bug.',
  )
}
if (keys.length > 1) fail(`ambiguous: ${keys.length} font-size keys inside the call.`)

const scaleMatch = ARG.match(/'font-size'\s*:\s*\[\s*\{\s*text:\s*\[([^\]]*)\]/)
if (!scaleMatch) fail('the font-size key is present but its text scale could not be parsed.')

const SCALE = scaleMatch[1]
  .split(',')
  .map(part => part.trim().replace(/^['"]|['"]$/g, ''))
  .filter(Boolean)

for (const required of ['micro', 'small', 'read', 'label']) {
  if (!SCALE.includes(required)) {
    fail(`the font-size scale in src/lib/utils.ts no longer lists '${required}'.`)
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
