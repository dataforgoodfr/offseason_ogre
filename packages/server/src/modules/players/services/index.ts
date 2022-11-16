import { Players as PlayersPrisma } from "@prisma/client";
import { database } from "../../../database";
import { Players } from "../types";

const model = database.players;
type Model = PlayersPrisma;

export { services };

const crudServices = {
  find,
  update,
  updateMany,
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
