/**
 * Tests the real `cn` from src/lib/utils.ts, not a reconstruction of it.
 *
 * Two earlier versions of this script tried to establish the config was
 * present by other means, and both could pass while the app was broken. The
 * first declared its own copy of the config — delete the registration from
 * utils.ts and the check, testing its copy, stayed green. The second read
 * utils.ts as text, which review defeated three ways: a block comment holding
 * the old config above a bare call, an unrelated constant with the same shape
 * earlier in the file, and a `//` comment written tight against a colon
 * (`extend://`) that the comment stripper did not remove.
 *
 * Each fix closed one hole and left the mechanism able to open another,
 * because text is not behaviour. So this imports `cn` and asserts on what it
 * does, for every size the theme defines. However the registration breaks for
 * one of those sizes — deleted, narrowed, commented out, refactored, quoted
 * differently — the merge misbehaves and an assertion fails. The file's
 * formatting stops being something this script has an opinion on.
 *
 * The claim is scoped to sizes the theme declares, and that is the whole claim.
 * A fourth version of this script was needed because its predecessor asserted
 * "however the registration breaks" while testing five hand-picked tokens.
 *
 * Needs Node >= 22.18 for native TypeScript type stripping; utils.ts is
 * erasable-only syntax, so no loader or dev dependency is required. CI pins
 * node-version: 22, which resolves above that.
 */
import { readFileSync } from 'node:fs'

let cn
try {
  ({ cn } = await import('../src/lib/utils.ts'))
} catch (error) {
  console.error(
    'FAIL: could not import src/lib/utils.ts.\n' +
      'This check runs the real cn(), which needs Node >= 22.18 for native\n' +
      'TypeScript type stripping.\n' +
      `Node here is ${process.version}.\n${error.message}`,
  )
  process.exit(1)
}

/**
 * Every font size the theme defines must survive beside a colour, in both
 * orders. The `@theme` block is the source of truth for which sizes exist, so
 * a size added there and forgotten in the registration fails here too.
 *
 * Five hand-picked cases are not enough: an earlier version exercised only
 * `small`, `read`, `title` and `label`, so a scale narrowed to exactly those
 * passed while `cn` had genuinely regressed for `micro`, `lead`, `hero` and
 * `display` — all four in live use. Both orders are checked because whether
 * the colour or the size comes first is an accident of each call site's
 * markup, not something this guard should depend on.
 */
const CSS = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')

/**
 * Only `--text-*` inside `@theme` is a font size.
 *
 * Tailwind reserves that namespace within `@theme`; elsewhere in the file
 * `--text-…` is an ordinary custom property and may mean anything —
 * `--text-underline-offset` is the obvious example. Scanning the whole file
 * swept those in and failed the build with "a scale token is not registered",
 * pointing the reader at the registration when the real cause was an
 * unrelated variable. A check that cries wolf gets deleted, and deleting this
 * one puts back the silent 2.46:1 bug it exists to catch.
 */
const themeOpen = CSS.match(/^@theme[^{]*\{/m)
if (!themeOpen) {
  console.error('FAIL: no @theme block found in app/globals.css.')
  process.exit(1)
}

let cursor = themeOpen.index + themeOpen[0].length
const themeStart = cursor
let braces = 1
while (cursor < CSS.length && braces > 0) {
  if (CSS[cursor] === '{') braces++
  else if (CSS[cursor] === '}') braces--
  cursor++
}
if (braces !== 0) {
  console.error('FAIL: unbalanced braces in the @theme block of app/globals.css.')
  process.exit(1)
}

const THEME = CSS.slice(themeStart, cursor - 1)

const SIZES = [
  ...new Set([...THEME.matchAll(/^\s*--text-([a-z0-9-]+)\s*:/gm)].map(match => match[1])),
]

if (SIZES.length === 0) {
  console.error('FAIL: no --text-* sizes found in the @theme block of app/globals.css.')
  process.exit(1)
}

const COVERAGE = SIZES.flatMap(size => [
  [`${size} keeps its colour`, `text-accent-contrast text-${size}`, ['text-accent-contrast', `text-${size}`]],
  [`${size} keeps its colour, reversed`, `text-${size} text-accent-contrast`, ['text-accent-contrast', `text-${size}`]],
])

const CASES = [
  ['two sizes collapse to the last', 'text-label text-title', 'text-title'],
  ['colour then size both survive', 'text-ink-faint text-label', 'text-ink-faint text-label'],
  ['size then colour both survive', 'text-label text-ink-faint', 'text-label text-ink-faint'],
  ['the 2.46:1 case', 'text-accent-contrast text-small', 'text-accent-contrast text-small'],
  ['the 2.46:1 case at lg', 'text-accent-contrast text-read', 'text-accent-contrast text-read'],
]

let failed = 0

for (const [name, input, want] of CASES) {
  const got = cn(input)
  const ok = got === want
  if (!ok) failed++
  console.log(`  ${ok ? 'pass' : 'FAIL'}  ${name}`)
  if (!ok) console.log(`        in "${input}" -> "${got}", wanted "${want}"`)
}

for (const [name, input, wanted] of COVERAGE) {
  const got = cn(input)
  const ok = wanted.every(cls => got.split(' ').includes(cls))
  if (!ok) failed++
  console.log(`  ${ok ? 'pass' : 'FAIL'}  ${name}`)
  if (!ok) console.log(`        in "${input}" -> "${got}", wanted all of ${wanted.join(' ')}`)
}

if (failed > 0) {
  console.error(`\n${failed} class-merge case(s) wrong — a scale token is not registered.`)
  process.exit(1)
}
console.log(`\nClass merging is correct (${CASES.length + COVERAGE.length} assertions, ${SIZES.length} sizes).`)
