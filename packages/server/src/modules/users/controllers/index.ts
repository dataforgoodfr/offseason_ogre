import type { Request, Response } from "express";
import { z } from "zod";
import { services } from "../services";

const crudController = { getDocumentController, createController, signIn };
const controllers = { ...crudController };

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

async function signIn(request: Request, response: Response) {
  if ((await services.isMailAlreadyUsed(request.body.email)) === 1) {
    services.sendWithSendgrid(request.body.email);
    response.status(200).send("Magic Link envoyé");
  } else {
    response.status(200).send("email non existant!");
  }
}
