/*
  Warnings:

  - You are about to drop the column `airCondtitionning` on the `Personalization` table. All the data in the column will be lost.
  - Added the required column `airConditionning` to the `Personalization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Personalization" DROP COLUMN "airCondtitionning",
ADD COLUMN     "airConditionning" BOOLEAN NOT NULL;
