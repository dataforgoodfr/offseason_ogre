import { database } from "../../../database";
import * as teamServices from "../../teams/services";
import { Game } from "../types";
import { register } from "./register";

const model = database.game;
type Model = Game;

const crudServices = {
  getDocument,
  getMany,
  create,
  update,
  launch,
};
const services = { ...crudServices, register };

export { services };

async function getDocument(id: number): Promise<Model | null> {
  return model.findUnique({ where: { id } });
}

async function getMany(partial: Partial<Model> = {}): Promise<Model[]> {
  return model.findMany({ where: partial, include: { teacher: true } });
}

async function create(document: Omit<Model, "id">): Promise<Model> {
  const game = await model.create({ data: document });
  await teamServices.create({ gameId: game.id, name: "Equipe 1" });
  await teamServices.create({ gameId: game.id, name: "Equipe 2" });
  return game;
}

async function update(
  id: number,
  document: Omit<Model, "id" | "teacherId" | "status">
): Promise<Model> {
  return model.update({ data: document, where: { id } });
}

async function launch(
  id: number,
  document: Omit<Model, "id" | "teacherId" | "name" | "date" | "description">
): Promise<Model> {
  return model.update({ data: document, where: { id } });
}
