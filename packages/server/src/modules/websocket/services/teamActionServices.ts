import { Prisma } from "@prisma/client";
import { database } from "../../../database";

const model = database.teamActions;

export const teamActionServices = {
  findMany,
  updateMany,
};

async function findMany<
  OptionsInclude extends NonNullable<
    Parameters<typeof model.findMany>[0]
  >["include"]
>(
  ids: number[],
  teamId: number,
  options: {
    include?: OptionsInclude;
  } = {}
): Promise<
  Prisma.TeamActionsGetPayload<{
    include: OptionsInclude;
  }>[]
> {
  return model.findMany({
    where: {
      AND: {
        id: {
          in: ids,
        },
        teamId,
      },
    },
    orderBy: {
      actionId: "asc",
    },
    ...options,
  }) as any;
}

async function updateMany(
  teamId: number,
  actions: {
    id: number;
    value: number;
    isTouched: boolean;
  }[]
) {
  return Promise.all(
    actions.map((teamAction) =>
      model.update({
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
}
