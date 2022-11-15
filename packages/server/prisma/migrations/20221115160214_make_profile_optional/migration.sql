-- DropForeignKey
ALTER TABLE "Players" DROP CONSTRAINT "Players_profileId_fkey";

-- AlterTable
ALTER TABLE "Players" ALTER COLUMN "profileId" DROP NOT NULL,
ALTER COLUMN "profileId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "personalizationId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
