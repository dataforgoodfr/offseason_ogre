import { Action, PlayerActions } from "../../../utils/types";

export { computePlayerActionsStats };

function computePlayerActionsStats(
  currentStep: number,
  playerActions: PlayerActions[],
  consumptionActionById: Record<number, Action>
) {
  const playerActionsAtCurrentStep = playerActions.filter(
    (pa) => consumptionActionById[pa.actionId].step === currentStep
  );

  const actionPointsUsedAtCurrentStep = playerActionsAtCurrentStep.reduce(
    (sum, pa) =>
      pa.isPerformed
        ? sum + consumptionActionById[pa.actionId].actionPointCost
        : sum,
    0
  );

  return {
    playerActionsAtCurrentStep,
    actionPointsUsedAtCurrentStep,
  };
}
