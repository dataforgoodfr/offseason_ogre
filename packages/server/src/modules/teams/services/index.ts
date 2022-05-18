import { Team } from "@prisma/client";
import { database } from "../../../database";

const model = database.team;
type Model = Team;

export { create };

async function create(document: Omit<Model, "id">): Promise<Model> {
  return model.create({ data: document });
}
