# Product Arena

Product Arena is a mobile-first PM decision simulator inspired by football career modes. The first build in this repo includes:

- A Next.js app with a FIFA-leaning interface for `The Hub`, `Transfer Market`, leader cards, and playable decision scenarios
- A seeded data layer built from the `podcasts/` transcript corpus
- API endpoints for scenarios, players, profile data, decision evaluation, auth, and progress sync
- A Prisma/Postgres schema for profiles, scenarios, options, player cards, attempts, user accounts, sessions, and saved progress
- A Claude-compatible transcript extraction script for generating more scenarios from podcast transcripts

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Anthropic Claude API

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start Postgres:

   ```bash
   docker compose up -d
   ```

4. Generate Prisma client and push the schema:

   ```bash
   npm run prisma:generate
   npm run db:push
   ```

5. Seed the local database:

   ```bash
   npm run db:seed
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

## Hosted database setup

For free hosted Postgres, Neon is the simplest fit for this repo because the app already uses Prisma with PostgreSQL.

1. Create a Neon project and copy the pooled connection string.
2. Set `DATABASE_URL` in your deployment provider.
3. Generate and push the schema against the hosted database:

   ```bash
   DATABASE_URL="your-neon-connection-string" npm run db:push
   DATABASE_URL="your-neon-connection-string" npm run db:seed
   ```

4. Deploy with:

   ```bash
   npm run build
   ```

`postinstall` runs `prisma generate` automatically during hosted builds.

Signed-in users use server-side email/password auth with an HTTP-only session cookie. Progress syncs to the `SavedProgress` table; guest users still have browser-local fallback progress.

Password reset emails use Resend. In production, set `RESEND_API_KEY` and `EMAIL_FROM` in Netlify. `EMAIL_FROM` should use a sender/domain verified in Resend. Without `RESEND_API_KEY`, local development returns a development reset link in the UI, but production reset emails are disabled.

## Netlify deployment

This repo is configured for Netlify with `netlify.toml`.

### One-time setup

1. Create a hosted Postgres database. Neon or Supabase both work; use a pooled connection string for serverless deployments.
2. In Netlify, create a new site from the Git repo.
3. Set these Netlify environment variables:

   ```bash
   DATABASE_URL="your-hosted-postgres-connection-string"
   ANTHROPIC_API_KEY="your-anthropic-key"
   ANTHROPIC_MODEL="claude-3-7-sonnet-latest"
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_FROM="Product Arena <your-verified-sender@yourdomain.com>"
   ```

4. Apply the Prisma schema to the hosted database once:

   ```bash
   DATABASE_URL="your-hosted-postgres-connection-string" npm run db:deploy
   ```

5. Deploy on Netlify.

### Netlify build settings

The checked-in `netlify.toml` uses:

```toml
[build]
  command = "npm run build:netlify"
  publish = ".next"
```

The build command runs `prisma generate` and `next build`. It does not run `db:seed`.

### Important production note

Do not run `npm run db:seed` against the production database after launch. The current seed script is intended for local/demo setup and clears seeded gameplay tables before inserting sample content. The app already falls back to the checked-in scenario and leader catalog, so production only needs `npm run db:deploy` for auth and synced progress tables.

## Transcript ingestion

To generate scenario extraction output from the `podcasts/` folder:

```bash
PODCAST_LIMIT=10 npm run extract:scenarios
```

If `ANTHROPIC_API_KEY` is present, the script will call Claude and write results to `tmp/scenario-extractions.json`. Without the key, it still produces prompt previews so the extraction workflow can be inspected locally.
