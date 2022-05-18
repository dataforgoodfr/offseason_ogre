import { Team } from "@prisma/client";
import { database } from "../../../database";

const model = database.team;
type Model = Team;

export { create, getMany };

async function create(document: Omit<Model, "id">): Promise<Model> {
  return model.create({ data: document });
}

async function getMany(partial: Partial<Model> = {}): Promise<Model[]> {
  return model.findMany({ where: partial });
}
