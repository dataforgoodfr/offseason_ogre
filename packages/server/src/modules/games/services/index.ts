import { prisma } from "../../../database";
import { Game } from "../types";

const model = prisma.game;
type Model = Game;

const crudServices = {
  getDocument,
  getMany,
  create,
  update,
};
const services = { ...crudServices };

export { services };

async function getDocument(id: number): Promise<Model | null> {
  return model.findUnique({ where: { id } });
}

async function getMany(partial: Partial<Model> = {}): Promise<Model[]> {
  return model.findMany({ where: partial, include: { teacher: true } });
}

async function create(document: Omit<Model, "id">): Promise<Model> {
  return model.create({ data: document });
}

async function update(
  id: number,
  document: Omit<Model, "id" | "teacherId">
): Promise<Model> {
  return model.update({ data: document, where: { id } });
}
