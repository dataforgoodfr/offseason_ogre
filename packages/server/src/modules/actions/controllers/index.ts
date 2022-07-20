import { Request, Response } from "express";
import { z } from "zod";
import * as services from "../services";
import * as playerActionsServices from "../services/playerActions";
import { Action } from "../types";

export {
  getAllActionsController,
  getActionsController,
  getOrCreatePlayerActionsController,
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
    step: z.string().regex(/^\d+$/).transform(Number),
    gameId: z.string().regex(/^\d+$/).transform(Number),
  });

  const { step, gameId } = querySchema.parse(request.query);

  const { user } = response.locals;
  if (!user) {
    response.status(401);
    return;
  }

  const stepActions = await services.getMany(step);
  const playerActionsCurrent = await playerActionsServices.getMany({
    actionIds: stepActions.map((action) => action.id),
    gameId,
    userId: user.id,
  });

  // Create player actions that are potentially missing.
  const actionsById = stepActions.reduce((map, action) => {
    map.set(action.id, action);
    return map;
  }, new Map<number, Action>());

  playerActionsCurrent.forEach((playerAction) =>
    actionsById.delete(playerAction.actionId)
  );

  const createdPlayerActions = await Promise.all(
    Array.from(actionsById).map(([_, action]) =>
      playerActionsServices.create({
        actionId: action.id,
        gameId,
        userId: user.id,
      })
    )
  );

  const playerActions = [...playerActionsCurrent, ...createdPlayerActions].sort(
    (a, b) => a.id - b.id
  );

  response.status(200).json({ playerActions });
}
