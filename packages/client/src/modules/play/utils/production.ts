import { TeamAction } from "../../../utils/types";

export { computeTeamActionStats };

function computeTeamActionStats(teamAction: TeamAction) {
  // TODO: see with Gregory for renaming (should be `power` instead)?
  const production = computeProduction(teamAction);
  // TODO: see with Gregory for renaming (should be `production` instead)?
  const powerNeed = production * teamAction.action.powerNeededKWh;
  const cost = production * teamAction.action.lcoe;
  const isCredible = teamAction.value <= teamAction.action.credibilityThreshold;

  return {
    production,
    powerNeed,
    cost,
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
