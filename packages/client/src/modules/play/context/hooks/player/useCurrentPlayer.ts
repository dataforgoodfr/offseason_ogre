import { STEPS } from "../../../constants";
import { computePlayerActionsStats } from "../../../utils/playerActions";
import { usePlay } from "../../playContext";
import { useMemo } from "react";
import { getTeamActionsAtCurrentStep } from "../../../utils/teamActions";
import { useAuth } from "../../../../auth/authProvider";

export { useCurrentPlayer };

function useCurrentPlayer() {
  const { user } = useAuth();
  const { consumptionActionById, game, players, productionActionById, teams } =
    usePlay();

  const player = useMemo(
    () => players.find((p) => p.userId === user?.id)!,
    [players, user]
  );
  const team = useMemo(
    () => teams.find((t) => t.id === player.teamId) || null,
    [player, teams]
  );
  const teamActionsAtCurrentStep = useMemo(() => {
    if (!team?.actions) {
      return [];
    }

    return getTeamActionsAtCurrentStep(
      game.step,
      team.actions,
      productionActionById
    );
  }, [game.step, team?.actions, productionActionById]);
  const personalization = useMemo(
    () => player?.profile?.personalization || {},
    [player?.profile?.personalization]
  );

  return {
    player,
    profile: player.profile,
    personalization,
    playerActions: player.actions,
    actionPointsAvailableAtCurrentStep: STEPS[game.step].availableActionPoints,
    team,
    teamActions: team?.actions || [],
    teamActionsAtCurrentStep,
    ...computePlayerActionsStats(
      game.step,
      player.actions,
      consumptionActionById
    ),
  };
}
