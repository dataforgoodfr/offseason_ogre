import { Role, User } from "@prisma/client";
import invariant from "tiny-invariant";
import { database } from "..";
import { Seeder } from "../types";

export { seed };

const seed: Seeder<Omit<User, "id">> = async () => {
  const [adminRole, playerRole] = await Promise.all([
    database.role.findUnique({ where: { name: "admin" } }),
    database.role.findUnique({ where: { name: "player" } }),
  ]);

  invariant(
    adminRole,
    `Cannot seed users because admin role is missing in database`
  );
  invariant(
    playerRole,
    `Cannot seed users because player role is missing in database`
  );

  return {
    seeder: (user: Omit<User, "id">) =>
      database.user.upsert({
        where: {
          email: user.email,
        },
        update: user,
        create: user,
      }),
    data: getUsersData({ adminRole, playerRole }),
  };
};

function getUsersData({
  adminRole,
  playerRole,
}: {
  adminRole: Role;
  playerRole: Role;
}) {
  const users: Omit<User, "id">[] = [
    {
      email: "seeding@database.com",
      isTeacher: false,
      firstName: "Seeding",
      lastName: "Master",
      country: "FR",
      roleId: adminRole.id,
    },
    {
      email: "ogre@yopmail.com",
      isTeacher: true,
      firstName: "Og",
      lastName: "Re",
      country: "FR",
      roleId: playerRole.id,
    },
    {
      email: "chareyronlaurene@gmail.com",
      isTeacher: true,
      firstName: "Laurène",
      lastName: "Chareyron",
      country: "FR",
      roleId: adminRole.id,
    },
    {
      email: "b00461284@essec.edu",
      isTeacher: true,
      firstName: "Vladimir",
      lastName: "Nafissi",
      country: "FR",
      roleId: adminRole.id,
    },
    {
      email: "dbsharp404@gmail.com",
      isTeacher: true,
      firstName: "Ba",
      lastName: "Boo",
      country: "FR",
      roleId: adminRole.id,
    },
    {
      email: "dorian.erkens@gmail.com",
      isTeacher: true,
      firstName: "Dorian",
      lastName: "Erkens",
      country: "FR",
      roleId: adminRole.id,
    },
    {
      email: "grandeur.energies@gmail.com",
      isTeacher: true,
      firstName: "Gregory",
      lastName: "Kotnarovsky",
      country: "FR",
      roleId: adminRole.id,
    },
    {
      email: "guilhem.valentin@insidegroup.fr",
      isTeacher: true,
      firstName: "Guilhem",
      lastName: "Valentin",
      country: "FR",
      roleId: adminRole.id,
    },
    {
      email: "kotnarovsky@googlemail.com",
      isTeacher: true,
      firstName: "Gregory",
      lastName: "Kotnarovsky",
      country: "FR",
      roleId: adminRole.id,
    },
    {
      email: "louis.sanna@gmail.com",
      isTeacher: true,
      firstName: "Louis",
      lastName: "Sanna",
      country: "FR",
      roleId: adminRole.id,
    },
    {
      email: "remi.riviere.free@gmail.com",
      isTeacher: true,
      firstName: "Rémi",
      lastName: "Rivière",
      country: "FR",
      roleId: adminRole.id,
    },
    {
      email: "tcateland@gmail.com",
      isTeacher: true,
      firstName: "Thomas",
      lastName: "Cateland",
      country: "FR",
      roleId: adminRole.id,
    },
    {
      email: "william_haidar@hotmail.fr",
      isTeacher: true,
      firstName: "William",
      lastName: "Haidar",
      country: "FR",
      roleId: adminRole.id,
    },
  ];

  return users;
}
