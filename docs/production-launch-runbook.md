# Product Decision League Production Launch Runbook

## Required Inputs

Provide these values before the production deployment:

1. Final app hostname: `productdecision.palasharma.com`.
2. Domain registrar/DNS provider and confirmation that you can edit DNS records.
3. Current Netlify production site URL and confirmation that the GitHub repository is connected.
4. Netlify Database connection string. The production project already has `DATABASE_URL` configured.
5. Anthropic API key. The production project already has it configured; the current allowance is tuned for an approximately $5 monthly ceiling.
6. Resend API key and verification of `mail.palasharma.com`. Both are configured for production.
7. Google OAuth web client ID and secret.
8. Public support/contact email for privacy, terms, and user support pages.

Do not send API keys or database credentials in chat. Add secrets directly to Netlify environment variables or the relevant provider dashboard.

## Canonical URL

Use one HTTPS origin as `NEXT_PUBLIC_APP_URL`, without a trailing path:

```text
https://productdecision.palasharma.com
```

Set the custom domain as Netlify's primary production domain. Redirect the alternate hostname to the primary hostname. Keep the generated `netlify.app` URL available for operational access, but do not use it in public posts.

At Porkbun, create this DNS record and remove any parking record that conflicts with the same host:

```text
Type: CNAME
Host: productdecision
Answer: productarena.netlify.app
```

## Netlify Production Variables

Configure these for the **Production** deploy context. Secrets belong in Netlify, never in `.env` files committed to Git:

```text
DATABASE_URL
ANTHROPIC_API_KEY
ANTHROPIC_MODEL=claude-sonnet-4-20250514
AI_EVALUATION_HOURLY_LIMIT=3
AI_EVALUATION_DAILY_LIMIT=10
AI_EVALUATION_MONTHLY_LIMIT=200
RATE_LIMIT_SALT
RESEND_API_KEY
EMAIL_FROM
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_APP_URL
```

Generate `RATE_LIMIT_SALT` as a long random secret. Do not reuse an API key or password.

The production build fails if required values are missing or if `NEXT_PUBLIC_APP_URL` is not an HTTPS origin. Deploy previews can still build without production secrets.

## Database Deployment

### New hosted database

Run the checked-in migrations once against the hosted database:

```bash
DATABASE_URL="postgresql://..." npm run db:deploy
```

### Existing hosted database created with `prisma db push`

Do not apply the initial migration directly. The Netlify build runs `scripts/prepare-production-db.mjs`, which confirms every expected core legacy table is present before recording the initial migration as a baseline. It refuses to continue if the database contains only a partial core schema. The normal deploy command then safely adds analytics/password-reset tables when missing and applies the `AiUsageWindow` migration.

For a manual recovery, first confirm the schema matches `prisma/schema.prisma`, then run:

```bash
DATABASE_URL="postgresql://..." npx prisma migrate resolve --applied 20260812120000_initial_production_schema
DATABASE_URL="postgresql://..." npm run db:deploy
```

The second checked-in migration adds `AiUsageWindow` after the baseline. Do not reset or reseed a production database.

## Google OAuth

Create a Web application OAuth client and configure:

```text
Authorized JavaScript origin:
https://productdecision.palasharma.com

Authorized redirect URI:
https://productdecision.palasharma.com/api/auth/google/callback
```

If Google OAuth remains in testing mode, add launch testers or complete the consent-screen publishing requirements before public distribution.

## Resend

The verified sending domain is `mail.palasharma.com`. Use this branded sender:

```text
EMAIL_FROM=Product Decision League <account@mail.palasharma.com>
```

Resend permits any sender address after the sending domain is verified; the address does not need a separate mailbox. For replies and user support, configure `support@palasharma.com` as a Porkbun forwarding address to an inbox you monitor.

Send a real password-reset email in production and confirm that the link uses the custom app hostname.

## Launch Verification

After deployment, verify:

1. `/api/health` returns HTTP 200.
2. `/api/ready` returns HTTP 200 and `status: ready`.
3. Homepage, scenario market, leader cards, and a public challenge load on mobile and desktop.
4. Email signup, login, logout, and progress sync work.
5. Google OAuth returns to the custom domain.
6. Password reset sends and completes successfully.
7. Two scenario completions emit activation analytics.
8. `robots.txt`, `sitemap.xml`, and `manifest.webmanifest` use the custom domain.
9. A shared challenge renders the expected social preview.
10. Anthropic failure or allowance exhaustion still returns rules-based scoring.

## Rollback

If a production deploy fails smoke testing, publish the previous successful Netlify deploy. Database migrations must be forward-fixed; do not reset production data.
