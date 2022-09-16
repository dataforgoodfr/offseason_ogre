import { TeamAction } from "../../../utils/types";

export { getTeamActionsAtCurrentStep };

function getTeamActionsAtCurrentStep(
  currentStep: number,
  teamActions: TeamAction[]
) {
  const teamActionsAtCurrentStep = teamActions
    .filter(
      (teamAction) =>
        teamAction.action.step === currentStep && teamAction.action.isPlayable
    )
    .sort(
      (teamActionA, teamActionB) =>
        teamActionA.action.order - teamActionB.action.order
    );

  return teamActionsAtCurrentStep;
}
