import { indexArrayBy } from "../../../lib/array";
import { fromEntries } from "../../../lib/object";
import { ProductionAction, TeamAction } from "../../../utils/types";
import { Persona } from "../../persona/persona";
import { PRODUCTION, ProductionDatum } from "../../persona/production";

export {
  computeNewProductionData,
  computeTeamActionStats,
  computeEnergyProduction,
  computePowerNeed,
  isDecarbonatedEnergyProduction,
};

function computeTeamActionStats(
  teamAction: TeamAction,
  productionActionById: Record<number, ProductionAction>
) {
  const productionAction = productionActionById[teamAction.actionId];
  // TODO: see with Gregory for renaming (should be `power` instead)?
  const productionKwh = computeEnergyProduction(
    productionAction,
    teamAction.value
  );
  // TODO: see with Gregory for renaming (should be `production` instead)?
  const powerNeedGw = productionKwh * productionAction.powerNeededKWh;
  const cost = productionKwh * productionAction.lcoe;
  const points =
    productionAction.pointsIntervals?.find(
      ({ min, max }) => min < teamAction.value && teamAction.value <= max
    )?.points || 0;

  const isCredible = teamAction.value <= productionAction.credibilityThreshold;

  return {
    productionKwh,
    powerNeedGw,
    cost,
    points,
    isCredible,
  };
}

function computeEnergyProduction(
  productionAction: ProductionAction,
  /** Value depending if the energy produced is per unit of area or a percentage of the maximum energy potential. */
  value: number
): number {
  if (productionAction.unit === "area") {
    return value * productionAction.areaEnergy;
  }
  if (productionAction.unit === "percentage") {
    return (value / 100) * productionAction.totalEnergy;
  }

  throw new Error(
    `Energy unit ${(productionAction as any).unit} not supported`
  );
}

/**
 * Compute the power need for a given production action.
 */
function computePowerNeed(
  productionAction: ProductionAction,
  /** Value depending if the energy produced is per unit of area or a percentage of the maximum energy potential. */
  value: number
): number {
  const productionKwh = computeEnergyProduction(productionAction, value);
  return productionKwh * productionAction.powerNeededKWh;
}

function computeNewProductionData(
  performedTeamActions: TeamAction[],
  productionActionById: Record<number, ProductionAction>,
  persona: Persona
) {
  const productionByName = indexArrayBy(PRODUCTION, "name");
  const productionNameToNewProduction = fromEntries(
    performedTeamActions
      .map((teamAction) => {
        const productionAction = productionActionById[teamAction.actionId];
        const baseProduction = productionByName[productionAction.name];

        return {
          ...baseProduction,
          value: computeEnergyProduction(productionAction, teamAction.value),
        };
      })
      .map((production) => [production.name, production])
  );
  const productionNameToProduction = fromEntries(
    persona.production.map((production) => [production.name, production])
  );

  const newProduction: ProductionDatum[] = Object.values({
    ...productionNameToProduction,
    ...productionNameToNewProduction,
  });

  return newProduction;
}

function isDecarbonatedEnergyProduction(production: ProductionDatum): boolean {
  return production.carbonType === "decarbonated";
}
