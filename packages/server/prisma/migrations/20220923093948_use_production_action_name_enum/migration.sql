/*
  Warnings:

  - Changed the type of `name` on the `ProductionAction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductionActionName" AS ENUM ('biomass', 'geothermal', 'hydraulic', 'offshoreWindTurbine', 'onshoreWindTurbine', 'photovoltaicFarm', 'photovoltaicRoof', 'thermalSolar', 'tidal', 'wave', 'nuclear');

-- AlterTable
ALTER TABLE "ProductionAction" DROP COLUMN "name",
ADD COLUMN     "name" "ProductionActionName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductionAction_name_key" ON "ProductionAction"("name");
