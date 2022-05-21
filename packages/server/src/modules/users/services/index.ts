import { database } from "../../../database";
import { User } from "../types/entity";
import { isMailAlreadyUsed } from "./isMailAlreadyUsed";
import { sendMagicLink } from "./sendMagicLink";
import { signUp } from "./signUp";

const model = database.user;
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

async function create(newUser: Omit<Model, "id">): Promise<Model> {
  if (await isMailAlreadyUsed(newUser.email)) {
    throw new Error("Email is already taken.");
  }
  return model.create({
    data: { ...newUser, isTeacher: computeIsTeacher(newUser) },
  });
}

function computeIsTeacher(newUser: Omit<Model, "id">) {
  if (shouldHaveTeacherRole(newUser.email)) {
    return true;
  }
  return newUser.isTeacher ?? false;
}

function shouldHaveTeacherRole(email: string): boolean {
  const mails = [
    "b00461284@essec.edu",
    "chareyronlaurene@gmail.com",
    "felix.barriere@gmail.com",
    "grandeur.energies@gmail.com",
    "louis.sanna@gmail.com",
    "ogre.teacher@yopmail.com",
    "remi.riviere.free@gmail.com",
    "tcateland@gmail.com",
  ];
  return mails.includes(email);
}
