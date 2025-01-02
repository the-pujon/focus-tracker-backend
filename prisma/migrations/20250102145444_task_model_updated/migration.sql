/*
  Warnings:

  - You are about to drop the column `date` on the `Task` table. All the data in the column will be lost.
  - Made the column `dueDate` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "date",
ALTER COLUMN "dueDate" SET NOT NULL;
