import { Action } from "../types";
import { database } from "../../../database";

const model = database.action;
type Model = Action;

export { getAll, getMany };

async function getAll(partial: Partial<Model> = {}): Promise<Model[]> {
  return model.findMany({ where: partial });
}

async function getMany(step: number): Promise<Model[]> {
  return model.findMany({ where: { step } });
}
