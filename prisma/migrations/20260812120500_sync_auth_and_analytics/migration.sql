-- Some existing databases predate analytics and password reset support. These
-- statements are idempotent so the migration is safe for both legacy and fresh schemas.
CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
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

CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE INDEX IF NOT EXISTS "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_eventType_createdAt_idx" ON "AnalyticsEvent"("eventType", "createdAt");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_anonymousId_createdAt_idx" ON "AnalyticsEvent"("anonymousId", "createdAt");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_userId_createdAt_idx" ON "AnalyticsEvent"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'PasswordResetToken_userId_fkey'
    ) THEN
        ALTER TABLE "PasswordResetToken"
        ADD CONSTRAINT "PasswordResetToken_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "UserAccount"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
