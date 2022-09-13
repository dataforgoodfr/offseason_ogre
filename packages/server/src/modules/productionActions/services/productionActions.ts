import { ProductionAction } from "@prisma/client";
import { database } from "../../../database";

const model = database.productionAction;
type Model = ProductionAction;

export { getAll, getMany, getOne, upsert };

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

async function getOne(partial: Partial<Model> = {}): Promise<Model | null> {
  return model.findFirst({ where: partial });
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
