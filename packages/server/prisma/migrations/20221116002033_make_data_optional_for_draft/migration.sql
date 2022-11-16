-- AlterTable
ALTER TABLE "Personalization" ALTER COLUMN "numberAdults" DROP NOT NULL,
ALTER COLUMN "numberKids" DROP NOT NULL,
ALTER COLUMN "car" DROP NOT NULL,
ALTER COLUMN "carEnergy" DROP NOT NULL,
ALTER COLUMN "carEnergy" SET DEFAULT E'Essence',
ALTER COLUMN "carConsumption" DROP NOT NULL,
ALTER COLUMN "carConsumption" SET DEFAULT 0,
ALTER COLUMN "carDistanceAlone" DROP NOT NULL,
ALTER COLUMN "carDistanceAlone" SET DEFAULT 0,
ALTER COLUMN "carDistanceHoushold" DROP NOT NULL,
ALTER COLUMN "carDistanceHoushold" SET DEFAULT 0,
ALTER COLUMN "carAge" DROP NOT NULL,
ALTER COLUMN "carAge" SET DEFAULT E'Entre 10 et 15 ans',
ALTER COLUMN "carDistanceCarsharing" DROP NOT NULL,
ALTER COLUMN "carDistanceCarsharing" SET DEFAULT 0,
ALTER COLUMN "planeDistance" DROP NOT NULL,
ALTER COLUMN "trainDistance" DROP NOT NULL,
ALTER COLUMN "houseType" DROP NOT NULL,
ALTER COLUMN "houseSurface" DROP NOT NULL,
ALTER COLUMN "heatingEnergy" DROP NOT NULL,
ALTER COLUMN "heatingConsumption" DROP NOT NULL,
ALTER COLUMN "heatingInvoice" DROP NOT NULL,
ALTER COLUMN "heatPump" DROP NOT NULL,
ALTER COLUMN "heatPump" SET DEFAULT false,
ALTER COLUMN "heatingTemperature" DROP NOT NULL,
ALTER COLUMN "aCRoomNb" DROP NOT NULL,
ALTER COLUMN "aCRoomNb" SET DEFAULT 0,
ALTER COLUMN "aCDaysNb" DROP NOT NULL,
ALTER COLUMN "aCDaysNb" SET DEFAULT 0,
ALTER COLUMN "showerBath" DROP NOT NULL,
ALTER COLUMN "showerNumber" DROP NOT NULL,
ALTER COLUMN "showerNumber" SET DEFAULT 1,
ALTER COLUMN "showerTime" DROP NOT NULL,
ALTER COLUMN "showerTime" SET DEFAULT E'5 à 10 minutes',
ALTER COLUMN "cookingKettle" DROP NOT NULL,
ALTER COLUMN "cookingPlateTime" DROP NOT NULL,
ALTER COLUMN "cookingOvenTime" DROP NOT NULL,
ALTER COLUMN "cleaningWashingTime" DROP NOT NULL,
ALTER COLUMN "cleaningDryerTime" DROP NOT NULL,
ALTER COLUMN "cleaningDishwasherTime" DROP NOT NULL,
ALTER COLUMN "refrigeratorNumber" DROP NOT NULL,
ALTER COLUMN "freezerNumber" DROP NOT NULL,
ALTER COLUMN "lightingSystem" DROP NOT NULL,
ALTER COLUMN "eatingVegan" DROP NOT NULL,
ALTER COLUMN "eatingVegetables" DROP NOT NULL,
ALTER COLUMN "eatingVegetables" SET DEFAULT false,
ALTER COLUMN "eatingDairies" DROP NOT NULL,
ALTER COLUMN "eatingDairies" SET DEFAULT false,
ALTER COLUMN "eatingEggs" DROP NOT NULL,
ALTER COLUMN "eatingEggs" SET DEFAULT false,
ALTER COLUMN "eatingMeat" DROP NOT NULL,
ALTER COLUMN "eatingMeat" SET DEFAULT false,
ALTER COLUMN "eatingTinDrink" DROP NOT NULL,
ALTER COLUMN "eatingZeroWaste" DROP NOT NULL,
ALTER COLUMN "eatingLocal" DROP NOT NULL,
ALTER COLUMN "eatingCatNumber" DROP NOT NULL,
ALTER COLUMN "eatingDogNumber" DROP NOT NULL,
ALTER COLUMN "eatingHorse" DROP NOT NULL,
ALTER COLUMN "numericEquipment" DROP NOT NULL,
ALTER COLUMN "numericWebTimeDay" DROP NOT NULL,
ALTER COLUMN "numericVideoTimeDay" DROP NOT NULL,
ALTER COLUMN "clothingQuantity" DROP NOT NULL,
ALTER COLUMN "airConditionning" DROP NOT NULL;