import { prisma } from "../../../database";
import { User } from "../types/entity";
import { isMailAlreadyUsed } from "./isMailAlreadyUsed";
import { sendMagicLink } from "./sendMagicLink";
import { signUp } from "./signUp";

const model = prisma.user;
type Model = User;

const crudServices = {
  getDocument,
  create,
};
const services = { ...crudServices, isMailAlreadyUsed, sendMagicLink, signUp };

export { services };

async function getDocument(id: number): Promise<Model | null> {
  return model.findUnique({ where: { id } });
}

async function create(document: Omit<Model, "id">): Promise<Model> {
  if (await isMailAlreadyUsed(document.email)) {
    throw new Error("Email is already taken.");
  }
  return model.create({ data: document });
}
