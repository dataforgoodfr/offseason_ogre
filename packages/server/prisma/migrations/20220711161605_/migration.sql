/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `PlayerActions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlayerActions_id_userId_key" ON "PlayerActions"("id", "userId");
