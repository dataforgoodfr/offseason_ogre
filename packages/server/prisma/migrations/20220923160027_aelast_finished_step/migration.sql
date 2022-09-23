/*
  Warnings:

  - You are about to drop the column `isStepActive` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "isStepActive",
ADD COLUMN     "lastFinishedStep" INTEGER NOT NULL DEFAULT 0;
