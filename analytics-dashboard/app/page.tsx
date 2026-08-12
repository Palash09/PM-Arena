import { getDashboardMetrics } from "@/lib/metrics";

export const dynamic = "force-dynamic";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

function KpiCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <section className="card kpi-card">
      <p className="eyebrow">{label}</p>
      <p className="kpi-value">{value}</p>
      <p className="muted">{detail}</p>
    </section>
  );
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  const maxTrendValue = Math.max(
    1,
    ...metrics.trend.map((entry) => Math.max(entry.visitors, entry.accounts))
  );
  const maxFunnelValue = Math.max(1, ...metrics.funnel.map((entry) => entry.value));
  const maxChallengeFunnelValue = Math.max(
    1,
    ...metrics.challengeFunnel.map((entry) => entry.value)
  );
  const maxPageViews = Math.max(1, ...metrics.topPages.map((entry) => entry.views));
  const maxSourceVisitors = Math.max(1, ...metrics.topSources.map((entry) => entry.visitors));

  return (
    <main className="dashboard-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow green">Product Decision League</p>
          <h1>Usage Dashboard</h1>
          <p className="subtitle">
            Visitor, signup, onboarding, and gameplay signals from the production database.
          </p>
        </div>
        <div className="timestamp">
          <span>Updated</span>
          <strong>{new Date(metrics.generatedAt).toLocaleString()}</strong>
        </div>
      </header>

      <section className="kpi-grid">
        <KpiCard
          label="Unique Visitors"
          value={formatNumber(metrics.cards.uniqueVisitors30)}
          detail="Last 30 days"
        />
        <KpiCard
          label="Accounts Created"
          value={formatNumber(metrics.cards.accounts30)}
          detail={`${formatNumber(metrics.cards.totalAccounts)} total accounts`}
        />
        <KpiCard
          label="Signup Conversion"
          value={`${metrics.cards.signupConversion30}%`}
          detail="Accounts / unique visitors"
        />
        <KpiCard
          label="Activated Players"
          value={formatNumber(metrics.cards.activatedPlayerCount30)}
          detail="Completed at least two scenarios, 30d"
        />
      </section>

      <section className="kpi-grid">
        <KpiCard
          label="Challenge Starts"
          value={formatNumber(metrics.challengeCards.starters30)}
          detail={`${metrics.challengeCards.startRate30}% of challenge viewers`}
        />
        <KpiCard
          label="Challenge Reveals"
          value={formatNumber(metrics.challengeCards.completers30)}
          detail={`${metrics.challengeCards.completionRate30}% of decision starters`}
        />
        <KpiCard
          label="Challenge Share Rate"
          value={`${metrics.challengeCards.shareRate30}%`}
          detail={`${formatNumber(metrics.challengeCards.sharers30)} people shared`}
        />
        <KpiCard
          label="Full Product CTR"
          value={`${metrics.challengeCards.ctaRate30}%`}
          detail={`${formatNumber(metrics.challengeCards.ctaUsers30)} reveal-to-product clicks`}
        />
      </section>

      <section className="content-grid">
        <section className="card wide">
          <div className="section-heading">
            <div>
              <p className="eyebrow">14 Day Trend</p>
              <h2>Visitors and new accounts</h2>
            </div>
            <span className="legend">
              <i className="visitor-dot" /> Visitors
              <i className="account-dot" /> Accounts
            </span>
          </div>
          <div className="trend-chart" aria-label="Visitors and accounts by day">
            {metrics.trend.map((entry) => (
              <div className="trend-day" key={entry.date}>
                <div className="bars">
                  <span
                    className="bar visitors"
                    style={{ height: `${Math.max(4, (entry.visitors / maxTrendValue) * 100)}%` }}
                    title={`${entry.visitors} visitors`}
                  />
                  <span
                    className="bar accounts"
                    style={{ height: `${Math.max(4, (entry.accounts / maxTrendValue) * 100)}%` }}
                    title={`${entry.accounts} accounts`}
                  />
                </div>
                <span className="axis-label">{formatDate(entry.date)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow green">Playable funnel</p>
              <h2>Challenge distribution loop</h2>
            </div>
          </div>
          <div className="funnel-list">
            {metrics.challengeFunnel.map((entry) => (
              <div className="funnel-row" key={entry.label}>
                <div>
                  <strong>{entry.label}</strong>
                  <span>{formatNumber(entry.value)}</span>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${(entry.value / maxChallengeFunnelValue) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Attribution</p>
              <h2>Challenge sources and campaigns</h2>
            </div>
          </div>
          <div className="page-list">
            {metrics.topSources.length ? (
              metrics.topSources.map((entry) => (
                <div className="page-row" key={`${entry.source}-${entry.campaign}`}>
                  <div>
                    <strong>{entry.source}</strong>
                    <span>{entry.campaign} · {formatNumber(entry.visitors)} visitors</span>
                  </div>
                  <div className="mini-track">
                    <span style={{ width: `${(entry.visitors / maxSourceVisitors) * 100}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="empty">No challenge attribution recorded yet.</p>
            )}
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Funnel</p>
              <h2>Activation path</h2>
            </div>
          </div>
          <div className="funnel-list">
            {metrics.funnel.map((entry) => (
              <div className="funnel-row" key={entry.label}>
                <div>
                  <strong>{entry.label}</strong>
                  <span>{formatNumber(entry.value)}</span>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${(entry.value / maxFunnelValue) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Traffic</p>
              <h2>Top pages</h2>
            </div>
          </div>
          <div className="page-list">
            {metrics.topPages.length ? (
              metrics.topPages.map((entry) => (
                <div className="page-row" key={entry.path}>
                  <div>
                    <strong>{entry.path}</strong>
                    <span>{formatNumber(entry.views)} views</span>
                  </div>
                  <div className="mini-track">
                    <span style={{ width: `${(entry.views / maxPageViews) * 100}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="empty">No page views recorded yet.</p>
            )}
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Accounts</p>
              <h2>Login method mix</h2>
            </div>
          </div>
          <div className="auth-mix">
            {metrics.authMix.map((entry) => (
              <div className="auth-pill" key={entry.label}>
                <span>{entry.label}</span>
                <strong>{formatNumber(entry.value)}</strong>
              </div>
            ))}
          </div>
          <p className="note">
            Signed-in visitor rate: {metrics.cards.signedInVisitorRate30}% in the last 30 days.
          </p>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Progress</p>
              <h2>Gameplay health</h2>
            </div>
          </div>
          <div className="health-grid">
            <div>
              <strong>{formatNumber(metrics.cards.onboardedUsers)}</strong>
              <span>Onboarded</span>
            </div>
            <div>
              <strong>{formatNumber(metrics.cards.activeProgress30)}</strong>
              <span>Active progress, 30d</span>
            </div>
          </div>
        </section>
      </section>

      <section className="table-grid">
        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recent</p>
              <h2>New accounts</h2>
            </div>
          </div>
          <div className="table-list">
            {metrics.recentAccounts.map((account) => (
              <div className="table-row" key={`${account.email}-${account.createdAt}`}>
                <div>
                  <strong>{account.email}</strong>
                  <span>{account.method}</span>
                </div>
                <time>{formatDate(account.createdAt)}</time>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recent</p>
              <h2>Saved progress</h2>
            </div>
          </div>
          <div className="table-list">
            {metrics.progressSummaries.map((progress) => (
              <div className="table-row" key={`${progress.email}-${progress.updatedAt}`}>
                <div>
                  <strong>{progress.email}</strong>
                  <span>
                    {progress.onboarded ? "Onboarded" : "Not onboarded"} · {progress.attempts} decisions
                  </span>
                </div>
                <time>{formatDate(progress.updatedAt)}</time>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
