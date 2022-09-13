import { ProductionAction, TeamActions } from "@prisma/client";
import invariant from "tiny-invariant";
import { database } from "../../../database";
import * as productionActionsServices from "../../productionActions/services";

const model = database.teamActions;
type Model = TeamActions;

export { create, getMany, getOrCreateTeamActions, updateTeamActions };

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

  const document = model.create({
    data: {
      actionId,
      teamId,
      value: productionAction.defaultTeamValue,
    },
    include: {
      action: true,
    },
  });
  return document;
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
  const where: any = {};
  if (ids) {
    where.id = {
      in: ids,
    };
  }
  if (actionIds) {
    where.actionId = {
      in: actionIds,
    };
  }
  where.teamId = teamId;

  const documents = model.findMany({
    where,
    include: {
      action: true,
    },
  });
  return documents;
}

async function getOrCreateTeamActions(teamId: number) {
  try {
    const stepProductionActions = await productionActionsServices.getMany();
    const teamActionsCurrent = await getMany({
      actionIds: stepProductionActions.map((action) => action.id),
      teamId,
    });

    // Create team actions that are potentially missing.
    const idToProductionAction = stepProductionActions.reduce((map, action) => {
      map.set(action.id, action);
      return map;
    }, new Map<number, ProductionAction>());

    teamActionsCurrent.forEach((playerAction) =>
      idToProductionAction.delete(playerAction.actionId)
    );

    const createdTeamActions = await Promise.all(
      Array.from(idToProductionAction).map(([_, action]) =>
        create({
          actionId: action.id,
          teamId,
        })
      )
    );

    const teamActions = [...teamActionsCurrent, ...createdTeamActions].sort(
      (a, b) => a.id - b.id
    );

    return teamActions;
  } catch (err) {
    console.error(err);
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

  const updatedPlayerActions = await getOrCreateTeamActions(teamId);

  return updatedPlayerActions;
}
