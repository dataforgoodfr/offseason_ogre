-- CreateTable
CREATE TABLE "PersonaConsumption" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "energieType" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "initialValue" DOUBLE PRECISION NOT NULL,
    "personaName" TEXT NOT NULL,

    CONSTRAINT "PersonaConsumption_pkey" PRIMARY KEY ("id")
);
