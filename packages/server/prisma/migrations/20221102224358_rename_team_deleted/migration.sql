/*
  Warnings:

  - You are about to drop the column `showInGame` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "showInGame",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT true;
