import { Action } from "../types";
import { database } from "../../../database";

const model = database.action;
type Model = Action;

export { getAll, getMany, upsert };

async function getAll(partial: Partial<Model> = {}): Promise<Model[]> {
  return model.findMany({ where: partial });
}

async function getMany(step?: number): Promise<Model[]> {
  const where: { step?: number } = {};
  if (step != null) {
    where.step = step;
  }

  return model.findMany({ where });
}

async function upsert(document: Model): Promise<Model> {
  const entry = await model.upsert({
    where: {
      id: document.id,
    },
    update: document,
    create: document,
  });

  return entry;
}
