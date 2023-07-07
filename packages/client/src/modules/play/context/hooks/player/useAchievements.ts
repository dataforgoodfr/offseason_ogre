import {
  isDirectEnergyConsumption,
  isFossilEnergyConsumption,
} from "../../../utils/consumption";
import { sumReducer } from "../../../../../lib/array";
import { fromEntries } from "../../../../../lib/object";
import { useCurrentPlayer } from "./useCurrentPlayer";
import { usePersona } from "./usePersona";
import { usePlay } from "../../playContext";
import { productionConstants } from "../../../constants";
import { ACHIEVEMENTS_CONFIG } from "../../../mocks/achievements";
import { areConditionsFulfilled } from "../../../gameEngines/conditionEngine";
import { useTranslation } from "../../../../translations";
import { computePowerNeed } from "../../../utils/production";
import { useCallback, useMemo } from "react";
import { ProductionActionNames } from "../../../../../utils/types";

export { useAchievements };

function useAchievements() {
  const { t } = useTranslation(["achievements"]);
  const { consumptionActionById, productionActions } = usePlay();
  const { playerActions, teamActions } = useCurrentPlayer();
  const { latestPersona } = usePersona();

  const computePowerNeedForProductionAction = useCallback(
    (productionActionName: ProductionActionNames) => {
      const productionAction = productionActions.find(
        (productionAction) => productionAction.name === productionActionName
      );
      if (!productionAction) {
        return 0;
      }
      const teamAction = teamActions.find(
        (teamAction) => teamAction.actionId === productionAction.id
      );
      if (!teamAction) {
        return 0;
      }
      return computePowerNeed(productionAction, teamAction.value);
    },
    [productionActions, teamActions]
  );

  const unlockedAchievements = useMemo(() => {
    const input = {
      ...fromEntries(
        playerActions.map((playerAction) => [
          `consumptionAction.${
            consumptionActionById[playerAction.actionId].name
          }.isPerformed`,
          playerAction.isPerformed,
        ])
      ),
      "energy.direct": latestPersona.consumption
        .filter(isDirectEnergyConsumption)
        .map((c) => c.value)
        .reduce(sumReducer, 0),
      "energy.fossil": latestPersona.consumption
        .filter(isFossilEnergyConsumption)
        .map((c) => c.value)
        .reduce(sumReducer, 0),
      "production.total": latestPersona.production
        .map((c) => c.value)
        .reduce(sumReducer, 0),
      "consumption.total": latestPersona.consumption
        .map((c) => c.value)
        .reduce(sumReducer, 0),
      "production.offshoreWindTurbinePowerNeed":
        computePowerNeedForProductionAction(
          productionConstants.OFF_SHORE_WIND_TURBINE.name
        ),
      "production.onshoreWindTurbinePowerNeed":
        computePowerNeedForProductionAction(
          productionConstants.ON_SHORE_WIND_TURBINE.name
        ),
      "production.nuclearPowerNeed": computePowerNeedForProductionAction(
        productionConstants.NUCLEAR.name
      ),
    };

    return ACHIEVEMENTS_CONFIG.sort(
      (achievementA, achievementB) =>
        t(`achievements:achievement.${achievementA.name}.display-order`) -
        t(`achievements:achievement.${achievementB.name}.display-order`)
    )
      .map((config) => {
        return {
          name: config.name,
          isUnlocked: areConditionsFulfilled(
            config.successConditions as any,
            input
          ),
        };
      })
      .filter((achievement) => achievement.isUnlocked)
      .map((achievement) => achievement.name);
  }, [
    consumptionActionById,
    latestPersona,
    playerActions,
    computePowerNeedForProductionAction,
    t,
  ]);

  return {
    unlockedAchievements,
  };
}
