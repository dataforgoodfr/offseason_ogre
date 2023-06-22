import { Profile } from "@prisma/client";
import { database } from "../../../database";

const model = database.profile;

export const profileServices = {
  create,
  findOne,
  update,
};

async function findOne(id: number): Promise<Profile | null> {
  return model.findFirst({
    where: {
      id,
    },
  });
}

async function create(data: Omit<Profile, "id">): Promise<Profile> {
  return model.create({
    data,
  });
}

async function update(
  id: number,
  data: Partial<Omit<Profile, "id">>
): Promise<Profile> {
  return model.update({
    where: {
      id,
    },
    data,
  });
}
