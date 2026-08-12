-- CreateTable
CREATE TABLE "AiUsageWindow" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiUsageWindow_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "AiUsageWindow_expiresAt_idx" ON "AiUsageWindow"("expiresAt");
