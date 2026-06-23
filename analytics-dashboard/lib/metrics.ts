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

export async function getDashboardMetrics() {
  const last30 = daysAgo(30);
  const last14 = daysAgo(13);

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
  const uniqueVisitors30 = new Set(
    pageViews30.map((event) => event.anonymousId || event.userId).filter(Boolean)
  ).size;
  const signedInVisitors30 = new Set(pageViews30.map((event) => event.userId).filter(Boolean)).size;

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
      activeProgress30
    },
    funnel: [
      { label: "Unique visitors", value: uniqueVisitors30 },
      { label: "Accounts created", value: accounts30.length },
      { label: "Onboarded profiles", value: onboardedUsers },
      { label: "Users with decisions", value: usersWithAttempts }
    ],
    authMix: [
      { label: "Google", value: googleAccounts },
      { label: "Email/password", value: passwordAccounts }
    ],
    topPages,
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
