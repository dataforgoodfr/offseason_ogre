/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `Players` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Players_profileId_key" ON "Players"("profileId");
