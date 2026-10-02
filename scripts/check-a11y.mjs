import { chromium } from 'playwright-core'
import AxeBuilder from '@axe-core/playwright'
import { ROUTES, PUBLIC_ROUTES } from './routes.mjs'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const COOKIE = process.env.AUTH_COOKIE ?? ''

const browser = await chromium.launch({ channel: 'chrome' })
let violations = 0

for (const scheme of ['light', 'dark']) {
  const context = await browser.newContext({ colorScheme: scheme })

  if (COOKIE) {
    await context.addCookies(
      COOKIE.split('; ').map(pair => {
        const [name, ...rest] = pair.split('=')
        return { name, value: rest.join('='), url: BASE }
      }),
    )
  }

  const page = await context.newPage()

  for (const route of ROUTES) {
    if (!COOKIE && !PUBLIC_ROUTES.has(route)) continue
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    const { violations: found } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    for (const v of found) {
      violations++
      console.error(`FAIL ${scheme} ${route} — ${v.id}: ${v.help}`)
      for (const node of v.nodes) console.error(`       ${node.target.join(' ')}`)
    }
    if (found.length === 0) console.log(`pass ${scheme} ${route}`)
  }

  await context.close()
}

await browser.close()

if (violations > 0) {
  console.error(`\n${violations} axe violation(s).`)
  process.exit(1)
}
console.log('\nNo axe violations.')
