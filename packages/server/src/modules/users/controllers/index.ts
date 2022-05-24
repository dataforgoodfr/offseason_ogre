import type { Request, Response } from "express";
import { z } from "zod";
import { services } from "../services";
import { logoutController } from "./logoutController";
import { signInController } from "./signInController";

const crudController = {
  getDocumentController,
  signUpController,
  getTeamForPlayer,
};
const controllers = {
  ...crudController,
  getLoggedUserController,
  logoutController,
  sendMagicLinkController,
  signInController,
};

export { controllers };

async function signUpController(request: Request, response: Response) {
  const bodySchema = z.object({
    country: z.string(),
    email: z.string(),
    lastName: z.string(),
    firstName: z.string(),
  });
  const documentToCreate = bodySchema.parse(request.body);
  const newDocument = await services.signUp({
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
  const user = response.locals.user || null;
  response.status(200).json({ user });
}

async function sendMagicLinkController(request: Request, response: Response) {
  const { email } = request.body;
  await services.sendMagicLink(email);
  response
    .status(200)
    .send({ hasEmailBeenSent: true, hasUserWithThatEmail: true });
}

async function getTeamForPlayer(request: Request, response: Response) {
  const paramsSchema = z.object({
    gameId: z.string().regex(/^\d+$/).transform(Number),
    id: z.string().regex(/^\d+$/).transform(Number),
  });
  const { gameId, id } = paramsSchema.parse(request.params);
  const document = await services.getTeamForPlayer(gameId, id);
  response.status(200).json({ data: document });
}
