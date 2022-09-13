-- CreateEnum
CREATE TYPE "ProductionActionType" AS ENUM ('terrestrial');

-- CreateEnum
CREATE TYPE "ProductionActionUnit" AS ENUM ('area', 'percentage');

-- CreateTable
CREATE TABLE "ProductionAction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProductionActionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "step" INTEGER NOT NULL,
    "helpCardLink" TEXT NOT NULL,
    "unit" "ProductionActionUnit" NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "credibilityThreshold" DOUBLE PRECISION NOT NULL,
    "areaEnergy" DOUBLE PRECISION,
    "totalEnergy" DOUBLE PRECISION,
    "powerNeededKWh" DOUBLE PRECISION NOT NULL,
    "lcoe" DOUBLE PRECISION NOT NULL,
    "currentYearPowerNeedGw" DOUBLE PRECISION NOT NULL,
    "defaultTeamValue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProductionAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamActions" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "actionId" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "isTouched" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TeamActions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductionAction_name_key" ON "ProductionAction"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamActions_id_teamId_key" ON "TeamActions"("id", "teamId");

-- AddForeignKey
ALTER TABLE "TeamActions" ADD CONSTRAINT "TeamActions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamActions" ADD CONSTRAINT "TeamActions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "ProductionAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
