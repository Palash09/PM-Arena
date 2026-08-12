import { prisma } from "@/lib/prisma";

const requiredProductionVariables = [
  "DATABASE_URL",
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_MODEL",
  "RATE_LIMIT_SALT",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXT_PUBLIC_APP_URL"
] as const;

export function getMissingProductionVariables() {
  return requiredProductionVariables.filter((name) => !process.env[name]?.trim());
}

export async function getProductionReadiness() {
  const missingVariables = getMissingProductionVariables();
  let database = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = true;
  } catch {
    database = false;
  }

  return {
    ready: database && missingVariables.length === 0,
    checks: {
      database,
      configuration: missingVariables.length === 0
    },
    missingVariables
  };
}
