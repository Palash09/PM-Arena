import { spawnSync } from "node:child_process";
import { Prisma, PrismaClient } from "@prisma/client";

const baselineMigration = "20260812120000_initial_production_schema";
const baselineTables = [
  "AnalyticsEvent",
  "AuthSession",
  "GameAttempt",
  "PasswordResetToken",
  "PlayerCard",
  "SavedProgress",
  "Scenario",
  "ScenarioOption",
  "SkillStat",
  "UserAccount",
  "UserProfile"
];

const prisma = new PrismaClient();

try {
  const tables = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN (${Prisma.join(baselineTables)})
  `;
  const existingTables = new Set(tables.map(({ table_name: tableName }) => tableName));

  if (existingTables.size === 0) {
    console.log("Production database is empty; Prisma will apply the initial migration.");
    process.exitCode = 0;
  } else if (existingTables.size !== baselineTables.length) {
    const missing = baselineTables.filter((table) => !existingTables.has(table));
    throw new Error(
      `Refusing to baseline a partial production schema. Missing tables: ${missing.join(", ")}`
    );
  } else {
    const result = spawnSync(
      "node_modules/.bin/prisma",
      ["migrate", "resolve", "--applied", baselineMigration],
      { encoding: "utf8", stdio: "pipe" }
    );
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;

    if (result.status === 0) {
      console.log(`Baselined existing production schema as ${baselineMigration}.`);
    } else if (output.includes("P3008")) {
      console.log(`Production schema baseline ${baselineMigration} is already recorded.`);
    } else {
      throw new Error(`Could not baseline the production schema:\n${output.trim()}`);
    }
  }
} finally {
  await prisma.$disconnect();
}
