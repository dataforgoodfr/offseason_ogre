import { TeamAction } from "../../../utils/types";

export { computeTeamActionsStats };

function computeTeamActionsStats(
  currentStep: number,
  teamActions: TeamAction[]
) {
  const teamActionsAtCurrentStep = teamActions
    .filter((teamAction) => teamAction.action.step === currentStep)
    .sort(
      (teamActionA, teamActionB) =>
        teamActionA.action.order - teamActionB.action.order
    );

  return {
    teamActions,
    teamActionsAtCurrentStep,
  };
}
