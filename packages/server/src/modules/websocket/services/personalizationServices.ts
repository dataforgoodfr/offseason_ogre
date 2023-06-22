import { Personalization } from "@prisma/client";
import { database } from "../../../database";

const model = database.personalization;

export const personalizationServices = {
  create,
  update,
};

async function create(data: Parameters<typeof model.create>[0]["data"]) {
  return model.create({
    data,
  });
}

async function update(
  personalizationId: number,
  data: Partial<Omit<Personalization, "id">>
) {
  return model.update({
    where: {
      id: personalizationId,
    },
    data,
  });
}
