interface PasswordResetEmailResult {
  sent: boolean;
  devResetUrl?: string;
}

interface ResendEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  idempotencyKey?: string;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    };

    return entities[character];
  });
}

async function sendResendEmail(email: ResendEmail) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Email delivery is not configured. Add RESEND_API_KEY in Netlify.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "product-decision-league/1.0",
      ...(email.idempotencyKey ? { "Idempotency-Key": email.idempotencyKey } : {})
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Product Decision League <onboarding@resend.dev>",
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(email.replyTo ? { reply_to: email.replyTo } : {})
    })
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    console.error("Resend email request failed.", response.status, details);
    throw new Error("Email delivery failed.");
  }
}

export async function sendPasswordResetEmail({
  email,
  resetUrl
}: {
  email: string;
  resetUrl: string;
}): Promise<PasswordResetEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      return { sent: false, devResetUrl: resetUrl };
    }

    throw new Error("Password reset email is not configured. Add RESEND_API_KEY in Netlify.");
  }

  await sendResendEmail({
    to: email,
    subject: "Reset your Product Decision League password",
    html: [
      "<h1>Reset your Product Decision League password</h1>",
      "<p>Use this secure link to set a new password. It expires in 30 minutes.</p>",
      `<p><a href="${resetUrl}">Reset password</a></p>`,
      "<p>If you did not request this, you can ignore this email.</p>"
    ].join(""),
    text: `Reset your Product Decision League password: ${resetUrl}\n\nThis link expires in 30 minutes.`,
    idempotencyKey: `password-reset/${resetUrl.split("/").pop()}`
  });

  return { sent: true };
}

export async function sendFeedbackEmail({
  email,
  name,
  category,
  rating,
  message,
  path,
  userAgent,
  submissionId
}: {
  email: string;
  name?: string | null;
  category: string;
  rating?: number;
  message: string;
  path?: string;
  userAgent?: string | null;
  submissionId: string;
}) {
  const recipient = process.env.FEEDBACK_TO_EMAIL;

  if (!recipient) {
    throw new Error("Feedback delivery is not configured. Add FEEDBACK_TO_EMAIL in Netlify.");
  }

  const displayName = (name?.trim() || "Product Decision League player")
    .replace(/[\r\n]+/g, " ")
    .slice(0, 80);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const details = [
    `From: ${displayName} <${email}>`,
    `Category: ${category}`,
    `Rating: ${rating ? `${rating}/5` : "Not provided"}`,
    `Page: ${path || "Not provided"}`,
    `Submission: ${submissionId}`,
    `User agent: ${userAgent || "Not provided"}`
  ];

  await sendResendEmail({
    to: recipient,
    replyTo: email,
    subject: `[PDL feedback] ${category} from ${displayName}`,
    html: [
      "<h1>New Product Decision League feedback</h1>",
      `<p><strong>From:</strong> ${escapeHtml(displayName)} &lt;${escapeHtml(email)}&gt;</p>`,
      `<p><strong>Category:</strong> ${escapeHtml(category)}</p>`,
      `<p><strong>Rating:</strong> ${rating ? `${rating}/5` : "Not provided"}</p>`,
      `<div style="margin:24px 0;padding:16px;border-left:4px solid #7cf6c8;background:#f4f8f7">${safeMessage}</div>`,
      `<p><small>Page: ${escapeHtml(path || "Not provided")}<br />Submission: ${submissionId}<br />User agent: ${escapeHtml(userAgent || "Not provided")}</small></p>`
    ].join(""),
    text: `New Product Decision League feedback\n\n${details.join("\n")}\n\n${message}`,
    idempotencyKey: `feedback/${submissionId}`
  });
}
