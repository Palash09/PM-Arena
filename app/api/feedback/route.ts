import { randomUUID } from "node:crypto";

import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { sendFeedbackEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/server-auth";

const feedbackSchema = z.object({
  category: z.enum(["Product feedback", "Scoring feedback", "Bug report", "Feature request"]),
  message: z.string().trim().min(20).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
  path: z.string().trim().max(500).optional()
});

const HOURLY_FEEDBACK_LIMIT = 3;

function analyticsMetadata(data: {
  category: string;
  rating?: number;
  messageLength: number;
  submissionId: string;
}) {
  return data as Prisma.InputJsonObject;
}

export async function POST(request: Request) {
  let account;

  try {
    account = await getCurrentAccount();
  } catch (error) {
    console.error("Feedback account lookup failed.", error);
    return NextResponse.json(
      { error: "Feedback is temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  if (!account) {
    return NextResponse.json({ error: "Log in to send feedback." }, { status: 401 });
  }

  const parsed = feedbackSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Choose a category and enter at least 20 characters." },
      { status: 400 }
    );
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  let recentAttempts;

  try {
    recentAttempts = await prisma.analyticsEvent.count({
      where: {
        userId: account.id,
        eventType: "feedback_delivery_attempted",
        createdAt: { gte: oneHourAgo }
      }
    });
  } catch (error) {
    console.error("Feedback rate limit lookup failed.", error);
    return NextResponse.json(
      { error: "Feedback is temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  if (recentAttempts >= HOURLY_FEEDBACK_LIMIT) {
    return NextResponse.json(
      { error: "You have reached the feedback limit. Try again in an hour." },
      { status: 429 }
    );
  }

  const submissionId = randomUUID();
  const metadata = analyticsMetadata({
    category: parsed.data.category,
    rating: parsed.data.rating,
    messageLength: parsed.data.message.length,
    submissionId
  });

  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType: "feedback_delivery_attempted",
        userId: account.id,
        path: parsed.data.path,
        userAgent: request.headers.get("user-agent"),
        metadata
      }
    });
  } catch (error) {
    console.error("Feedback delivery attempt was not recorded.", error);
    return NextResponse.json(
      { error: "Feedback is temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  try {
    await sendFeedbackEmail({
      email: account.email,
      name: account.name,
      category: parsed.data.category,
      rating: parsed.data.rating,
      message: parsed.data.message,
      path: parsed.data.path,
      userAgent: request.headers.get("user-agent"),
      submissionId
    });

    await prisma.analyticsEvent
      .create({
        data: {
          eventType: "feedback_submitted",
          userId: account.id,
          path: parsed.data.path,
          metadata
        }
      })
      .catch((error) => console.error("Feedback success was not recorded.", error));

    return NextResponse.json({ ok: true, submissionId }, { status: 201 });
  } catch (error) {
    console.error("Feedback email was not delivered.", error);

    await prisma.analyticsEvent
      .create({
        data: {
          eventType: "feedback_delivery_failed",
          userId: account.id,
          path: parsed.data.path,
          metadata
        }
      })
      .catch((analyticsError) =>
        console.error("Feedback delivery failure was not recorded.", analyticsError)
      );

    return NextResponse.json(
      { error: "Feedback could not be delivered right now. Please try again shortly." },
      { status: 503 }
    );
  }
}
