import { Personalization, Players } from "@prisma/client";
import { database } from "../../../database";
import * as playerActionsServices from "../../actions/services/playerActions";
import { batchItems } from "../../../lib/array";

const model = database.players;
type Model = Players;

export { services };

const crudServices = {
  queries: model,
  getMany,
  remove,
  removeMany,
  setDefaultProfiles,
  updateMany,
  validateProfiles,
};

const services = { ...crudServices };

async function getMany(
  partial: NonNullable<Parameters<typeof model.findMany>[0]>["where"] = {}
): Promise<Model[]> {
  return model.findMany({
    where: { ...partial },
  });
}

async function setDefaultProfiles(
  gameId: number,
  defaultPersonalization: Personalization
): Promise<void> {
  const playersWithoutProfiles = await model.findMany({
    where: {
      OR: [
        {
          gameId,
          profileId: null,
        },
        {
          gameId,
          profile: {
            status: {
              not: {
                equals: "validated",
              },
            },
          },
        },
      ],
    },
    include: {
      profile: true,
    },
  });

  return playersWithoutProfiles.forEach(async (player: any) => {
    const profile = await database.profile.create({
      data: {
        userId: player.userId,
        personalizationId: defaultPersonalization.id,
        status: "validated",
        lastStatusUpdate: new Date(),
      },
    });
    await model.update({
      where: {
        userId_gameId: {
          gameId,
          userId: player.userId,
        },
      },
      data: {
        profileId: profile.id,
      },
    });
  });
}

async function validateProfiles(gameId: number): Promise<void> {
  const playersToValidate = await model.findMany({
    where: {
      gameId,
      profile: {
        status: {
          equals: "pendingValidation",
        },
      },
    },
  });

  return playersToValidate.forEach(async (player: Players) => {
    if (player.profileId) {
      await database.profile.update({
        where: {
          id: player.profileId,
        },
        data: {
          status: "validated",
          lastStatusUpdate: new Date(),
        },
      });
    }
  });
}

async function updateMany(
  gameId: number,
  data: Partial<Omit<Model, "id">>
): Promise<void> {
  await model.updateMany({
    where: {
      gameId,
    },
    data,
  });
}

async function remove({ gameId, userId }: { gameId: number; userId: number }) {
  await playerActionsServices.removeForPlayer({ gameId, userId });
  await database.players.delete({
    where: { userId_gameId: { gameId, userId } },
  });
}

async function removeMany(players: { gameId: number; userId: number }[]) {
  const REMOVE_BATCH_SIZE = 25;

  await batchItems(players || [], REMOVE_BATCH_SIZE, async (playerBatch) => {
    const processingPlayers = playerBatch.map(remove);
    await Promise.all(processingPlayers);
  });
}
