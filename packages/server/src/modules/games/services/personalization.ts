import { Personalization } from "@prisma/client";
import { database } from "../../../database";

export { update, create, getDefault };

async function update(profileId: number, profile: any) {
  return database.personalization.update({
    where: { id: profileId },
    data: profile,
  });
}

async function getDefault(): Promise<Personalization> {
  return database.personalization.findUnique({
    where: {
      origin_personalizationName: {
        origin: "system",
        personalizationName: "oilgre",
      },
    },
  }) as unknown as Personalization;
}

async function create(profile: any) {
  return database.personalization.create({
    data: profile,
  });
}
