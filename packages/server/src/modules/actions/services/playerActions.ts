import { PlayerActions } from "../types";
import { database } from "../../../database";

const model = database.playerActions;
type Model = PlayerActions;

export { create, getMany };

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
