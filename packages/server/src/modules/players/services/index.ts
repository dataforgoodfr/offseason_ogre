import { Personalization, Players as PlayersPrisma } from "@prisma/client";
import { database } from "../../../database";
import { Players } from "../types";
import * as playerActionsServices from "../../actions/services/playerActions";

const model = database.players;
type Model = PlayersPrisma;

export { services };

const crudServices = {
  find,
  remove,
  setDefaultProfiles,
  update,
  updateMany,
  validateProfiles,
};

const services = { ...crudServices };

async function find(gameId: number, userId: number): Promise<Players | null> {
  // TODO: find a way to link Prisma typing with attributes included in `include` section.
  return model.findFirst({
    where: {
      gameId,
      userId,
    },
    include: {
      actions: {
        include: {
          action: true,
        },
      },
      team: true,
      profile: {
        include: {
          personalization: true,
        },
      },
    },
  }) as unknown as Players;
}

async function update(
  gameId: number,
  userId: number,
  document: Partial<Omit<Model, "id">>
): Promise<Players> {
  // TODO: find a way to link Prisma typing with attributes included in `include` section.
  return model.update({
    where: {
      userId_gameId: {
        gameId,
        userId,
      },
    },
    data: document,
    include: {
      actions: {
        include: {
          action: true,
        },
      },
      team: true,
    },
  }) as unknown as Players;
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

  return playersToValidate.forEach(async (player: PlayersPrisma) => {
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
