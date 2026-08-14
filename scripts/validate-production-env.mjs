const isProductionDeploy = process.env.CONTEXT === "production";

if (!isProductionDeploy) {
  console.log("Skipping strict production environment validation outside Netlify production.");
  process.exit(0);
}

const required = [
  "DATABASE_URL",
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_MODEL",
  "ANTHROPIC_INPUT_COST_PER_MILLION_USD",
  "ANTHROPIC_OUTPUT_COST_PER_MILLION_USD",
  "ANTHROPIC_MONTHLY_BUDGET_USD",
  "RATE_LIMIT_SALT",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "FEEDBACK_TO_EMAIL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXT_PUBLIC_APP_URL"
];
const missing = required.filter((name) => !process.env[name]?.trim());
const errors = [];

if (missing.length) {
  errors.push(`Missing environment variables: ${missing.join(", ")}`);
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

if (appUrl) {
  try {
    const parsed = new URL(appUrl);

    if (parsed.protocol !== "https:") {
      errors.push("NEXT_PUBLIC_APP_URL must use HTTPS in production.");
    }

    if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
      errors.push("NEXT_PUBLIC_APP_URL must be an origin only, without a path, query, or hash.");
    }
  } catch {
    errors.push("NEXT_PUBLIC_APP_URL must be a valid absolute URL.");
  }
}

if (errors.length) {
  console.error("Production environment validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Production environment validation passed.");
