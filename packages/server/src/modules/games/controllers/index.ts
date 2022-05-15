import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../../database";
import { services } from "../services";
import { registerController } from "./registerController";
import { dateSchema } from "./types";

const crudController = {
  createController,
  getManyControllers,
  getGame,
  getPlayedGamesController,
  registerController,
  updateGame,
};
const controllers = {
  ...crudController,
};

export { controllers };

async function createController(request: Request, response: Response) {
  const bodySchema = z.object({
    name: z.string(),
  });
  const documentToCreate = bodySchema.parse(request.body);
  const newDocument = await services.create({
    ...documentToCreate,
    date: new Date(),
    teacherId: response.locals.user.id,
    description: "",
  });
  response.status(201).json({ data: newDocument });
}

async function getManyControllers(request: Request, response: Response) {
  const documents = await services.getMany();
  response.status(200).json({ documents });
}

async function getPlayedGamesController(request: Request, response: Response) {
  const user = response.locals.user || null;
  const games = await prisma.game.findMany({
    where: { players: { some: { id: user.id } } },
  });
  response.status(200).json({ games });
}

async function getGame(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });
  const { id } = paramsSchema.parse(request.params);
  const document = await services.getDocument(id);
  response.status(200).json({ document });
}

async function updateGame(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });
  const bodySchema = z.object({
    name: z.string(),
    description: z.string(),
    date: dateSchema,
  });

  const { id } = paramsSchema.parse(request.params);
  const fieldToUpdate = bodySchema.parse(request.body);

  const document = await services.update(id, fieldToUpdate);
  response.status(200).json({ document });
}
