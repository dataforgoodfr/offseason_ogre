import { Role } from "@prisma/client";
import invariant from "tiny-invariant";
import { database } from "../../../database";

const model = database.role;
type Model = Role;

export const rolesServices = {
  getMany,
  getOne,
};

async function getOne(
  where: Parameters<typeof model.findUnique>[0]["where"]
): Promise<Model> {
  const document = await model.findUnique({
    where,
  });

  invariant(document, `Could not get role ${JSON.stringify(where)}`);

  return document;
}

async function getMany(): Promise<Model[]> {
  return model.findMany();
}
