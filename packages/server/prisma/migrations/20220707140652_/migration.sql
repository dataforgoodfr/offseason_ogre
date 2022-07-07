-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "actionPointCost" INTEGER NOT NULL,
    "financialCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerActions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "actionId" INTEGER NOT NULL,

    CONSTRAINT "PlayerActions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Action_name_key" ON "Action"("name");

-- AddForeignKey
ALTER TABLE "PlayerActions" ADD CONSTRAINT "PlayerActions_userId_gameId_fkey" FOREIGN KEY ("userId", "gameId") REFERENCES "Players"("userId", "gameId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerActions" ADD CONSTRAINT "PlayerActions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
