import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/server-auth";

const payloadSchema = z.object({
  eventType: z.string().trim().min(1).max(80),
  anonymousId: z.string().trim().max(120).optional(),
  path: z.string().trim().max(500).optional(),
  referrer: z.string().trim().max(500).optional(),
  metadata: z.record(z.unknown()).optional()
});

export async function POST(request: Request) {
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ ok: true });
  }

  try {
    const account = await getCurrentAccount().catch(() => null);

    await prisma.analyticsEvent.create({
      data: {
        eventType: parsed.data.eventType,
        anonymousId: parsed.data.anonymousId,
        userId: account?.id,
        path: parsed.data.path,
        referrer: parsed.data.referrer,
        userAgent: request.headers.get("user-agent"),
        metadata: parsed.data.metadata as Prisma.InputJsonObject | undefined
      }
    });
  } catch (error) {
    console.error("Analytics event was not recorded.", error);
  }

  return NextResponse.json({ ok: true });
}
