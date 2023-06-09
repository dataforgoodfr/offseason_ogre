import { STEPS } from "../../../constants";
import { computePlayerActionsStats } from "../../../utils/playerActions";
import { usePlay } from "../../playContext";
import { useMemo } from "react";
import { getTeamActionsAtCurrentStep } from "../../../utils/teamActions";

export { useCurrentPlayer };

function useCurrentPlayer() {
  const { consumptionActionById, game, players, productionActionById, teams } =
    usePlay();

  const player = useMemo(() => players[0], [players]);
  const team = useMemo(() => teams[0], [teams]);
  const teamActionsAtCurrentStep = useMemo(
    () =>
      getTeamActionsAtCurrentStep(
        game.step,
        team.actions,
        productionActionById
      ),
    [game.step, team.actions, productionActionById]
  );

  return {
    player,
    playerActions: player.actions,
    actionPointsAvailableAtCurrentStep: STEPS[game.step].availableActionPoints,
    teamActions: team.actions,
    teamActionsAtCurrentStep,
    ...computePlayerActionsStats(
      game.step,
      player.actions,
      consumptionActionById
    ),
  };
}
