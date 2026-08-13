-- Legacy databases were baselined before Google account profile fields were
-- added to UserAccount. Bring them in line with the current Prisma schema.
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "googleId" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "UserAccount" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
ALTER TABLE "UserAccount" ALTER COLUMN "passwordHash" DROP NOT NULL;
ALTER TABLE "UserAccount" ALTER COLUMN "passwordSalt" DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "UserAccount_googleId_key" ON "UserAccount"("googleId");
