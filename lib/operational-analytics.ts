import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface OperationalEventInput {
  eventType: string;
  path?: string;
  userId?: string;
  anonymousId?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

export async function recordOperationalEvent({
  eventType,
  path,
  userId,
  anonymousId,
  metadata
}: OperationalEventInput) {
  try {
    const safeMetadata = metadata
      ? Object.fromEntries(Object.entries(metadata).filter(([, value]) => value !== undefined))
      : undefined;

    await prisma.analyticsEvent.create({
      data: {
        eventType,
        path,
        userId,
        anonymousId,
        metadata: safeMetadata as Prisma.InputJsonObject | undefined
      }
    });
  } catch (error) {
    console.error("Operational event was not recorded.", error);
  }
}
