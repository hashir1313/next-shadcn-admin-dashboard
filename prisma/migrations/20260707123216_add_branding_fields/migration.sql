-- AlterTable
ALTER TABLE "User" ADD COLUMN     "brandColor" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
