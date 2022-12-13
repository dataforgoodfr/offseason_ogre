import { Team } from "@prisma/client";
import { range } from "lodash";
import { database } from "../../../database";
import { NO_TEAM } from "../constants/teams";

const model = database.team;
type Model = Team;

export { services };

const crudServices = { create, getMany, get, update, createMany };

const services = { ...crudServices };

async function create(
  document: Omit<Model, "id" | "scenarioName" | "isDeleted">
): Promise<Model> {
  return model.create({ data: document });
}

async function createMany(gameId: number, quantity: number) {
  const teams = (await model.findMany({ where: { gameId } })).filter(
    (team: Model) => team.name !== NO_TEAM
  );
  // eslint-disable-next-line no-restricted-syntax
  for await (const index of range(1, quantity + 1)) {
    await model.create({
      data: { gameId, name: `Equipe ${teams.length + index}` },
    });
  }
}

async function getMany(partial: Partial<Model> = {}): Promise<Model[]> {
  return model.findMany({ where: { ...partial, isDeleted: false } });
}

async function get(id: number): Promise<Model | null> {
  return model.findUnique({ where: { id } });
}

async function update(
  teamId: number,
  document: Partial<Omit<Model, "id">>
): Promise<Model> {
  return model.update({
    where: { id: teamId },
    data: document,
  });
}
