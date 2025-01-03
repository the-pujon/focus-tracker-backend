/*
  Warnings:

  - The `pausedTime` column on the `FocusSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FocusSession" DROP COLUMN "pausedTime",
ADD COLUMN     "pausedTime" INTEGER;
