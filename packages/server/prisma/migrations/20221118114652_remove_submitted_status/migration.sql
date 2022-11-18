/*
  Warnings:

  - The values [submitted] on the enum `ProfileStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProfileStatus_new" AS ENUM ('draft', 'pendingValidation', 'validated');
ALTER TABLE "Profile" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Profile" ALTER COLUMN "status" TYPE "ProfileStatus_new" USING ("status"::text::"ProfileStatus_new");
ALTER TYPE "ProfileStatus" RENAME TO "ProfileStatus_old";
ALTER TYPE "ProfileStatus_new" RENAME TO "ProfileStatus";
DROP TYPE "ProfileStatus_old";
ALTER TABLE "Profile" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;
