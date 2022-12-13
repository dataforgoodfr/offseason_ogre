import { Personalization } from "@prisma/client";
import { database } from "../../../database";

export { update, create, getDefault };

async function update(personalizationId: number, personalization: any) {
  return database.personalization.update({
    where: { id: personalizationId },
    data: personalization,
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

async function create(personalization: any) {
  return database.personalization.create({
    data: personalization,
  });
}
