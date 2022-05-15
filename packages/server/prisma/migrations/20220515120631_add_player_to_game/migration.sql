/*
  Warnings:

  - Made the column `description` on table `game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "game" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT E'';

-- CreateTable
CREATE TABLE "_PlayedGames" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PlayedGames_AB_unique" ON "_PlayedGames"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayedGames_B_index" ON "_PlayedGames"("B");

-- AddForeignKey
ALTER TABLE "_PlayedGames" ADD CONSTRAINT "_PlayedGames_A_fkey" FOREIGN KEY ("A") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayedGames" ADD CONSTRAINT "_PlayedGames_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
