/*
  Warnings:

  - Added the required column `name` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "game" ADD COLUMN     "name" TEXT NOT NULL;
