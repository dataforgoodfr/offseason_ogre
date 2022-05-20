/*
  Warnings:

  - The `status` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "GameStatus";
