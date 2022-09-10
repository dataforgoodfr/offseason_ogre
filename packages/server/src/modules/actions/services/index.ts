import { Action } from "../types";
import { database } from "../../../database";

const model = database.action;
type Model = Action;

export { getAll, getMany, updateOrCreate };

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

async function updateOrCreate(document: Model): Promise<Model> {
  let entry: Model | null = null;
  if (document.id) {
    entry = await model.findFirst({ where: { id: document.id } });
  }

  const entryFound = !!entry;
  entry = entry != null ? { ...entry, ...document } : (document as Model);

  if (entryFound) {
    entry = await model.update({ where: { id: entry.id }, data: entry });
  } else {
    entry = await model.create({ data: entry });
  }

  return entry;
}
