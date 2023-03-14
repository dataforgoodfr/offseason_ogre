-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "userId" INTEGER;

-- Assign user id to existing profiles
DO $$
DECLARE
  player RECORD;
BEGIN
    FOR player IN
        SELECT * FROM "Players" WHERE "profileId" IS NOT NULL
    LOOP
        UPDATE "Profile" SET "userId"=player."userId" WHERE id=player."profileId";
    END LOOP;
END;
$$
LANGUAGE plpgsql;

-- Delete profiles that have no associated user
DELETE FROM "Profile" WHERE "userId" IS NULL;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
