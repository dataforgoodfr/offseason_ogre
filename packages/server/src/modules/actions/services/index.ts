import { Action } from "../types";
import { database } from "../../../database";

const model = database.action;
type Model = Action;

export { getMany };

async function getMany(partial: Partial<Model> = {}): Promise<Model[]> {
  return model.findMany({ where: partial });
}