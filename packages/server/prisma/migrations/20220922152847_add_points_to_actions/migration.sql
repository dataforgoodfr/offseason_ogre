-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PointsInterval" (
    "id" SERIAL NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "points" INTEGER NOT NULL,
    "productionActionId" INTEGER,

    CONSTRAINT "PointsInterval_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PointsInterval" ADD CONSTRAINT "PointsInterval_productionActionId_fkey" FOREIGN KEY ("productionActionId") REFERENCES "ProductionAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
