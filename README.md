# Mr. Twin Backoffice

Admin panel (SvelteKit) for **Mr. Twin** — Fase 2 of the portfolio project: connecting/monitoring the Accurate sync, curating which synced items become storefront products, and managing local orders. See [`PLANNING.md`](../PLANNING.md) for the full project rationale.

Like `mr-twin-web`, this is a pure REST API client against [`mr-twin-backend`](../mr-twin-backend) — it holds no database of its own. Unlike `mr-twin-web`, every single page here requires an admin session; there's no public content at all.

## Tech stack

- SvelteKit 5 (Svelte 5 runes, TypeScript)
- Tailwind CSS v4
- Prettier + ESLint

## Setup

```bash
npm install
cp .env.example .env
```

`.env`:
```
PUBLIC_API_BASE_URL=http://localhost:8000
```

You need an admin account and (ideally) an already-connected Accurate session on the backend — see `mr-twin-backend`'s README ("Admin account" and "Connecting to Accurate" sections).

```bash
npm run dev
```

## Whole app is `ssr = false`

Set once in `src/routes/+layout.ts`, applies to every route. Unlike `mr-twin-web` (public katalog stays SSR, only auth-gated pages disable it), there's no public content here at all — every page needs the admin token from `localStorage`, so there's no reason to keep SSR for any of it. The upside: `+page.ts` load functions can read the auth store directly and fetch data, no `onMount` + local-state duplication needed.

The same `+layout.ts` also does the auth guard (redirect to `/login` if logged out, redirect to `/` if logged in and hitting `/login`) — one place, not repeated per page.

## Pages

| Route | Purpose |
|---|---|
| `/login` | Admin login |
| `/` | Dashboard — Accurate connection status, database picker, sync triggers, recent sync log |
| `/products` | All synced items (published or not), filter by search/published/suspended |
| `/products/[id]` | Curate one item: publish toggle, display name/description/category/brand/sort order, image upload/delete |
| `/orders` | All orders across all customers, filter by status |
| `/orders/[id]` | Order + customer + items, change status (pending/completed/cancelled) |

"Connect to Accurate" on the dashboard just links to `{PUBLIC_API_BASE_URL}/accurate/connect` in a new tab — that flow is a full-page browser redirect through Accurate's own login and back to the *backend*, not this app (see `mr-twin-backend`'s README for why). Come back and click "Muat Daftar Database" once it's done.

## API client (`src/lib/api/`)

Same `apiFetch`/`ApiError` shape as `mr-twin-web`'s `src/lib/api/client.ts`, plus one addition: it detects a `FormData` body (used by product image upload) and skips JSON-stringifying it / skips setting `Content-Type` so the browser can set the multipart boundary itself.

One bug worth remembering: query-string boolean filters (`is_published`, `suspended`) must be sent as `"1"`/`"0"`, not `"true"`/`"false"` — Laravel's `boolean` validation rule accepts the former but rejects the latter from a query string (it's stricter there than for JSON body booleans, which pass through fine). `apiFetch` converts any JS `boolean` param value to `'1'`/`'0'` automatically so every API module gets this for free.

## State (`src/lib/stores/`)

`auth.svelte.ts` (Svelte 5 runes, same pattern as `mr-twin-web`) holds the admin session, persisted to `localStorage`. `toast.svelte.ts` + `ToastStack.svelte` are a direct copy — no logic changed.

## Checks

```bash
npm run check   # svelte-check (TypeScript)
npm run lint    # prettier --check + eslint
npm run format  # prettier --write
```
