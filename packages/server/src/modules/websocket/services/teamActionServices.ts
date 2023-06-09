import * as services from "../../teamActions/services";

export const teamActionServices = {
  queries: services.queries,
  findMany,
  findManyWithActions,
  updateMany,
};

async function findMany(teamId: number) {
  return services.queries.findMany({
    where: {
      teamId,
    },
    orderBy: {
      actionId: "asc",
    },
  });
}

async function findManyWithActions(actionIds: number[], teamId: number) {
  return services.queries.findMany({
    where: {
      AND: {
        actionId: {
          in: actionIds,
        },
        teamId,
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
  teamId: number,
  actions: {
    id: number;
    value: number;
    isTouched: boolean;
  }[]
) {
  await Promise.all(
    actions.map((teamAction) =>
      services.queries.update({
        where: {
          id_teamId: {
            id: teamAction.id,
            teamId,
          },
        },
        data: {
          value: teamAction.value,
          isTouched: teamAction.isTouched,
        },
      })
    )
  );

  return findMany(teamId);
}
