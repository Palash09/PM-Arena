import { prisma } from "@/lib/prisma";

type ProgressData = {
  onboarded?: boolean;
  attempts?: unknown[];
};

function daysAgo(days: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function percent(numerator: number, denominator: number) {
  if (!denominator) {
    return 0;
  }

  return Math.round((numerator / denominator) * 1000) / 10;
}

function asProgressData(value: unknown): ProgressData {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  return value as ProgressData;
}

function metadataValue(value: unknown, key: string) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }

  const candidate = (value as Record<string, unknown>)[key];
  return typeof candidate === "string" && candidate.trim() ? candidate : undefined;
}

function metadataNumber(value: unknown, key: string) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return 0;
  const candidate = (value as Record<string, unknown>)[key];
  return typeof candidate === "number" && Number.isFinite(candidate) ? candidate : 0;
}

function uniqueEventActors(
  events: Array<{ id: string; anonymousId: string | null; userId: string | null }>
) {
  return new Set(events.map((event) => event.userId || event.anonymousId || event.id)).size;
}

function referrerHost(referrer: string | null) {
  if (!referrer) return undefined;

  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export async function getDashboardMetrics() {
  const last30 = daysAgo(30);
  const last14 = daysAgo(13);
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [
    events30,
    events14,
    allAccounts,
    accounts30,
    savedProgressRows
  ] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: last30 }
      },
      orderBy: { createdAt: "asc" }
    }),
    prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: last14 }
      },
      orderBy: { createdAt: "asc" }
    }),
    prisma.userAccount.findMany({
      orderBy: { createdAt: "desc" },
      take: 200
    }),
    prisma.userAccount.findMany({
      where: {
        createdAt: { gte: last30 }
      },
      orderBy: { createdAt: "asc" }
    }),
    prisma.savedProgress.findMany({
      include: {
        user: true
      }
    })
  ]);

  const pageViews30 = events30.filter((event) => event.eventType === "page_view");
  const challengeViews30 = events30.filter((event) => event.eventType === "challenge_view");
  const challengeStarts30 = events30.filter((event) => event.eventType === "challenge_started");
  const challengeCompletions30 = events30.filter(
    (event) => event.eventType === "challenge_completed"
  );
  const challengeShares30 = events30.filter((event) => event.eventType === "challenge_shared");
  const challengeCtas30 = events30.filter(
    (event) => event.eventType === "challenge_cta_clicked"
  );
  const feedbackSubmissions30 = events30.filter(
    (event) => event.eventType === "feedback_submitted"
  );
  const feedbackFailures30 = events30.filter(
    (event) => event.eventType === "feedback_delivery_failed"
  );
  const activatedPlayers30 = events30.filter(
    (event) => event.eventType === "second_scenario_completed"
  );
  const clientErrors30 = events30.filter((event) =>
    ["client_error", "client_render_error"].includes(event.eventType)
  );
  const serverErrors30 = events30.filter((event) => event.eventType === "server_error");
  const anthropicAttempts30 = events30.filter(
    (event) => event.eventType === "anthropic_evaluation_completed"
  );
  const anthropicFailures30 = events30.filter(
    (event) => event.eventType === "anthropic_evaluation_failed"
  );
  const anthropicAttemptsThisMonth = anthropicAttempts30.filter(
    (event) => event.createdAt >= monthStart
  );
  const anthropicSpendThisMonth = anthropicAttemptsThisMonth.reduce(
    (total, event) => total + metadataNumber(event.metadata, "estimatedCostUsd"),
    0
  );
  const anthropicBudgetUsd = Number(process.env.ANTHROPIC_MONTHLY_BUDGET_USD || 5);
  const uniqueVisitors30 = new Set(
    pageViews30.map((event) => event.anonymousId || event.userId).filter(Boolean)
  ).size;
  const signedInVisitors30 = new Set(pageViews30.map((event) => event.userId).filter(Boolean)).size;
  const challengeViewers30 = uniqueEventActors(challengeViews30);
  const challengeStarters30 = uniqueEventActors(challengeStarts30);
  const challengeCompleters30 = uniqueEventActors(challengeCompletions30);
  const challengeSharers30 = uniqueEventActors(challengeShares30);
  const challengeCtaUsers30 = uniqueEventActors(challengeCtas30);
  const feedbackSubmitters30 = uniqueEventActors(feedbackSubmissions30);
  const activatedPlayerCount30 = uniqueEventActors(activatedPlayers30);

  const progressSummaries = savedProgressRows.map((row) => {
    const progress = asProgressData(row.data);
    const attempts = Array.isArray(progress.attempts) ? progress.attempts : [];

    return {
      email: row.user.email,
      updatedAt: row.updatedAt,
      onboarded: Boolean(progress.onboarded),
      attempts: attempts.length
    };
  });

  const usersWithAttempts = progressSummaries.filter((row) => row.attempts > 0).length;
  const totalSyncedAttempts = progressSummaries.reduce((total, row) => total + row.attempts, 0);
  const onboardedUsers = progressSummaries.filter((row) => row.onboarded).length;
  const activeProgress30 = progressSummaries.filter((row) => row.updatedAt >= last30).length;
  const googleAccounts = allAccounts.filter((account) => Boolean(account.googleId)).length;
  const passwordAccounts = allAccounts.length - googleAccounts;

  const pageCounts = new Map<string, number>();
  for (const event of pageViews30) {
    const path = event.path || "/";
    pageCounts.set(path, (pageCounts.get(path) ?? 0) + 1);
  }

  const topPages = [...pageCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .map(([path, views]) => ({ path, views }));

  const sourceCounts = new Map<string, { source: string; campaign: string; visitors: Set<string> }>();

  for (const event of challengeViews30) {
    const source =
      metadataValue(event.metadata, "source") || referrerHost(event.referrer) || "direct";
    const campaign = metadataValue(event.metadata, "campaign") || "unassigned";
    const key = `${source}::${campaign}`;
    const current = sourceCounts.get(key) ?? {
      source,
      campaign,
      visitors: new Set<string>()
    };
    current.visitors.add(event.userId || event.anonymousId || event.id);
    sourceCounts.set(key, current);
  }

  const topSources = [...sourceCounts.values()]
    .map((entry) => ({
      source: entry.source,
      campaign: entry.campaign,
      visitors: entry.visitors.size
    }))
    .sort((left, right) => right.visitors - left.visitors)
    .slice(0, 8);

  const trendDays = Array.from({ length: 14 }, (_, index) => {
    const date = daysAgo(13 - index);
    return {
      date: dayKey(date),
      visitors: new Set<string>(),
      pageViews: 0,
      accounts: 0
    };
  });
  const trendByDate = new Map(trendDays.map((entry) => [entry.date, entry]));

  for (const event of events14) {
    const entry = trendByDate.get(dayKey(event.createdAt));
    if (!entry || event.eventType !== "page_view") {
      continue;
    }

    entry.pageViews += 1;
    const visitorId = event.anonymousId || event.userId;

    if (visitorId) {
      entry.visitors.add(visitorId);
    }
  }

  for (const account of allAccounts) {
    const entry = trendByDate.get(dayKey(account.createdAt));

    if (entry) {
      entry.accounts += 1;
    }
  }

  const trend = trendDays.map((entry) => ({
    date: entry.date,
    visitors: entry.visitors.size,
    pageViews: entry.pageViews,
    accounts: entry.accounts
  }));

  return {
    generatedAt: new Date().toISOString(),
    cards: {
      uniqueVisitors30,
      pageViews30: pageViews30.length,
      accounts30: accounts30.length,
      totalAccounts: allAccounts.length,
      signupConversion30: percent(accounts30.length, uniqueVisitors30),
      signedInVisitorRate30: percent(signedInVisitors30, uniqueVisitors30),
      onboardedUsers,
      usersWithAttempts,
      totalSyncedAttempts,
      activeProgress30,
      activatedPlayerCount30
    },
    challengeCards: {
      viewers30: challengeViewers30,
      starters30: challengeStarters30,
      completers30: challengeCompleters30,
      sharers30: challengeSharers30,
      ctaUsers30: challengeCtaUsers30,
      visitorToStartRate30: percent(challengeStarters30, uniqueVisitors30),
      startRate30: percent(challengeStarters30, challengeViewers30),
      completionRate30: percent(challengeCompleters30, challengeStarters30),
      shareRate30: percent(challengeSharers30, challengeCompleters30),
      ctaRate30: percent(challengeCtaUsers30, challengeCompleters30)
    },
    feedbackCards: {
      submissions30: feedbackSubmissions30.length,
      submitters30: feedbackSubmitters30,
      deliveryFailures30: feedbackFailures30.length
    },
    operationalCards: {
      clientErrors30: clientErrors30.length,
      serverErrors30: serverErrors30.length,
      anthropicAttemptsThisMonth: anthropicAttemptsThisMonth.length,
      anthropicFailures30: anthropicFailures30.length,
      anthropicSpendThisMonth,
      anthropicBudgetUsd,
      anthropicBudgetUsedPercent: percent(anthropicSpendThisMonth, anthropicBudgetUsd)
    },
    challengeFunnel: [
      { label: "Demo viewers", value: challengeViewers30 },
      { label: "Demo attempts", value: challengeStarters30 },
      { label: "Demo completions", value: challengeCompleters30 },
      { label: "Demo shares", value: challengeSharers30 },
      { label: "Full product clicks", value: challengeCtaUsers30 }
    ],
    funnel: [
      { label: "Unique visitors", value: uniqueVisitors30 },
      { label: "Accounts created", value: accounts30.length },
      { label: "Onboarded profiles", value: onboardedUsers },
      { label: "Users with decisions", value: usersWithAttempts },
      { label: "Activated players (2+)", value: activatedPlayerCount30 }
    ],
    authMix: [
      { label: "Google", value: googleAccounts },
      { label: "Email/password", value: passwordAccounts }
    ],
    topPages,
    topSources,
    trend,
    recentAccounts: allAccounts.slice(0, 10).map((account) => ({
      email: account.email,
      method: account.googleId ? "Google" : "Email/password",
      createdAt: account.createdAt.toISOString()
    })),
    progressSummaries: progressSummaries
      .sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
      .slice(0, 10)
      .map((row) => ({
        ...row,
        updatedAt: row.updatedAt.toISOString()
      }))
  };
}
