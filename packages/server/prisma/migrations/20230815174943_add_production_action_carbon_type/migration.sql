-- CreateEnum
CREATE TYPE "ProductionActionCarbonType" AS ENUM ('carbonated', 'decarbonated');

-- AlterTable
ALTER TABLE "ProductionAction" ADD COLUMN     "carbonType" "ProductionActionCarbonType" NOT NULL DEFAULT E'decarbonated';
