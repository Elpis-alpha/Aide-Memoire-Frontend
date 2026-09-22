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
 * does. Any way the registration breaks — deleted, narrowed, commented out,
 * refactored, quoted differently — the merge misbehaves and these cases fail.
 * The file's formatting stops being something this script has an opinion on.
 *
 * Needs Node >= 22.18 for native TypeScript type stripping; utils.ts is
 * erasable-only syntax, so no loader or dev dependency is required. CI pins
 * node-version: 22, which resolves above that.
 */
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

if (failed > 0) {
  console.error(`\n${failed} class-merge case(s) wrong — a scale token is not registered.`)
  process.exit(1)
}
console.log('\nClass merging is correct.')
