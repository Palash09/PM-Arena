import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { authDatabaseErrorResponse } from "@/lib/api-error-response";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/server-auth";

const payloadSchema = z.object({
  progress: z.record(z.unknown())
});

export async function GET() {
  try {
    const account = await getCurrentAccount();

    if (!account) {
      return NextResponse.json({ error: "Log in to sync progress." }, { status: 401 });
    }

    const progress = await prisma.savedProgress.findUnique({
      where: {
        userId: account.id
      }
    });

    return NextResponse.json({ progress: progress?.data ?? null });
  } catch (error) {
    return authDatabaseErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const account = await getCurrentAccount();

    if (!account) {
      return NextResponse.json({ error: "Log in to sync progress." }, { status: 401 });
    }

    const parsed = payloadSchema.safeParse(await request.json().catch(() => null));

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid progress payload." }, { status: 400 });
    }

    const progressData = parsed.data.progress as Prisma.InputJsonObject;

    await prisma.savedProgress.upsert({
      where: {
        userId: account.id
      },
      update: {
        data: progressData
      },
      create: {
        userId: account.id,
        data: progressData
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return authDatabaseErrorResponse(error);
  }
}
