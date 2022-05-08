import { prisma } from "../../../database";
import { User } from "../types/entity";
import { sendMagicLink } from "./sendMagicLink";

const model = prisma.user;
type Model = User;

const crudServices = {
  getDocument,
  create,
};
const services = { ...crudServices, isMailAlreadyUsed, sendMagicLink };

export { services };

async function getDocument(id: number): Promise<Model | null> {
  return model.findUnique({ where: { id } });
}

async function create(document: Omit<Model, "id">): Promise<Model> {
  return model.create({ data: document });
}

async function isMailAlreadyUsed(email: string): Promise<boolean> {
  const userWithEmail = await model.findUnique({ where: { email } });
  if (userWithEmail === null) {
    return false;
  }
  return true;
}
