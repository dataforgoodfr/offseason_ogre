import { TeamAction } from "../../../utils/types";
import { Persona } from "../../persona/persona";

export { computeNewProductionData, computeTeamActionStats };

function computeTeamActionStats(teamAction: TeamAction) {
  // TODO: see with Gregory for renaming (should be `power` instead)?
  const productionKwh = computeProduction(teamAction);
  // TODO: see with Gregory for renaming (should be `production` instead)?
  const powerNeedGw = productionKwh * teamAction.action.powerNeededKWh;
  const cost = productionKwh * teamAction.action.lcoe;
  const points =
    teamAction.action.pointsIntervals?.find(
      ({ min, max }) => min < teamAction.value && teamAction.value <= max
    )?.points || 0;

  const isCredible = teamAction.value <= teamAction.action.credibilityThreshold;

  return {
    productionKwh,
    powerNeedGw,
    cost,
    points,
    isCredible,
  };
}

function computeProduction(teamAction: TeamAction): number {
  if (teamAction.action.unit === "area") {
    return teamAction.value * teamAction.action.areaEnergy;
  }
  if (teamAction.action.unit === "percentage") {
    return (teamAction.value / 100) * teamAction.action.totalEnergy;
  }

  throw new Error(
    `Energy unit ${(teamAction.action as any).unit} not supported`
  );
}

function computeNewProductionData(
  performedTeamActions: TeamAction[],
  persona: Persona
) {
  const productionNameToNewProduction = Object.fromEntries(
    performedTeamActions
      .map((teamAction) => ({
        name: teamAction.action.name,
        type: teamAction.action.type,
        value: computeTeamActionStats(teamAction).productionKwh,
      }))
      .map((production) => [production.name, production])
  );
  const productionNameToProduction = Object.fromEntries(
    persona.production.map((production) => [production.name, production])
  );

  const newProduction = Object.values({
    ...productionNameToProduction,
    ...productionNameToNewProduction,
  });

  return newProduction;
}
