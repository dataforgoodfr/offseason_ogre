-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('draft', 'submitted', 'pendingValidation', 'validated');

-- CreateEnum
CREATE TYPE "PersonalizationType" AS ENUM ('form', 'predefinedPersona');

-- CreateEnum
CREATE TYPE "PersonalizationName" AS ENUM ('form', 'oilgre');

-- AlterTable
ALTER TABLE "Players" ADD COLUMN     "profileId" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "personalizationId" INTEGER NOT NULL DEFAULT 0,
    "status" "ProfileStatus" NOT NULL DEFAULT E'draft',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personalization" (
    "id" SERIAL NOT NULL,
    "personalizationType" "PersonalizationType" NOT NULL,
    "personalizationName" "PersonalizationName" NOT NULL,
    "numberAdults" INTEGER NOT NULL,
    "numberKids" INTEGER NOT NULL,
    "car" BOOLEAN NOT NULL,
    "carEnergy" TEXT NOT NULL,
    "carConsumption" DOUBLE PRECISION NOT NULL,
    "carDistanceAlone" DOUBLE PRECISION NOT NULL,
    "carDistanceHoushold" DOUBLE PRECISION NOT NULL,
    "carAge" TEXT NOT NULL,
    "carDistanceCarsharing" DOUBLE PRECISION NOT NULL,
    "planeDistance" DOUBLE PRECISION NOT NULL,
    "trainDistance" DOUBLE PRECISION NOT NULL,
    "houseType" TEXT NOT NULL,
    "houseSurface" DOUBLE PRECISION NOT NULL,
    "heatingEnergy" TEXT NOT NULL,
    "heatingConsumption" DOUBLE PRECISION NOT NULL,
    "heatingInvoice" DOUBLE PRECISION NOT NULL,
    "heatPump" BOOLEAN NOT NULL,
    "heatingTemperature" BOOLEAN NOT NULL,
    "airCondtitionning" BOOLEAN NOT NULL,
    "aCRoomNb" INTEGER NOT NULL,
    "aCDaysNb" DOUBLE PRECISION NOT NULL,
    "showerBath" TEXT NOT NULL,
    "showerNumber" INTEGER NOT NULL,
    "showerTime" TEXT NOT NULL,
    "cookingKettle" BOOLEAN NOT NULL,
    "cookingPlateTime" DOUBLE PRECISION NOT NULL,
    "cookingOvenTime" DOUBLE PRECISION NOT NULL,
    "cleaningWashingTime" DOUBLE PRECISION NOT NULL,
    "cleaningDryerTime" DOUBLE PRECISION NOT NULL,
    "cleaningDishwasherTime" DOUBLE PRECISION NOT NULL,
    "refrigeratorNumber" INTEGER NOT NULL,
    "freezerNumber" INTEGER NOT NULL,
    "lightingSystem" TEXT NOT NULL,
    "eatingVegan" BOOLEAN NOT NULL,
    "eatingVegetables" BOOLEAN NOT NULL,
    "eatingDairies" BOOLEAN NOT NULL,
    "eatingEggs" BOOLEAN NOT NULL,
    "eatingMeat" BOOLEAN NOT NULL,
    "eatingTinDrink" DOUBLE PRECISION NOT NULL,
    "eatingZeroWaste" BOOLEAN NOT NULL,
    "eatingLocal" BOOLEAN NOT NULL,
    "eatingCatNumber" INTEGER NOT NULL,
    "eatingDogNumber" INTEGER NOT NULL,
    "eatingHorse" BOOLEAN NOT NULL,
    "numericEquipment" BOOLEAN NOT NULL,
    "numericWebTimeDay" BOOLEAN NOT NULL,
    "numericVideoTimeDay" BOOLEAN NOT NULL,
    "clothingQuantity" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Personalization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_personalizationId_fkey" FOREIGN KEY ("personalizationId") REFERENCES "Personalization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
