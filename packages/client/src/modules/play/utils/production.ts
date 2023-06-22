import { ProductionAction, TeamAction } from "../../../utils/types";
import { Persona } from "../../persona/persona";
import { ProductionDatum } from "../../persona/production";

export { computeNewProductionData, computeTeamActionStats };

function computeTeamActionStats(
  teamAction: TeamAction,
  productionActionById: Record<number, ProductionAction>
) {
  const productionAction = productionActionById[teamAction.actionId];
  // TODO: see with Gregory for renaming (should be `power` instead)?
  const productionKwh = computeProduction(teamAction, productionActionById);
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

function computeProduction(
  teamAction: TeamAction,
  productionActionById: Record<number, ProductionAction>
): number {
  const productionAction = productionActionById[teamAction.actionId];
  if (productionAction.unit === "area") {
    return teamAction.value * productionAction.areaEnergy;
  }
  if (productionAction.unit === "percentage") {
    return (teamAction.value / 100) * productionAction.totalEnergy;
  }

  throw new Error(
    `Energy unit ${(productionAction as any).unit} not supported`
  );
}

function computeNewProductionData(
  performedTeamActions: TeamAction[],
  productionActionById: Record<number, ProductionAction>,
  persona: Persona
) {
  const productionNameToNewProduction = Object.fromEntries(
    performedTeamActions
      .map((teamAction) => ({
        name: productionActionById[teamAction.actionId].name,
        type: productionActionById[teamAction.actionId].type,
        value: computeTeamActionStats(teamAction, productionActionById)
          .productionKwh,
      }))
      .map((production) => [production.name, production])
  );
  const productionNameToProduction = Object.fromEntries(
    persona.production.map((production) => [production.name, production])
  );

  const newProduction: ProductionDatum[] = Object.values({
    ...productionNameToProduction,
    ...productionNameToNewProduction,
  });

  return newProduction;
}
