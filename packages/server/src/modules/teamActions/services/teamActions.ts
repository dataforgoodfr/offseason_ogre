import { TeamActions } from "@prisma/client";
import invariant from "tiny-invariant";
import { database } from "../../../database";
import { logger } from "../../../logger";
import * as productionActionsServices from "../../productionActions/services";

const model = database.teamActions;
type Model = TeamActions;

export {
  create,
  getMany,
  getOrCreateTeamActions,
  removeForTeam,
  updateTeamActions,
};

async function create({
  actionId,
  teamId,
}: Pick<Model, "actionId" | "teamId">) {
  const productionAction = await productionActionsServices.getOne({
    id: actionId,
  });
  invariant(
    productionAction,
    `Could not find production action with id ${actionId}`
  );

  return model.create({
    data: {
      actionId,
      teamId,
      value: productionAction.defaultTeamValue,
    },
    include: {
      action: true,
    },
  });
}

async function getMany({
  ids,
  actionIds,
  teamId,
}: {
  ids?: number[];
  actionIds?: number[];
  teamId: number;
}) {
  return model.findMany({
    where: {
      ...(actionIds ? { actionId: { in: actionIds } } : {}),
      ...(ids ? { id: { in: ids } } : {}),
      teamId,
    },
    include: {
      action: {
        include: {
          pointsIntervals: true,
        },
      },
    },
  });
}

async function removeForTeam({ teamId }: { teamId: number }): Promise<void> {
  await database.teamActions.deleteMany({
    where: {
      teamId,
    },
  });
}

async function getOrCreateTeamActions(teamId: number) {
  try {
    const prodActions = await productionActionsServices.getMany();
    const currentTeamActions = await getMany({
      actionIds: prodActions.map((action) => action.id),
      teamId,
    });

    // Create team actions that are potentially missing.
    const prodActionIdToIsLinked = Object.fromEntries(
      currentTeamActions.map((teamAction) => [teamAction.action.id, true])
    );
    const creatingTeamActions = prodActions
      .filter((prodAction) => !prodActionIdToIsLinked[prodAction.id])
      .map((prodAction) =>
        create({
          actionId: prodAction.id,
          teamId,
        })
      );
    const createdTeamActions = await Promise.all(creatingTeamActions);

    const teamActions = [...currentTeamActions, ...createdTeamActions].sort(
      (a, b) => a.id - b.id
    );

    return teamActions;
  } catch (err) {
    logger.error(err);
    return [];
  }
}

async function updateTeamActions(
  teamId: number,
  teamActions: {
    id: number;
    value: number;
    isTouched: boolean;
  }[]
): Promise<TeamActions[]> {
  await Promise.all(
    teamActions.map((teamAction) =>
      database.teamActions.update({
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

  return getOrCreateTeamActions(teamId);
}
