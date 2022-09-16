-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductionActionType" ADD VALUE 'offshore';
ALTER TYPE "ProductionActionType" ADD VALUE 'nuclear';

-- AlterTable
ALTER TABLE "ProductionAction" ADD COLUMN     "isPlayable" BOOLEAN NOT NULL DEFAULT false;
