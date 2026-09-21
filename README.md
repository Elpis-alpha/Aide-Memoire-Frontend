# Aide-mémoire — Web

The frontend for Aide-mémoire: rich-text notes organised into sections and
tags, with per-note public/private sharing.

**Next 16 (App Router) · React 19 · Tailwind v4 · TypeScript · TipTap 3.**

Deployed to Cloudflare Workers through the OpenNext adapter. The API is a
separate repository and a separate deployment.

## Running it

Requires Node 22+ and pnpm (`corepack enable && corepack prepare pnpm@10.28.2 --activate`),
and the API running locally on port 5000.

```bash
pnpm install
cp .env.example .env   # API_ORIGIN=http://localhost:5000
pnpm dev
```

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server on :3000 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm sync:types` | Regenerate `src/lib/api-types.ts` from the API's OpenAPI spec |
| `pnpm preview` | Build for Cloudflare and run it in workerd |
| `pnpm deploy` | Build for Cloudflare and deploy |

## The contract

The API owns the contract. `pnpm sync:types` runs `openapi-typescript` over the
API's `/openapi.json` and writes `src/lib/api-types.ts`, which every request
and response type in `src/lib/api.ts` is derived from. A breaking API change
shows up here as a compile error instead of a runtime surprise.

```bash
pnpm sync:types                                     # against a running local API
OPENAPI_SOURCE=../back-end/openapi.json pnpm sync:types
```

Commit the regenerated file. CI regenerates it and fails if it differs.

## Layout

```
app/                 Routes. 18 of them.
  (app)/             Signed-in: /me, /note, /section, /search, /settings
  public/, tag/      Public pages — Server Components, no client JavaScript
proxy.ts             Route protection, before any HTML is sent
src/
  components/
    editor/          One config-driven editor
    layout/          App shell: header, resizable note rail
    ui/              Button, dialog, toast, confirm-dialog
  hooks/             use-api (TanStack Query), use-autosave
  lib/               api client, generated types, cache tags, purge action
  stores/            Zustand, for client-only state
```

## Notable decisions

**Same-origin API.** The browser never talks to the API's origin. Requests go
to `/api/*` on this origin and `next.config.ts` rewrites them through, so the
auth cookie is host-only, `SameSite=Lax` is sufficient, and CORS never applies.

> `API_ORIGIN` must not contain a port. The OpenNext adapter matches rewrites
> with `path-to-regexp`, which reads `:5000` as a named parameter and fails
> every rewritten request inside the worker. Production is unaffected — the
> origin is a bare hostname — but it means the rewrite cannot be exercised
> locally against `localhost:PORT`.

**Route protection is a gate, not an authorisation decision.** `proxy.ts` only
checks that the session cookie is present, before any HTML is sent. The API
verifies it on every request and is the real boundary; a forged cookie earns a
redirect to `/login`, never data.

**Public pages are Server Components** with no client JavaScript, cached for
five minutes. Because mutations go from the browser straight to the API, Next's
server never learns that a note was unpublished — so every public fetch carries
cache tags and the mutation hooks call a Server Action that expires them. That
is what makes unpublishing, and account deletion, take effect immediately
rather than up to five minutes later. See `src/lib/cache-tags.ts`.

**One editor, not five.** The five near-identical editors differed only in
which toolbar controls they rendered, so that is a prop now. Every control is
described once with its command, icon, label, active check and shortcut.

**Autosave, not a wizard.** A note is created immediately with a default title;
every edit after that is debounced into a PATCH. `use-autosave.ts` coalesces
saves, never runs two at once, re-saves an edit made during a save, flushes on
unmount, and guards a real page unload only while genuinely dirty.

**Images go straight to Cloudinary** via a signed direct upload — they are
never base64-inlined into note content.

**State.** TanStack Query owns server state; Zustand owns the little that is
genuinely client-only. Section open/closed is the server's record alone,
toggled optimistically.

## Deploying to Cloudflare

`open-next.config.ts` binds an R2 bucket for the ISR cache and a D1 database
for cache tags. **The tag cache is not optional**: without it the on-demand
purge above succeeds locally and quietly does nothing in production.

```bash
wrangler r2 bucket create aide-memoire-inc-cache
wrangler d1 create aide-memoire-tag-cache   # paste the id into wrangler.jsonc
pnpm deploy
```

> Not yet deployed. The adapter build, the worker bundle and route protection
> in workerd have all been verified locally; the deploy itself, and the
> browser-to-Cloudflare cookie round trip, have not.
