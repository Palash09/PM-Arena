import { NextResponse } from "next/server";
import { z } from "zod";

import { authDatabaseErrorResponse } from "@/lib/api-error-response";
import { prisma } from "@/lib/prisma";
import { createSession, publicAccount, verifyPassword } from "@/lib/server-auth";

const payloadSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and an 8+ character password." }, { status: 400 });
  }

  try {
    const account = await prisma.userAccount.findUnique({
      where: {
        email: parsed.data.email.toLowerCase()
      }
    });

    if (!account) {
      return NextResponse.json(
        { error: "No account exists for this email. Use Sign up first." },
        { status: 401 }
      );
    }

    if (!account.passwordSalt || !account.passwordHash) {
      return NextResponse.json(
        { error: "This account uses Google login. Continue with Google instead." },
        { status: 401 }
      );
    }

    if (!verifyPassword(parsed.data.password, account.passwordSalt, account.passwordHash)) {
      return NextResponse.json(
        { error: "Incorrect password. Check your password and try again." },
        { status: 401 }
      );
    }

    await createSession(account.id);

    return NextResponse.json({ user: publicAccount(account) });
  } catch (error) {
    return authDatabaseErrorResponse(error);
  }
}
