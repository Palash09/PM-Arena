import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authDatabaseErrorResponse } from "@/lib/api-error-response";
import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const RESET_MINUTES = 30;

const payloadSchema = z.object({
  email: z.string().trim().email()
});

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function originFromRequest(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid account email." }, { status: 400 });
  }

  try {
    const email = parsed.data.email.toLowerCase();
    const account = await prisma.userAccount.findUnique({
      where: { email }
    });

    if (!account) {
      return NextResponse.json({
        ok: true,
        message: "If an account exists for this email, a reset link has been sent."
      });
    }

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: account.id,
        usedAt: null
      }
    });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + RESET_MINUTES * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: account.id,
        tokenHash: hashToken(token),
        expiresAt
      }
    });

    const resetUrl = `${originFromRequest(request)}/account/reset?token=${token}`;
    const emailResult = await sendPasswordResetEmail({ email, resetUrl });

    return NextResponse.json({
      ok: true,
      message: "If an account exists for this email, a reset link has been sent.",
      devResetUrl: emailResult.devResetUrl
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Password reset email")
    ) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    return authDatabaseErrorResponse(error);
  }
}
