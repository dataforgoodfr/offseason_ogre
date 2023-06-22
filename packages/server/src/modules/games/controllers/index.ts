import type { Request, Response } from "express";
import { z } from "zod";
import { services } from "../services";
import { services as playersServices } from "../../players/services";
import { changeTeamController } from "./changeTeamController";
import { getPlayedGames } from "../services/getPlayedGames";
import { getPlayers } from "../services/getPlayers";
import { registerController } from "./registerController";
import { dateSchema } from "./types";
import { removePlayerController } from "./removePlayerController";
import { removeTeamController } from "./removeTeamController";
import { putPlayersInTeamsController } from "./putPlayersInTeamsController";
import { getDefault } from "../services/personalization";
import { validateProfilesController } from "./validateProfilesController";
import { updateProfilesController } from "./updateProfilesController";
import { generateCode } from "../services/utils";
import { getManyGamesControllers } from "./getManyGamesController";
import * as playerActionsServices from "../../actions/services/playerActions";
import * as teamActionsServices from "../../teamActions/services";
import { batchItems } from "../../../lib/array";

const crudController = {
  createController,
  changeTeamController,
  getManyControllers: getManyGamesControllers,
  getGame,
  getPlayedGamesController,
  getPlayersController,
  putPlayersInTeamsController,
  registerController,
  removePlayerController,
  removeTeamController,
  updateGame,
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
    status: z.enum(["draft", "ready", "playing", "finished"]).optional(),
  });

  const { id } = paramsSchema.parse(request.params);
  const update = bodySchema.parse(request.body);

  if (update?.status === "playing") {
    await prepareGameForLaunch(id);
  }
  const document = await services.update(id, update);
  response.status(200).json({ document });
}

async function prepareGameForLaunch(gameId: number) {
  const BATCH_SIZE = 25;

  const defaultPersonalization = await getDefault();
  await playersServices.setDefaultProfiles(gameId, defaultPersonalization);

  const game = await services.queries.findUnique({
    where: {
      id: gameId,
    },
    include: {
      players: true,
      teams: true,
    },
  });

  await batchItems(game?.players || [], BATCH_SIZE, async (playerBatch) => {
    const processingPlayerActions = playerBatch.map((p) =>
      playerActionsServices.getOrCreatePlayerActions(gameId, p.userId)
    );
    await Promise.all(processingPlayerActions);
  });

  await batchItems(game?.teams || [], BATCH_SIZE, async (teamBatch) => {
    const processingTeamActions = teamBatch.map((t) =>
      teamActionsServices.getOrCreateTeamActions(t.id)
    );
    await Promise.all(processingTeamActions);
  });
}
