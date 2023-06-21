import { sumBy } from "lodash";
import { computeNewConsumptionData } from "../../../utils/consumption";
import { usePersona, usePlayerActions } from "../../playContext";
import { useMyProfile } from "./useMyProfile";
import { sumFor } from "../../../../persona";
import {
  ConsumptionDatum,
  ConsumptionType,
} from "../../../../persona/consumption";
import { indexArrayBy } from "../../../../../lib/array";
import { fromEntries } from "../../../../../lib/object";
import { useMemo } from "react";
import { Action } from "../../../../../utils/types";

export { useMostImpactfulActions };
export type { ImpactfulAction };

type ImpactfulAction = {
  action: Action;
  isPerformed: boolean;
  consumptionImpacts: {
    type: ConsumptionType;
    initial: number;
    final: number;
    absolute: number;
    relative: number;
  }[];
};

function useMostImpactfulActions({ limit = 5 }: { limit?: number } = {}) {
  const { personalization } = useMyProfile();
  const { playerActions } = usePlayerActions();
  const { personaBySteps } = usePersona();

  const mostImpactfulActions = useMemo(() => {
    const initialPersona = personaBySteps[0];
    const actions = playerActions.map((playerAction) => playerAction.action);
    const actionNameToPlayerAction = indexArrayBy(playerActions, "action.name");

    const initialConsumptionByType = computeConsumptionByType(
      initialPersona.consumption
    );

    const mostImpactfulActions: ImpactfulAction[] = actions
      .map((action) => {
        const consumptionData = computeNewConsumptionData(
          [action.name],
          personalization
        );

        return {
          action,
          consumptionData,
          totalConsumptionKwh: sumBy(consumptionData, "value"),
        };
      })
      .sort(
        (consoA, consoB) =>
          consoA.totalConsumptionKwh - consoB.totalConsumptionKwh
      )
      .slice(0, limit)
      .map(({ action, consumptionData }) => {
        const consumptionByType = computeConsumptionByType(consumptionData);
        const consumptionImpacts = computeConsumptionDifference(
          consumptionByType,
          initialConsumptionByType
        );

        return {
          action,
          isPerformed: actionNameToPlayerAction[action.name!].isPerformed,
          consumptionImpacts,
        };
      });

    return mostImpactfulActions;
  }, [limit, personaBySteps, personalization, playerActions]);

  return {
    mostImpactfulActions,
  };
}

function computeConsumptionByType(
  consumptionData: readonly ConsumptionDatum[]
): Record<ConsumptionType, number> {
  const consumptionTypes = consumptionData.map((c) => c.type);

  const consumptionByType = fromEntries(
    consumptionTypes.map((type) => [type, sumFor(consumptionData, type)])
  );

  return consumptionByType;
}

function computeConsumptionDifference(
  consumptionByType: Record<ConsumptionType, number>,
  refConsumptionByType: Record<ConsumptionType, number>
): {
  type: ConsumptionType;
  initial: number;
  final: number;
  absolute: number;
  relative: number;
}[] {
  const consumptionTypes = Object.keys(
    refConsumptionByType
  ) as ConsumptionType[];

  const consumptionImpacts = consumptionTypes
    .map((type) => {
      const absoluteDifference =
        consumptionByType[type] - refConsumptionByType[type];

      return {
        type,
        initial: refConsumptionByType[type],
        final: consumptionByType[type],
        absolute: absoluteDifference,
        relative: absoluteDifference / refConsumptionByType[type],
      };
    })
    .filter((difference) => difference.absolute !== 0);

  return consumptionImpacts;
}
