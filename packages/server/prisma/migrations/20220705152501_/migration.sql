/*
  Warnings:

  - You are about to drop the column `category` on the `Action` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "category",
ALTER COLUMN "cost" SET DATA TYPE DOUBLE PRECISION;
