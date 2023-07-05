import { Prisma } from "@prisma/client";
import { database } from "../../../database";
import { NO_TEAM } from "../../teams/constants/teams";
import { services as teamServices } from "../../teams/services";
import { Game } from "../types";
import { register } from "./register";

const model = database.game;
type Model = Game;

const crudServices = {
  queries: model,
  findOne,
  getMany,
  create,
  update,
};
const services = { ...crudServices, register };

export { services };

async function findOne<
  OptionsInclude extends Parameters<typeof model.findUnique>[0]["include"]
>(
  where: Parameters<typeof model.findUnique>[0]["where"],
  options: {
    include?: OptionsInclude;
  } = {}
): Promise<Prisma.GameGetPayload<{
  include: OptionsInclude;
}> | null> {
  return model.findUnique({
    where,
    ...options,
  }) as any;
}

async function getMany(partial: Partial<Model> = {}): Promise<Model[]> {
  return model.findMany({ where: partial, include: { teacher: true } });
}

async function create(document: Omit<Model, "id">): Promise<Model> {
  const game = await model.create({ data: document });
  await teamServices.create({ gameId: game.id, name: NO_TEAM });
  return game;
}

async function update(id: number, document: Partial<Omit<Model, "id">>) {
  return model.update({
    data: document,
    where: { id },
    include: {
      teams: true,
    },
  });
}
