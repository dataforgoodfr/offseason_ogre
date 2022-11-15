/*
  Warnings:

  - A unique constraint covering the columns `[personalizationType,personalizationName,createdAt]` on the table `Personalization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "personalization_persona_unique_constraint" ON "Personalization"("personalizationType", "personalizationName", "createdAt");
