import type { Request, Response } from "express";
import { z } from "zod";
import { services } from "../services";
import { services as playersServices } from "../../players/services";
import { dateSchema } from "./types";
import { getDefault } from "../services/personalization";
import * as playerActionsServices from "../../actions/services/playerActions";
import * as teamActionsServices from "../../teamActions/services";
import { batchItems } from "../../../lib/array";
import { createBusinessError } from "../../utils/businessError";

export { updateGameController };

async function updateGameController(request: Request, response: Response) {
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

  const game = await services.findOne({ id });
  if (!game) {
    throw createBusinessError("GAME_NOT_FOUND", {
      prop: "id",
      value: id,
    });
  }

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
