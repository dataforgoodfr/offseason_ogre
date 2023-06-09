import { Action, PlayerActions } from "../types";
import { database } from "../../../database";
import * as services from "./index";
import { logger } from "../../../logger";

const model = database.playerActions;
type Model = PlayerActions;

export {
  model as queries,
  create,
  getMany,
  getOrCreatePlayerActions,
  removeForPlayer,
};

async function create({
  actionId,
  gameId,
  userId,
}: Pick<Model, "actionId" | "gameId" | "userId">): Promise<Model> {
  const document = model.create({
    data: {
      actionId,
      gameId,
      userId,
    },
    include: {
      action: true,
    },
  });
  return document;
}

async function getMany({
  actionIds,
  gameId,
  userId,
}: {
  actionIds: number[];
  gameId: number;
  userId: number;
}): Promise<Model[]> {
  const documents = model.findMany({
    where: {
      actionId: {
        in: actionIds,
      },
      userId,
      gameId,
    },
    include: {
      action: true,
    },
  });
  return documents;
}

async function removeForPlayer({
  gameId,
  userId,
}: {
  gameId: number;
  userId: number;
}): Promise<void> {
  await database.playerActions.deleteMany({
    where: {
      AND: {
        gameId,
        userId,
      },
    },
  });
}

async function getOrCreatePlayerActions(
  gameId: number,
  userId: number
): Promise<PlayerActions[]> {
  try {
    const stepActions = await services.getMany();
    const playerActionsCurrent = await getMany({
      actionIds: stepActions.map((action) => action.id),
      gameId,
      userId,
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
      Array.from(actionsById).map(([, action]) =>
        create({
          actionId: action.id,
          gameId,
          userId,
        })
      )
    );

    const playerActions = [
      ...playerActionsCurrent,
      ...createdPlayerActions,
    ].sort((a, b) => a.id - b.id);

    return playerActions;
  } catch (err) {
    logger.error(err);
    return [];
  }
}
