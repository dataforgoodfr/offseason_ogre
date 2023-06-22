import { Role } from "@prisma/client";
import { database } from "../../../database";

const model = database.role;

export const roleServices = {
  findOne,
};

async function findOne(id: number): Promise<Role | null> {
  return model.findFirst({
    where: {
      id,
    },
  });
}
