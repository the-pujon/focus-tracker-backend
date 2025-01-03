-- AlterTable
ALTER TABLE "FocusSession" ADD COLUMN     "pausedTime" TIMESTAMP(3),
ALTER COLUMN "startTime" DROP NOT NULL;
