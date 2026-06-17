import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authDatabaseErrorResponse } from "@/lib/api-error-response";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword, publicAccount } from "@/lib/server-auth";

const payloadSchema = z.object({
  token: z.string().min(32),
  password: z.string().min(8)
});

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Use a valid reset link and enter an 8+ character password." },
      { status: 400 }
    );
  }

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash: hashToken(parsed.data.token)
      },
      include: {
        user: true
      }
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
      return NextResponse.json(
        { error: "This reset link is invalid or expired. Request a new password reset link." },
        { status: 400 }
      );
    }

    const password = hashPassword(parsed.data.password);

    await prisma.$transaction([
      prisma.userAccount.update({
        where: { id: resetToken.userId },
        data: {
          passwordHash: password.hash,
          passwordSalt: password.salt
        }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: {
          usedAt: new Date()
        }
      }),
      prisma.authSession.deleteMany({
        where: {
          userId: resetToken.userId
        }
      })
    ]);

    await createSession(resetToken.userId);

    return NextResponse.json({ user: publicAccount(resetToken.user) });
  } catch (error) {
    return authDatabaseErrorResponse(error);
  }
}
