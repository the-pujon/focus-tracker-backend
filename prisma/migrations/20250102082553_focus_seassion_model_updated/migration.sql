/*
  Warnings:

  - Added the required column `sessionTime` to the `FocusSession` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `breakTime` on the `FocusSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('finished', 'unfinished', 'paused', 'inprogress', 'active');

-- AlterTable
ALTER TABLE "FocusSession" ADD COLUMN     "sessionTime" INTEGER NOT NULL,
ADD COLUMN     "status" "SessionStatus" NOT NULL DEFAULT 'active',
ALTER COLUMN "startTime" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "endTime" DROP NOT NULL,
DROP COLUMN "breakTime",
ADD COLUMN     "breakTime" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FocusSession" ADD CONSTRAINT "FocusSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
