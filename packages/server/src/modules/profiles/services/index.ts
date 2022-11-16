import { Profile as ProfilePrisma } from "@prisma/client";
import { database } from "../../../database";
import { Profile } from "../types";

const model = database.profile;
type Model = ProfilePrisma;

export { services };

const crudServices = {
  find,
  create,
  update,
};

const services = { ...crudServices };

async function find(id: number): Promise<Profile | null> {
  return model.findFirst({
    where: {
      id,
    },
    include: {
      personalization: true,
    },
  }) as unknown as Profile;
}

async function create(document: Omit<Model, "id">): Promise<Profile> {
  return model.create({
    data: document,
    include: {
      personalization: true,
    },
  }) as unknown as Profile;
}

async function update(
  id: number,
  document: Partial<Omit<Model, "id">>
): Promise<Profile> {
  return model.update({
    where: {
      id,
    },
    data: document,
    include: {
      personalization: true,
    },
  }) as unknown as Profile;
}
