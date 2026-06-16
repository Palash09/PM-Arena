import { NextResponse } from "next/server";
import { z } from "zod";

import { authDatabaseErrorResponse } from "@/lib/api-error-response";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword, publicAccount } from "@/lib/server-auth";

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
    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.userAccount.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account already exists for this email. Use Log in instead." },
        { status: 409 }
      );
    }

    const password = hashPassword(parsed.data.password);
    const account = await prisma.userAccount.create({
      data: {
        email,
        passwordHash: password.hash,
        passwordSalt: password.salt
      }
    });

    await createSession(account.id);

    return NextResponse.json({ user: publicAccount(account) });
  } catch (error) {
    return authDatabaseErrorResponse(error);
  }
}
