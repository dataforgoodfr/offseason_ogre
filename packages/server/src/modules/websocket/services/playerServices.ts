import { Players } from "@prisma/client";
import { services } from "../../players/services";

export const playerServices = {
  queries: services.queries,
  findOne,
  update,
  updateMany,
};

async function findOne(gameId: number, userId: number) {
  return services.queries.findUnique({
    where: {
      userId_gameId: {
        gameId,
        userId,
      },
    },
  });
}

async function update(
  gameId: number,
  userId: number,
  data: Partial<Omit<Players, "id">>
) {
  return services.queries.update({
    where: {
      userId_gameId: {
        gameId,
        userId,
      },
    },
    data,
  });
}

async function updateMany(
  gameId: number,
  data: Partial<Omit<Players, "id">>
): Promise<void> {
  await services.queries.updateMany({
    where: {
      gameId,
    },
    data,
  });
}
