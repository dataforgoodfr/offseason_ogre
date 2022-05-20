import type { Request, Response } from "express";
import { z } from "zod";
import { services } from "../services";
import { changeTeamController } from "./changeTeamController";
import { getPlayedGames } from "../services/getPlayedGames";
import { getPlayers } from "../services/getPlayers";
import { registerController } from "./registerController";
import { dateSchema } from "./types";

const crudController = {
  createController,
  changeTeamController,
  getManyControllers,
  getGame,
  getPlayedGamesController,
  getPlayersController,
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
    status: "draft",
  });
  response.status(201).json({ data: newDocument });
}

async function getManyControllers(request: Request, response: Response) {
  const documents = await services.getMany();
  response.status(200).json({ documents });
}

async function getPlayedGamesController(request: Request, response: Response) {
  const user = response.locals.user || null;
  const games = await getPlayedGames({ userId: user.id });
  response.status(200).json({ games });
}

async function getPlayersController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });
  const { id } = paramsSchema.parse(request.params);
  const players = await getPlayers({ gameId: id });
  response.status(200).json({ players });
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
    description: z.string().optional(),
    date: dateSchema.optional(),
    name: z.string().optional(),
    status: z.enum(["draft", "ready"]).optional(),
  });

  const { id } = paramsSchema.parse(request.params);
  const update = bodySchema.parse(request.body);

  const document = await services.update(id, update);
  response.status(200).json({ document });
}
