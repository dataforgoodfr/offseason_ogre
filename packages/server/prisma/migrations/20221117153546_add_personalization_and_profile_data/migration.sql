/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `Players` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('draft', 'submitted', 'pendingValidation', 'validated');

-- CreateEnum
CREATE TYPE "PersonalizationName" AS ENUM ('form', 'oilgre');

-- AlterTable
ALTER TABLE "Players" ADD COLUMN     "profileId" INTEGER;

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "personalizationId" INTEGER NOT NULL,
    "status" "ProfileStatus" NOT NULL DEFAULT E'draft',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personalization" (
    "id" SERIAL NOT NULL,
    "origin" TEXT NOT NULL,
    "personalizationName" "PersonalizationName" NOT NULL,
    "numberAdults" INTEGER,
    "numberKids" INTEGER,
    "car" BOOLEAN,
    "carEnergy" TEXT DEFAULT E'Essence',
    "carConsumption" DOUBLE PRECISION DEFAULT 0,
    "carDistanceAlone" DOUBLE PRECISION DEFAULT 0,
    "carDistanceHoushold" DOUBLE PRECISION DEFAULT 0,
    "carAge" TEXT DEFAULT E'Entre 10 et 15 ans',
    "carDistanceCarsharing" DOUBLE PRECISION DEFAULT 0,
    "planeDistance" DOUBLE PRECISION,
    "trainDistance" DOUBLE PRECISION,
    "houseType" TEXT,
    "houseSurface" DOUBLE PRECISION,
    "heatingEnergy" TEXT,
    "heatingConsumption" DOUBLE PRECISION,
    "heatingInvoice" DOUBLE PRECISION,
    "heatPump" BOOLEAN DEFAULT false,
    "heatingTemperature" BOOLEAN,
    "airConditionning" BOOLEAN,
    "aCRoomNb" INTEGER DEFAULT 0,
    "aCDaysNb" DOUBLE PRECISION DEFAULT 0,
    "showerBath" TEXT,
    "showerNumber" INTEGER DEFAULT 1,
    "showerTime" TEXT DEFAULT E'5 à 10 minutes',
    "cookingKettle" BOOLEAN,
    "cookingPlateTime" DOUBLE PRECISION,
    "cookingOvenTime" DOUBLE PRECISION,
    "cleaningWashingTime" DOUBLE PRECISION,
    "cleaningDryerTime" DOUBLE PRECISION,
    "cleaningDishwasherTime" DOUBLE PRECISION,
    "refrigeratorNumber" INTEGER,
    "freezerNumber" INTEGER,
    "lightingSystem" TEXT,
    "eatingVegan" BOOLEAN,
    "eatingVegetables" BOOLEAN DEFAULT false,
    "eatingDairies" BOOLEAN DEFAULT false,
    "eatingEggs" BOOLEAN DEFAULT false,
    "eatingMeat" BOOLEAN DEFAULT false,
    "eatingTinDrink" DOUBLE PRECISION,
    "eatingZeroWaste" BOOLEAN,
    "eatingLocal" BOOLEAN,
    "eatingCatNumber" INTEGER,
    "eatingDogNumber" INTEGER,
    "eatingHorse" BOOLEAN,
    "numericEquipment" BOOLEAN,
    "numericWebTimeDay" BOOLEAN,
    "numericVideoTimeDay" BOOLEAN,
    "clothingQuantity" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Personalization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personalization_persona_unique_constraint" ON "Personalization"("origin", "personalizationName");

-- CreateIndex
CREATE UNIQUE INDEX "Players_profileId_key" ON "Players"("profileId");

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_personalizationId_fkey" FOREIGN KEY ("personalizationId") REFERENCES "Personalization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
