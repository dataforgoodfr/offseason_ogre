/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `UsersOnGames` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `UsersOnGames` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsersOnGames" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy";
