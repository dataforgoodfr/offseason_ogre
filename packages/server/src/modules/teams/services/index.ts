import { Team } from "@prisma/client";
import { database } from "../../../database";

const model = database.team;
type Model = Team;

export { services };

const crudServices = { create, getMany, get, updateScenarioName };

const services = { ...crudServices };

async function create(
  document: Omit<Model, "id" | "scenarioName">
): Promise<Model> {
  return model.create({ data: document });
}

async function getMany(partial: Partial<Model> = {}): Promise<Model[]> {
  return model.findMany({ where: partial });
}

async function get(id: number): Promise<Model | null> {
  return model.findUnique({ where: { id } });
}

async function updateScenarioName(
  teamId: number,
  scenarioName: string
): Promise<Model> {
  return model.update({
    where: { id: teamId },
    data: {
      scenarioName,
    },
  });
}
