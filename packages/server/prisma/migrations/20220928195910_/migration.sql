-- CreateEnum
CREATE TYPE "Status" AS ENUM ('draft', 'ready', 'finished');

-- CreateEnum
CREATE TYPE "ProductionActionName" AS ENUM ('biomass', 'geothermal', 'hydraulic', 'offshoreWindTurbine', 'onshoreWindTurbine', 'photovoltaicFarm', 'photovoltaicRoof', 'thermalSolar', 'tidal', 'wave', 'nuclear');

-- CreateEnum
CREATE TYPE "ProductionActionType" AS ENUM ('offshore', 'nuclear', 'terrestrial');

-- CreateEnum
CREATE TYPE "ProductionActionUnit" AS ENUM ('area', 'percentage');

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL DEFAULT E'',
    "name" TEXT NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'draft',
    "step" INTEGER NOT NULL DEFAULT 0,
    "lastFinishedStep" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Players" (
    "gameId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "hasFinishedStep" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("userId","gameId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isTeacher" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "scenarioName" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT E'',
    "step" INTEGER NOT NULL,
    "helpCardLink" TEXT NOT NULL DEFAULT E'',
    "actionPointCost" INTEGER NOT NULL,
    "financialCost" DOUBLE PRECISION NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerActions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "actionId" INTEGER NOT NULL,
    "isPerformed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PlayerActions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionAction" (
    "id" SERIAL NOT NULL,
    "name" "ProductionActionName" NOT NULL,
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
    "isPlayable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductionAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointsInterval" (
    "id" SERIAL NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "points" INTEGER NOT NULL,
    "productionActionId" INTEGER,

    CONSTRAINT "PointsInterval_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Team_gameId_name_unique_constraint" ON "Team"("gameId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Action_name_key" ON "Action"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerActions_id_userId_key" ON "PlayerActions"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionAction_name_key" ON "ProductionAction"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamActions_id_teamId_key" ON "TeamActions"("id", "teamId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerActions" ADD CONSTRAINT "PlayerActions_userId_gameId_fkey" FOREIGN KEY ("userId", "gameId") REFERENCES "Players"("userId", "gameId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerActions" ADD CONSTRAINT "PlayerActions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsInterval" ADD CONSTRAINT "PointsInterval_productionActionId_fkey" FOREIGN KEY ("productionActionId") REFERENCES "ProductionAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamActions" ADD CONSTRAINT "TeamActions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamActions" ADD CONSTRAINT "TeamActions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "ProductionAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
