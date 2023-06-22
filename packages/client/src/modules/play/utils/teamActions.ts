import { ProductionAction, TeamAction } from "../../../utils/types";

export { getTeamActionsAtCurrentStep };

function getTeamActionsAtCurrentStep(
  currentStep: number,
  teamActions: TeamAction[],
  productionActionById: Record<number, ProductionAction>
) {
  const teamActionsAtCurrentStep = teamActions
    .filter(
      (teamAction) =>
        productionActionById[teamAction.actionId].step === currentStep &&
        productionActionById[teamAction.actionId].isPlayable
    )
    .sort(
      (teamActionA, teamActionB) =>
        productionActionById[teamActionA.actionId].order -
        productionActionById[teamActionB.actionId].order
    );

  return teamActionsAtCurrentStep;
}
