import * as jwt from "jsonwebtoken";
import sendGridMail from "@sendgrid/mail";
import invariant from "tiny-invariant";
import { prisma } from "../../../database";
import { User } from "../types/entity";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const model = prisma.user;
type Model = User;

const crudServices = {
  getDocument,
  create,
  isMailAlreadyUsed,
  sendWithSendgrid,
};
const services = { ...crudServices };

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

async function sendWithSendgrid(email: string) {
  const origin = getOrigin();
  const token = signMagicToken(email);
  const magicLink = `${origin}/api/users/sign-in?token=${token}`;
  await sendMail({
    to: email,
    from: "grandeur.energies@gmail.com",
    subject: "Votre lien de connexion OGRE",
    text: "Votre lien: ",
    html: `<p><a href="${magicLink}">${magicLink}</a></p>`,
  });
}

function signMagicToken(email: string): string {
  const secretKey = process.env.SECRET_KEY || "secret_key";
  return jwt.sign({ email, type: "magicLink" }, secretKey, {
    expiresIn: "24h",
  });
}

function getOrigin(): string {
  if (process.env.ORIGIN) {
    return process.env.ORIGIN;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://atelierogre.herokuapp.com";
  }
  if (process.env.NODE_ENV === "staging") {
    return "https://atelierogre-staging.herokuapp.com";
  }
  return "http://localhost:3001";
}

async function sendMail(msg: {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}) {
  const apiKey = process.env.SENDGRID_API_KEY;
  invariant(apiKey, "SENDGRID_API_KEY must be set in env variables.");
  sendGridMail.setApiKey(apiKey);
  await sendGridMail.send(msg);
}
