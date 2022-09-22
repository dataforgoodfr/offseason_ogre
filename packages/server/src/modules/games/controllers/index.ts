import type { Request, Response } from "express";
import { z } from "zod";
import { services } from "../services";
import { changeTeamController } from "./changeTeamController";
import { getPlayedGames } from "../services/getPlayedGames";
import { getPlayers } from "../services/getPlayers";
import { registerController } from "./registerController";
import { dateSchema } from "./types";
import { removePlayerController } from "./removePlayerController";

const crudController = {
  createController,
  changeTeamController,
  getManyControllers,
  getGame,
  getPlayedGamesController,
  getPlayersController,
  registerController,
  removePlayerController,
  updateGame,
};
const controllers = {
  ...crudController,
};

export { controllers };

async function createController(request: Request, response: Response) {
  const bodySchema = z.object({
    name: z.string().optional(),
  });
  const documentToCreate = bodySchema.parse(request.body);
  const newDocument = await services.create({
    date: new Date(),
    description: "",
    name: `Nouveau jeu - ${new Date().toLocaleString()}`,
    teacherId: response.locals.user.id,
    status: "draft",
    step: 0,
    isStepActive: false,
    ...documentToCreate,
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
    status: z.enum(["draft", "ready", "finished"]).optional(),
  });

  const { id } = paramsSchema.parse(request.params);
  const update = bodySchema.parse(request.body);

  const document = await services.update(id, update);
  response.status(200).json({ document });
}
