import { User } from "@prisma/client";
import { database } from "..";
import { Seed } from "../types";

export { seed };

const seed: Seed<Omit<User, "id">> = {
  seeder: (user: Omit<User, "id">) =>
    database.user.upsert({
      where: {
        email: user.email,
      },
      update: user,
      create: user,
    }),
  data: getUsersData(),
};

function getUsersData(): Omit<User, "id">[] {
  const users = [
    {
      email: "seeding@database.com",
      isTeacher: false,
      firstName: "Seeding",
      lastName: "Master",
      country: "FR",
    },
    {
      email: "ogre@yopmail.com",
      isTeacher: true,
      firstName: "Og",
      lastName: "Re",
      country: "FR",
    },
    {
      email: "chareyronlaurene@gmail.com",
      isTeacher: true,
      firstName: "Laurène",
      lastName: "Chareyron",
      country: "FR",
    },
    {
      email: "b00461284@essec.edu",
      isTeacher: true,
      firstName: "Vladimir",
      lastName: "Nafissi",
      country: "FR",
    },
    {
      email: "dbsharp404@gmail.com",
      isTeacher: true,
      firstName: "Ba",
      lastName: "Boo",
      country: "FR",
    },
    {
      email: "dorian.erkens@gmail.com",
      isTeacher: true,
      firstName: "Dorian",
      lastName: "Erkens",
      country: "FR",
    },
    {
      email: "grandeur.energies@gmail.com",
      isTeacher: true,
      firstName: "Gregory",
      lastName: "Kotnarovsky",
      country: "FR",
    },
    {
      email: "guilhem.valentin@insidegroup.fr",
      isTeacher: true,
      firstName: "Guilhem",
      lastName: "Valentin",
      country: "FR",
    },
    {
      email: "kotnarovsky@googlemail.com",
      isTeacher: true,
      firstName: "Gregory",
      lastName: "Kotnarovsky",
      country: "FR",
    },
    {
      email: "louissanna@gmail.com",
      isTeacher: true,
      firstName: "Louis",
      lastName: "Sanna",
      country: "FR",
    },
    {
      email: "remi.riviere.free@gmail.com",
      isTeacher: true,
      firstName: "Rémi",
      lastName: "Rivière",
      country: "FR",
    },
    {
      email: "tcateland@gmail.com",
      isTeacher: true,
      firstName: "Thomas",
      lastName: "Cateland",
      country: "FR",
    },
    {
      email: "william_haidar@hotmail.fr",
      isTeacher: true,
      firstName: "William",
      lastName: "Haidar",
      country: "FR",
    },
  ];

  return users;
}
