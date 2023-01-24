import { Role } from "@prisma/client";
import { database } from "..";
import { Seeder } from "../types";

export { seed };

type SeedData = Omit<Role, "id">;

const seed: Seeder<SeedData> = {
  seeder: (role) =>
    database.role.upsert({
      where: {
        name: role.name,
      },
      update: role,
      create: role,
    }),
  data: getRolesData(),
};

function getRolesData() {
  const roles: SeedData[] = [
    {
      name: "admin",
    },
    {
      name: "teacher",
    },
    {
      name: "player",
    },
  ];

  return roles;
}
