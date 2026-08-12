import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/server-auth";

const DEFAULT_HOURLY_LIMIT = 3;
const DEFAULT_DAILY_LIMIT = 10;
const DEFAULT_MONTHLY_LIMIT = 200;

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function startOfUtcHour(date: Date) {
  const start = new Date(date);
  start.setUTCMinutes(0, 0, 0);
  return start;
}

function startOfUtcDay(date: Date) {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

function startOfUtcMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function requestFingerprint(request: Request, anonymousId?: string) {
  const clientIp =
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const salt = process.env.RATE_LIMIT_SALT ?? "local-development";

  return createHash("sha256")
    .update(`${salt}:${clientIp}:${anonymousId ?? "anonymous"}:${userAgent}`)
    .digest("hex")
    .slice(0, 32);
}

async function reserveWindow(
  transaction: Prisma.TransactionClient,
  key: string,
  limit: number,
  expiresAt: Date
) {
  const rows = await transaction.$queryRaw<Array<{ count: number }>>`
    INSERT INTO "AiUsageWindow" ("key", "count", "expiresAt", "createdAt", "updatedAt")
    VALUES (${key}, 1, ${expiresAt}, NOW(), NOW())
    ON CONFLICT ("key") DO UPDATE
    SET "count" = "AiUsageWindow"."count" + 1,
        "updatedAt" = NOW()
    WHERE "AiUsageWindow"."count" < ${limit}
    RETURNING "count"
  `;

  return rows.length === 1;
}

class UsageLimitReached extends Error {}

export async function reserveAnthropicEvaluation(request: Request, anonymousId?: string) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return false;
  }

  try {
    const account = await getCurrentAccount().catch(() => null);
    const clientKey = account?.id ?? requestFingerprint(request, anonymousId);
    const now = new Date();
    const hourStart = startOfUtcHour(now);
    const dayStart = startOfUtcDay(now);
    const monthStart = startOfUtcMonth(now);
    const hourlyLimit = positiveInteger(
      process.env.AI_EVALUATION_HOURLY_LIMIT,
      DEFAULT_HOURLY_LIMIT
    );
    const dailyLimit = positiveInteger(
      process.env.AI_EVALUATION_DAILY_LIMIT,
      DEFAULT_DAILY_LIMIT
    );
    const monthlyLimit = positiveInteger(
      process.env.AI_EVALUATION_MONTHLY_LIMIT,
      DEFAULT_MONTHLY_LIMIT
    );

    await prisma.$transaction(async (transaction) => {
      await transaction.aiUsageWindow.deleteMany({
        where: {
          expiresAt: { lt: now }
        }
      });

      const clientReserved = await reserveWindow(
        transaction,
        `client:${clientKey}:${hourStart.toISOString()}`,
        hourlyLimit,
        addHours(hourStart, 2)
      );

      if (!clientReserved) {
        throw new UsageLimitReached();
      }

      const globalReserved = await reserveWindow(
        transaction,
        `global:${dayStart.toISOString()}`,
        dailyLimit,
        addHours(dayStart, 48)
      );

      if (!globalReserved) {
        throw new UsageLimitReached();
      }

      const monthlyReserved = await reserveWindow(
        transaction,
        `monthly:${monthStart.toISOString()}`,
        monthlyLimit,
        addHours(monthStart, 24 * 40)
      );

      if (!monthlyReserved) {
        throw new UsageLimitReached();
      }
    });

    return true;
  } catch (error) {
    if (!(error instanceof UsageLimitReached)) {
      console.error("AI usage allowance could not be reserved; using fallback scoring.", error);
    }

    return false;
  }
}
