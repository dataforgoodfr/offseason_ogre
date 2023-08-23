import type { Request, Response } from "express";
import { z } from "zod";
import { services } from "../services";
import { changeTeamController } from "./changeTeamController";
import { getPlayedGames } from "../services/getPlayedGames";
import { getPlayers } from "../services/getPlayers";
import { registerController } from "./registerController";
import { removePlayerController } from "./removePlayerController";
import { removeTeamController } from "./removeTeamController";
import { putPlayersInTeamsController } from "./putPlayersInTeamsController";
import { validateProfilesController } from "./validateProfilesController";
import { updateProfilesController } from "./updateProfilesController";
import { generateCode } from "../services/utils";
import { getManyGamesControllers } from "./getManyGamesController";
import { updateGameController } from "./updateGameController";

const crudController = {
  createController,
  changeTeamController,
  getManyControllers: getManyGamesControllers,
  getGame,
  getPlayedGamesController,
  getPlayersController,
  putPlayersInTeamsController,
  registerController,
  removeGame,
  removePlayerController,
  removeTeamController,
  updateGameController,
  validateProfilesController,
  updateProfilesController,
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
    code: generateCode(),
    description: "",
    name: `Nouveau jeu - ${new Date().toLocaleString()}`,
    teacherId: response.locals.user.id,
    status: "draft",
    step: 0,
    lastFinishedStep: 0,
    isTest: false,
    ...documentToCreate,
  });
  response.status(201).json({ data: newDocument });
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
  const document = await services.findOne(
    { id },
    {
      include: {
        teams: {
          include: {
            players: true,
          },
        },
      },
    }
  );
  response.status(200).json({ document });
}

async function removeGame(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });

  const { id } = paramsSchema.parse(request.params);

  await services.remove({ id });

  response.status(200).json({});
}
