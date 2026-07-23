# OnePage

A production-ready, multi-tenant **link-in-bio SaaS**. Every user signs up, gets a public page at a unique URL (`/<slug>`), and manages it through a block-based dashboard with a live phone preview. Think Linktree / Beacons, but block-based and self-hosted.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, TypeScript strict) |
| Styling | Tailwind CSS v4 + hand-built shadcn-style UI |
| Database | Neon (serverless Postgres) |
| ORM | Drizzle ORM + drizzle-kit |
| Auth | Auth.js (NextAuth v5) — email/password + Google |
| Validation | Zod on every API/action boundary |
| Drag & drop | @dnd-kit |
| Image uploads | UploadThing |
| Email | Resend |
| Icons | lucide-react |
| Deploy | Vercel |

## Features

- **Public pages** — server-rendered, ISR (revalidate 60s), dynamic OG image, ~zero client JS (only the email form + video embeds).
- **Block editor** — drag to reorder, toggle visibility, duplicate, delete with undo, autosave, live preview, publish toggle.
- **10 block types** — profile, social row, link card, email capture, video, gallery, product, YouTube feed, rich text, divider.
- **Analytics** — views, clicks, CTR, per-block clicks, 30-day chart, devices, countries (all SQL aggregation).
- **Audience** — email capture with rate limiting, subscribers list, CSV export.
- **Theming** — 3 presets (Midnight / Light / Sunset), custom accent, fonts, button styles.
- **Plans** — Free (1 site, 7-day analytics, branding) vs Pro (unlimited sites, all blocks, custom domain, 30-day analytics, no branding). Enforced server-side.

## Getting started

### 1. Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) Postgres database (free tier is fine)

### 2. Install

```bash
npm install
```

### 3. Environment variables

Copy the example and fill it in:

```bash
cp .env.example .env.local
```

| Key | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Neon connection string (`postgresql://…?sslmode=require`) |
| `AUTH_SECRET` | ✅ | Run `openssl rand -base64 32` (or `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`) |
| `NEXT_PUBLIC_APP_URL` | ✅ | e.g. `http://localhost:3000` in dev |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | optional | Enables the "Continue with Google" button |
| `UPLOADTHING_TOKEN` | optional | Enables image uploads |
| `RESEND_API_KEY` | optional | Transactional email |
| `YOUTUBE_API_KEY` | optional | Powers the YouTube feed block refresh |

`src/env.ts` validates these with Zod and throws at build/boot if a required one is missing.

### 4. Database

Generate & apply the schema to Neon, then seed a demo user + site:

```bash
npm run db:generate   # create SQL migration from src/db/schema.ts
npm run db:migrate    # apply it to Neon
npm run db:seed       # demo user + published /ava page
```

Demo login after seeding: **demo@onepage.dev / password123** → public page at `/ava`.

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run db:generate` | Generate a Drizzle migration |
| `npm run db:migrate` | Apply migrations to the database |
| `npm run db:push` | Push schema without a migration file |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed demo data |

## Architecture

A public page is **an ordered array of blocks**. Each `blocks` row has a `type` and a JSONB `data`. Adding a new block type requires exactly four additions and nothing else:

1. A Zod variant in `src/lib/blocks/schemas.ts`
2. A renderer in `src/components/blocks/render/`
3. An editor form in `src/components/blocks/edit/`
4. Registry entries in `src/lib/blocks/registry.tsx` (render) + `src/lib/blocks/edit-registry.ts` (edit)

The render registry and edit registry are split so the public page ships **no editor JS**. The page renderer and editor shell iterate the registry and never change.

### Key paths

```
src/db/schema.ts            Drizzle schema (users, sites, blocks, subscribers, clicks, media, + auth)
src/lib/blocks/             Block schemas, registries, targets
src/lib/analytics.ts        SQL GROUP BY aggregations
src/app/[slug]/             Public page + OG image
src/app/dashboard/          Editor, design, audience, analytics, settings
src/app/api/                r (click redirect), pv (view beacon), subscribe, cron, uploadthing, auth
```

## Deploying to Vercel

1. Push to a Git repo and import into Vercel.
2. Add all environment variables from `.env.example` in the Vercel project settings.
3. The hourly YouTube refresh cron is declared in `vercel.json` (`/api/cron/refresh-youtube`). To secure it, add a `CRON_SECRET` env var equal to your `AUTH_SECRET` — Vercel sends it as `Authorization: Bearer …` and the route verifies it.
4. Deploy. Neon works out of the box over the serverless HTTP driver.

## Security notes

- Every server action and route handler validates input with Zod and re-checks that the caller owns the site.
- Outbound links route through `/api/r/[blockId]` with a per-block allow-list (no open redirects).
- Rich-text HTML is sanitized server-side (DOMPurify) before storage.
- `/api/subscribe` is rate-limited to 5 requests/IP/minute.
- Cascade deletes remove a user's sites, blocks, subscribers and clicks.
