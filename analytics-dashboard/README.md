# Product Decision League Analytics Dashboard

This is a separate Next.js app for Product Decision League usage analytics. It is deployed as its own private Netlify site, not under the public application domain.

Production dashboard: https://product-decision-league-analytics.netlify.app

Netlify builds this app from the `analytics-dashboard` base directory in the main repository. HTTP Basic Auth is enforced by middleware and fails closed when `DASHBOARD_PASSWORD` is missing.

## Metrics Included

- Unique visitors and page views from `AnalyticsEvent`
- New account creation and signup conversion
- Google vs email/password account mix
- Onboarded users, users with saved decisions, and total synced decisions
- 14-day visitor/account trend
- Top pages and recent account/progress activity
- Sanitized client and server error counts
- Anthropic evaluations, failures, estimated token spend, and monthly budget usage

## Required Environment Variables

```bash
DATABASE_URL="same-production-postgres-url-used-by-product-decision-league"
DASHBOARD_PASSWORD="choose-a-private-dashboard-password"
ANTHROPIC_MONTHLY_BUDGET_USD="5"
```

`DASHBOARD_PASSWORD` is required. The dashboard denies access when it is missing. The username can be anything; the password must match the env var.

## Hosting Configuration

The separate Netlify site is connected to the same GitHub repo with these settings:

1. Base directory: `analytics-dashboard`.
2. Build command: `npm run build`.
3. Publish directory: `analytics-dashboard/.next` in the site settings.
4. Production variables: `DATABASE_URL`, `DASHBOARD_PASSWORD`, and `ANTHROPIC_MONTHLY_BUDGET_USD`.

The dashboard remains on its Netlify URL so product analytics are not exposed under the public application domain.
