-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('admin', 'teacher', 'player');

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" "RoleName" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

INSERT INTO "Role" ("name") VALUES ('admin');
INSERT INTO "Role" ("name") VALUES ('teacher');
INSERT INTO "Role" ("name") VALUES ('player');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roleId" INTEGER;

-- Assign player role to existing users
DO $$
DECLARE
  r RECORD;
  player_role_id INTEGER;
  code text := '';
BEGIN
    player_role_id := (SELECT DISTINCT id FROM "Role" WHERE name='player');
    FOR r IN
        SELECT * FROM "User"
    LOOP
        UPDATE "User" SET "roleId"=player_role_id WHERE id=r.id;
    END LOOP;
END;
$$
LANGUAGE plpgsql;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roleId" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_roleId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
