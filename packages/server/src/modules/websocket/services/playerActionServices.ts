import { PlayerActions } from "@prisma/client";
import * as services from "../../actions/services/playerActions";

export const playerActionServices = {
  queries: services.queries,
  findMany,
  findManyWithActions,
  updateMany,
};

async function findMany(gameId: number, userId: number) {
  return services.queries.findMany({
    where: {
      AND: {
        gameId,
        userId,
      },
    },
    orderBy: {
      actionId: "asc",
    },
  });
}

async function findManyWithActions(gameId: number, userId: number) {
  return services.queries.findMany({
    where: {
      AND: {
        gameId,
        userId,
      },
    },
    include: {
      action: true,
    },
    orderBy: {
      actionId: "asc",
    },
  });
}

async function updateMany(
  userId: number,
  actions: {
    isPerformed: boolean;
    id: number;
  }[]
): Promise<PlayerActions[]> {
  return Promise.all(
    actions.map((playerAction) =>
      services.queries.update({
        where: {
          id_userId: {
            id: playerAction.id,
            userId,
          },
        },
        data: {
          isPerformed: playerAction.isPerformed,
        },
      })
    )
  );
}
