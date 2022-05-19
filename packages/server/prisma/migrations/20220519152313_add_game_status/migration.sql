-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('NOT_STARTED', 'STARTED', 'FINISHED');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT E'NOT_STARTED';
