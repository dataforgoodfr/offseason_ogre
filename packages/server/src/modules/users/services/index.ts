import { prisma } from "../../../database";
import { User } from "../types/entity";

const model = prisma.user;
type Model = User;

const crudServices = { getDocument, create, findEmail };
const services = { ...crudServices };

export { services };

async function getDocument(id: number): Promise<Model | null> {
  return model.findUnique({ where: { id } });
}

async function create(document: Omit<Model, "id">): Promise<Model> {
  return model.create({ data: document });
}

async function findEmail(email: string): Promise<Model | null> {
  return model.findUnique({ where: { email } });
}
