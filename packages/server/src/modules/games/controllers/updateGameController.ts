import type { Request, Response } from "express";
import { z } from "zod";
import { Game } from "@prisma/client";
import { services } from "../services";
import { services as playersServices } from "../../players/services";
import { services as teamsServices } from "../../teams/services";
import { dateSchema } from "./types";
import { getDefault } from "../services/personalization";
import * as playerActionsServices from "../../actions/services/playerActions";
import * as teamActionsServices from "../../teamActions/services";
import { batchItems } from "../../../lib/array";
import { createBusinessError } from "../../utils/businessError";

export { updateGameController };

type GameUpdate = ReturnType<ReturnType<typeof getBodySchemaParser>["parse"]>;

function getBodySchemaParser() {
  return z.object({
    description: z.string().optional(),
    date: dateSchema.optional(),
    name: z.string().optional(),
    status: z.enum(["draft", "ready", "playing", "finished"]).optional(),
    isTest: z.boolean().optional(),
  });
}

async function updateGameController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });
  const bodySchema = getBodySchemaParser();

  const { id } = paramsSchema.parse(request.params);
  const update = bodySchema.parse(request.body);

  const currentGame = await services.findOne({ id });
  if (!currentGame) {
    throw createBusinessError("GAME_NOT_FOUND", {
      prop: "id",
      value: id,
    });
  }

  if (shouldSwitchToTestGame({ game: currentGame, update })) {
    await prepareTestGame({ game: currentGame });
  } else if (shouldSwitchToRegularGame({ game: currentGame, update })) {
    await prepareRegularGame({ game: currentGame });
  } else {
    delete update.isTest;
  }

  if (update?.status === "playing") {
    await prepareGameForLaunch(id);
  }
  const document = await services.update(id, update);
  response.status(200).json({ document });
}

async function prepareTestGame({ game }: { game: Game }) {
  const teams = await teamsServices.getPlayableTeams({ gameId: game.id });
  await teamsServices.removeMany(teams);

  const players = await playersServices.getMany({ gameId: game.id });
  await playersServices.removeMany(players);

  await services.register({
    gameCode: game.code,
    userId: game.teacherId,
  });
}

async function prepareRegularGame({ game }: { game: Game }) {
  const teams = await teamsServices.getPlayableTeams({ gameId: game.id });
  await teamsServices.removeMany(teams);

  const players = await playersServices.getMany({ gameId: game.id });
  await playersServices.removeMany(players);
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

function shouldSwitchToTestGame({
  game,
  update,
}: {
  game: Game;
  update: GameUpdate;
}) {
  return (
    game.status === "draft" &&
    update.isTest != null &&
    !game.isTest &&
    update.isTest
  );
}

function shouldSwitchToRegularGame({
  game,
  update,
}: {
  game: Game;
  update: GameUpdate;
}) {
  return (
    game.status === "draft" &&
    update.isTest != null &&
    game.isTest &&
    !update.isTest
  );
}
