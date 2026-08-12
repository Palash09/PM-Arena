-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CompanyStage" AS ENUM ('EARLY', 'GROWTH', 'SCALE', 'TURNAROUND');

-- CreateEnum
CREATE TYPE "DecisionType" AS ENUM ('STRATEGY', 'PRIORITIZATION', 'TEAM', 'LAUNCH', 'PRICING', 'GROWTH');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('ROOKIE', 'PRO', 'WORLD_CLASS', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "SkillKey" AS ENUM ('strategy', 'execution', 'leadership', 'growth', 'analytics', 'communication');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "credibilityScore" INTEGER NOT NULL,
    "streak" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "retries" INTEGER NOT NULL,
    "focusAreas" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "passwordSalt" TEXT,
    "googleId" TEXT,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "anonymousId" TEXT,
    "userId" TEXT,
    "path" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillStat" (
    "id" TEXT NOT NULL,
    "key" "SkillKey" NOT NULL,
    "label" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "SkillStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerCard" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "archetype" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "unlocked" BOOLEAN NOT NULL,
    "avatarHue" TEXT NOT NULL,
    "signatureMove" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "sourceFile" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "guest" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "stage" "CompanyStage" NOT NULL,
    "decisionType" "DecisionType" NOT NULL,
    "recommendedSkill" "SkillKey" NOT NULL,
    "shortPitch" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "stakes" TEXT NOT NULL,
    "actualOutcome" TEXT NOT NULL,
    "expertReasoning" TEXT NOT NULL,
    "sourceQuote" TEXT NOT NULL,
    "sourceFile" TEXT NOT NULL,
    "frameworks" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioOption" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "pros" JSONB NOT NULL,
    "tradeoffs" JSONB NOT NULL,
    "frameworkSignals" JSONB NOT NULL,
    "isHistoricalChoice" BOOLEAN NOT NULL DEFAULT false,
    "scenarioId" TEXT NOT NULL,

    CONSTRAINT "ScenarioOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameAttempt" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "choiceAlignment" INTEGER NOT NULL,
    "reasoningAlignment" INTEGER NOT NULL,
    "frameworkCoverage" INTEGER NOT NULL,
    "completeness" INTEGER NOT NULL,
    "verdict" TEXT NOT NULL,
    "delta" JSONB NOT NULL,
    "coaching" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_email_key" ON "UserAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_googleId_key" ON "UserAccount"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_tokenHash_key" ON "AuthSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AuthSession_userId_idx" ON "AuthSession"("userId");

-- CreateIndex
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "SavedProgress_userId_key" ON "SavedProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventType_createdAt_idx" ON "AnalyticsEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_anonymousId_createdAt_idx" ON "AnalyticsEvent"("anonymousId", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_createdAt_idx" ON "AnalyticsEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SkillStat_profileId_key_key" ON "SkillStat"("profileId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCard_slug_key" ON "PlayerCard"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_slug_key" ON "Scenario"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioOption_scenarioId_label_key" ON "ScenarioOption"("scenarioId", "label");

-- CreateIndex
CREATE INDEX "GameAttempt_profileId_createdAt_idx" ON "GameAttempt"("profileId", "createdAt");

-- CreateIndex
CREATE INDEX "GameAttempt_scenarioId_createdAt_idx" ON "GameAttempt"("scenarioId", "createdAt");

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedProgress" ADD CONSTRAINT "SavedProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillStat" ADD CONSTRAINT "SkillStat_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioOption" ADD CONSTRAINT "ScenarioOption_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAttempt" ADD CONSTRAINT "GameAttempt_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAttempt" ADD CONSTRAINT "GameAttempt_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
