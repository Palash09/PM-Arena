# Product Arena Analytics Dashboard

This is a separate Next.js app for Product Arena usage analytics. It should be deployed as its own private Netlify site, not under `productarena.netlify.app`.

## Metrics Included

- Unique visitors and page views from `AnalyticsEvent`
- New account creation and signup conversion
- Google vs email/password account mix
- Onboarded users, users with saved decisions, and total synced decisions
- 14-day visitor/account trend
- Top pages and recent account/progress activity

## Required Environment Variables

```bash
DATABASE_URL="same-production-postgres-url-used-by-product-arena"
DASHBOARD_PASSWORD="choose-a-private-dashboard-password"
```

`DASHBOARD_PASSWORD` enables Basic Auth. The username can be anything; the password must match the env var.

## Recommended Hosting

Use a second Netlify site connected to the same GitHub repo:

1. Netlify → Add new site → Import from Git.
2. Select the same GitHub repo.
3. Set the base directory to `analytics-dashboard`.
4. Build command: `npm run build`.
5. Publish directory: `analytics-dashboard/.next` if Netlify asks from repo root, or `.next` when base directory is set.
6. Add `DATABASE_URL` and `DASHBOARD_PASSWORD`.
7. Deploy.

Recommended dashboard URL shape:

```text
https://product-arena-analytics.netlify.app
```

You can also host it on Vercel as a separate project using `analytics-dashboard` as the root directory. Netlify is simpler here because the main app is already there.
