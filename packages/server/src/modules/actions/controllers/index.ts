import { Request, Response } from "express";
import { z } from "zod";
import { database } from "../../../database";
import * as services from "../services";
import * as playerActionsServices from "../services/playerActions";

export {
  getAllActionsController,
  getActionsController,
  getOrCreatePlayerActionsController,
  updatePlayerActionsController,
};

async function getAllActionsController(request: Request, response: Response) {
  const actions = await services.getAll();
  response.status(200).json({ actions });
}

async function getActionsController(request: Request, response: Response) {
  const querySchema = z.object({
    step: z.string().regex(/^\d+$/).transform(Number),
  });
  const { step } = querySchema.parse(request.params);
  const actions = await services.getMany(step);
  response.status(200).json({ actions });
}

async function getOrCreatePlayerActionsController(
  request: Request,
  response: Response
) {
  const querySchema = z.object({
    gameId: z.string().regex(/^\d+$/).transform(Number),
  });
  const { gameId } = querySchema.parse(request.query);
  const { user } = response.locals;
  if (!user) {
    response.status(401);
    return;
  }

  const playerActions = await playerActionsServices.getOrCreatePlayerActions(
    gameId,
    user.id
  );

  response.status(200).json({ playerActions });
}

async function updatePlayerActionsController(
  request: Request,
  response: Response
) {
  const bodySchema = z.object({
    playerActions: z
      .object({
        id: z.number(),
        isPerformed: z.boolean(),
      })
      .array()
      .min(1),
  });
  const { playerActions } = bodySchema.parse(request.body);
  const { user } = response.locals;
  if (!user) {
    response.status(401);
    return;
  }

  const [{ gameId }] = await Promise.all(
    playerActions.map((playerAction) =>
      database.playerActions.update({
        where: {
          id_userId: {
            id: playerAction.id,
            userId: user.id,
          },
        },
        data: {
          isPerformed: playerAction.isPerformed,
        },
      })
    )
  );

  const updatedPlayerActions =
    await playerActionsServices.getOrCreatePlayerActions(gameId, user.id);

  response.status(200).json({ playerActions: updatedPlayerActions });
}
