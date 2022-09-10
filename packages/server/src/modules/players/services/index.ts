import { Players as PlayersPrisma } from "@prisma/client";
import { database } from "../../../database";
import { Players } from "../types";

const model = database.players;
type Model = PlayersPrisma;

export { services };

const crudServices = {
  find,
  update,
};

const services = { ...crudServices };

async function find(gameId: number, userId: number): Promise<Players | null> {
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
    },
  }) as unknown as Players;
}

async function update(
  gameId: number,
  userId: number,
  document: Partial<Omit<Model, "id">>
): Promise<Players> {
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
