#!/usr/bin/env node
/**
 * Regenerates the frontend's view of the API contract.
 *
 * The backend owns the contract: its zod schemas produce /openapi.json, and
 * this turns that into TypeScript. A breaking API change therefore surfaces
 * here as a compile error rather than a runtime surprise — which is what buys
 * type safety across two repos without a monorepo.
 *
 *   pnpm sync:types                        # against a running local API
 *   OPENAPI_SOURCE=../back-end/openapi.json pnpm sync:types
 *   OPENAPI_SOURCE=https://api.example.com/openapi.json pnpm sync:types
 */
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const source = process.env.OPENAPI_SOURCE ?? 'http://localhost:5000/openapi.json'
const out = 'src/lib/api-types.ts'

const looksLikeUrl = /^https?:\/\//.test(source)
if (!looksLikeUrl && !existsSync(source)) {
  console.error(
    `Cannot read the OpenAPI spec at "${source}".\n` +
      `Start the API and retry, or point OPENAPI_SOURCE at the committed spec:\n` +
      `  OPENAPI_SOURCE=../back-end/openapi.json pnpm sync:types`,
  )
  process.exit(1)
}

console.log(`Generating ${out} from ${source}`)
execFileSync('pnpm', ['exec', 'openapi-typescript', source, '-o', out], { stdio: 'inherit' })
console.log('Done. Commit the result so CI and teammates share the same contract.')
