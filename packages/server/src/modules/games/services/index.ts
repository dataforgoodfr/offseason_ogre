import { database } from "../../../database";
import * as teamServices from "../../teams/services";
import { Game } from "../types";
import { initState } from "./initState";
import { register } from "./register";

const model = database.game;
type Model = Game;

const crudServices = {
  getDocument,
  getMany,
  create,
  update,
};
const services = { ...crudServices, initState, register };

export { services };

async function getDocument(id: number): Promise<Model | null> {
  return model.findUnique({
    where: { id },
    include: {
      teams: {
        include: {
          players: {
            include: {
              user: true,
              actions: {
                include: {
                  action: true,
                },
              },
            },
          },
          actions: {
            include: {
              action: true,
            },
          },
        },
      },
    },
  });
}

async function getMany(partial: Partial<Model> = {}): Promise<Model[]> {
  return model.findMany({ where: partial, include: { teacher: true } });
}

async function create(document: Omit<Model, "id">): Promise<Model> {
  const game = await model.create({ data: document });
  await teamServices.create({ gameId: game.id, name: "Equipe 1" });
  await teamServices.create({ gameId: game.id, name: "Equipe 2" });
  await teamServices.create({ gameId: game.id, name: "Equipe 3" });
  await teamServices.create({ gameId: game.id, name: "Equipe 4" });
  await teamServices.create({ gameId: game.id, name: "Equipe 5" });
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
