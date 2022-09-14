import { PlayerActions } from "../../../utils/types";

export { computePlayerActionsStats };

function computePlayerActionsStats(
  currentStep: number,
  playerActions: PlayerActions[]
) {
  const playerActionsAtCurrentStep = playerActions.filter(
    (pa) => pa.action.step === currentStep
  );

  const actionPointsUsedAtCurrentStep = playerActionsAtCurrentStep.reduce(
    (sum, pa) => (pa.isPerformed ? sum + pa.action.actionPointCost : sum),
    0
  );

  return {
    playerActionsAtCurrentStep,
    actionPointsUsedAtCurrentStep,
  };
}
