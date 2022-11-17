/*
  Warnings:

  - You are about to drop the column `personalizationType` on the `Personalization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[origin,personalizationName]` on the table `Personalization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `origin` to the `Personalization` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "personalization_persona_unique_constraint";

-- AlterTable
ALTER TABLE "Personalization" DROP COLUMN "personalizationType",
ADD COLUMN     "origin" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PersonalizationType";

-- CreateIndex
CREATE UNIQUE INDEX "personalization_persona_unique_constraint" ON "Personalization"("origin", "personalizationName");
