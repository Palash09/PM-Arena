interface PasswordResetEmailResult {
  sent: boolean;
  devResetUrl?: string;
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

  const from = process.env.EMAIL_FROM || "Product Arena <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Reset your Product Arena password",
      html: [
        "<h1>Reset your Product Arena password</h1>",
        "<p>Use this secure link to set a new password. It expires in 30 minutes.</p>",
        `<p><a href="${resetUrl}">Reset password</a></p>`,
        "<p>If you did not request this, you can ignore this email.</p>"
      ].join("")
    })
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Password reset email failed to send. ${details}`);
  }

  return { sent: true };
}
