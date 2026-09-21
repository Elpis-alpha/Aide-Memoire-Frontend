import { readFileSync } from 'node:fs'

const CSS = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')

/**
 * Pull `--name: value;` pairs out of one CSS rule block.
 *
 * Anchored to a line-start selector followed by `{`. A plain indexOf finds
 * the selector inside `@custom-variant dark (&:where([data-theme='dark'],
 * …))` on line 12, whose next `{` is `:root` — so the dark check silently
 * read the light tokens and reported light's ratios twice.
 */
function block(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = new RegExp(`^\\s*${escaped}\\s*\\{`, 'm').exec(CSS)
  if (!match) throw new Error(`No "${selector}" rule block in globals.css`)
  const open = CSS.indexOf('{', match.index)
  const close = CSS.indexOf('}', open)
  const out = {}
  for (const line of CSS.slice(open + 1, close).split('\n')) {
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*([^;]+);/)
    if (m) out[m[1]] = m[2].trim()
  }
  return out
}

/** Resolve `var(--x)` chains to a literal hex. */
function resolve(tokens, value, depth = 0) {
  if (depth > 10) throw new Error(`var() cycle at ${value}`)
  const m = value.match(/^var\((--[\w-]+)\)$/)
  return m ? resolve(tokens, tokens[m[1]], depth + 1) : value
}

const lin = c => {
  c /= 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function luminance(hex) {
  const m = hex.trim().match(/^#([0-9a-f]{6})$/i)
  if (!m) throw new Error(`Not a 6-digit hex colour: "${hex}"`)
  const n = parseInt(m[1], 16)
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255)
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Every pair that must hold. `min` is 4.5 for text and 3 for a non-text
 * indicator (WCAG 1.4.11).
 *
 * `--rule` is absent on purpose: it is decorative and never the sole
 * indicator of a control or its state, so 1.4.11 does not apply to it.
 */
const PAIRS = [
  ['--ink', '--paper', 4.5, 'body text on paper'],
  ['--ink', '--surface', 4.5, 'body text on surface'],
  ['--ink-muted', '--paper', 4.5, 'muted text on paper'],
  ['--ink-muted', '--surface', 4.5, 'muted text on surface'],
  ['--ink-faint', '--paper', 4.5, 'faint text on paper'],
  ['--ink-faint', '--surface', 4.5, 'faint text on surface'],
  ['--ink', '--surface-raised', 4.5, 'body text on a raised surface'],
  ['--ink-muted', '--surface-raised', 4.5, 'muted text on a raised surface'],
  ['--ink-faint', '--surface-raised', 4.5, 'faint text on a raised surface'],
  ['--correct', '--correct-soft', 4.5, 'error text on its tinted background'],
  ['--accent', '--accent-soft', 4.5, 'accent text on its tinted background'],
  ['--accent-contrast', '--accent', 4.5, 'primary button label'],
  ['--correct-contrast', '--correct', 4.5, 'destructive button label'],
  ['--correct', '--surface', 4.5, 'error text on surface'],
  ['--highlight-ink', '--highlight', 4.5, 'search marker text'],
  ['--rule-strong', '--surface-sunken', 3, 'field underline on its wash'],
  ['--rule-strong', '--paper', 3, 'field underline on paper'],
  ['--accent', '--surface-sunken', 3, 'focused field underline'],
  ['--focus', '--paper', 3, 'focus ring on paper'],
  ['--focus', '--surface', 3, 'focus ring on surface'],
]

const LIGHT = block(':root')
const DARK = { ...LIGHT, ...block("[data-theme='dark']") }

/**
 * Guard against the parser silently reading the wrong block. If dark's
 * surfaces match light's, the dark half of this check is theatre — which is
 * exactly the failure mode this harness exists to prevent.
 */
if (LIGHT['--paper'] === DARK['--paper'] && LIGHT['--surface'] === DARK['--surface']) {
  throw new Error('Dark tokens are identical to light — the dark block did not parse.')
}

let failed = 0
for (const [theme, tokens] of [
  ['light', LIGHT],
  ['dark', DARK],
]) {
  console.log(`\n${theme}`)
  for (const [fg, bg, min, label] of PAIRS) {
    if (!tokens[fg]) throw new Error(`${theme}: token ${fg} is not defined`)
    if (!tokens[bg]) throw new Error(`${theme}: token ${bg} is not defined`)
    const value = ratio(resolve(tokens, tokens[fg]), resolve(tokens, tokens[bg]))
    const ok = value >= min
    if (!ok) failed++
    console.log(
      `  ${ok ? 'pass' : 'FAIL'}  ${value.toFixed(2).padStart(5)}:1  (min ${min})  ${label}`,
    )
  }
}

if (failed > 0) {
  console.error(`\n${failed} contrast pair(s) below the floor.`)
  process.exit(1)
}
console.log('\nAll contrast pairs pass.')
