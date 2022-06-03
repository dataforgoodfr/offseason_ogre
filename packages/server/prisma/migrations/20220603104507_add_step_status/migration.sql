-- CreateEnum
CREATE TYPE "StepStatus" AS ENUM ('inProgress', 'closed');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "stepStatus" "StepStatus" NOT NULL DEFAULT E'closed';
