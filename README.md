# grep.chat

A Next.js 15 app that lets you chat with models via OpenRouter, using Supabase for auth + data, Tailwind for styling, and Radix UI primitives. Redis is used optionally for lightweight caching.

## Tech

- Next.js 15.5.3 (App Router, Turbopack)
- React 19
- AI SDK
- OpenRouter for AI Model keys
- Tailwind CSS v4
- Radix UI (Dialog, Select, AlertDialog, etc.)
- Supabase (Auth, Postgres, RLS)
- OpenRouter (model access)
- Redis (optional cache)

## Quick start

```bash
# 1) Install deps (pick one)
npm install
# or
yarn
# or``
pnpm install
# or
bun install

# 2) Copy env and fill values
cp env.example .env.local

# 3) Run dev server
npm run dev
# http://localhost:3000
```

## Environment variables

Copy `[env.example](./env.example)` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL=""                 # From Supabase -> Project Settings -> API
NEXT_PUBLIC_SUPABASE_ANON_KEY=""            # From Supabase -> Project Settings -> API
SUPABASE_SERVICE_ROLE_KEY=""                # From Supabase -> Project Settings -> API (server-only)
OPENROUTER_API_KEY=""                       # From OpenRouter API keys
REDIS_URL=""                                # Optional, e.g. redis://default:password@host:port
SUPABASE_PROJECT_ID=""                      # Optional, used by `npm run update-types`
```

Important:

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. Set it only in server-side environments (e.g., Vercel Project Settings – Environment Variables).
- `NEXT_PUBLIC_*` values are safe to be exposed to the client.

## Database schema

SQL files live under `supabase/schemas`:

- `users.sql` (user profile + trigger to insert profile on signup)
- `chats.sql` (chat records)
- `messages.sql` (chat messages)

On a fresh project, run these in the Supabase SQL editor to provision tables and RLS policies.

Types can be regenerated (optional) once your Supabase project is set up:

```bash
# Requires SUPABASE_PROJECT_ID and `supabase` CLI available
npm run update-types
```

## Running

```bash
# Development
npm run dev

# Lint
npm run lint

# Format
npm run format

# Production build
npm run build
npm start
```

Implementation references:

- `app/api/chat/route.ts` – builds the `streamText` call with OpenRouter provider and optional reasoning/web search.
- `hooks/use-chat.ts` – client state for `model`, `reasoning`, and `webSearch` that are posted to the API.

## Account deletion

A Delete Account control lives in Settings → Account. This calls:

- `DELETE /api/account` → implemented in `app/api/account/route.ts`.
- It verifies the current session and deletes the user using the Supabase Admin API (requires `SUPABASE_SERVICE_ROLE_KEY`).
- Deleting a user cascades to related rows based on the schema and foreign key constraints.

Make sure `SUPABASE_SERVICE_ROLE_KEY` is configured on the server (e.g., Vercel), not exposed to the client.

## Project layout (high level)

```
app/
  api/
    chat/route.ts        # Chat streaming endpoint (OpenRouter)
    account/route.ts     # Delete account endpoint (Supabase Admin)
components/
  settings/
    settings-dialog.tsx  # Settings (General, Account)
  sidebar/               # Sidebar UI
  ui/                    # Radix-wrapped UI components
lib/
  supabase/              # Supabase clients (server/client)
  redis/                 # Redis client + cache helpers (optional)
supabase/
  schemas/               # SQL schema & RLS
```

## Deployment

- Recommended: Vercel
- Set all env vars in the project settings (including `SUPABASE_SERVICE_ROLE_KEY`).
- Add your site URL to `NEXT_PUBLIC_SITE_URL` accordingly.
- Build with `npm run build` and run `npm start` (handled by Vercel automatically).

---

Feel free to open issues/PRs to improve DX or docs.

### MIT LICENSED
