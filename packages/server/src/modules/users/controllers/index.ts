import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../../database";
import { verify } from "../../tokens";
import { services } from "../services";
import { signInController } from "./signInController";

const crudController = {
  getDocumentController,
  createController,
};
const controllers = {
  ...crudController,
  getLoggedUserController,
  sendMagicLinkController,
  signInController,
};

export { controllers };

async function createController(request: Request, response: Response) {
  const bodySchema = z.object({
    country: z.string(),
    email: z.string(),
    lastName: z.string(),
    firstName: z.string(),
  });
  const documentToCreate = bodySchema.parse(request.body);
  const newDocument = await services.create({
    ...documentToCreate,
    isTeacher: false,
  });
  response.status(201).json({ data: newDocument });
}

async function getDocumentController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });
  const { id } = paramsSchema.parse(request.params);
  const document = await services.getDocument(id);
  response.status(200).json({ data: document });
}

async function getLoggedUserController(request: Request, response: Response) {
  const { authentificationToken } = request.cookies;
  let email: string | undefined;
  try {
    const payload = verify(authentificationToken);
    const payloadSchema = z.object({
      email: z.string(),
    });
    email = payloadSchema.parse(payload).email;
  } catch (err) {
    response.status(403).send({ message: "Invalid auth token" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: { email },
  });
  response.status(200).json({ user });
}

async function sendMagicLinkController(request: Request, response: Response) {
  if (!(await services.isMailAlreadyUsed(request.body.email))) {
    response
      .status(200)
      .send({ hasEmailBeenSent: false, hasUserWithThatEmail: false });
    return;
  }
  await services.sendMagicLink(request.body.email);
  response
    .status(200)
    .send({ hasEmailBeenSent: true, hasUserWithThatEmail: true });
}
